import 'server-only';

/**
 * Verify a reCAPTCHA v2 Invisible token against Google's siteverify API.
 * v2 returns success: true/false with no score — a definitive pass or fail.
 * Returns true unconditionally when the secret key is not set so local
 * development works without credentials.
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn(
      '[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — skipping verification.',
    );
    return true;
  }

  // Empty token means the caller is skipping captcha intentionally
  // (e.g. authenticated dashboard contact form). Allow it through.
  if (!token) return true;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      // Prevent Next.js from caching this — every token is single-use.
      cache: 'no-store',
    });

    const data = await res.json();

    // v2: success means the user passed. No score involved.
    return data.success === true;
  } catch {
    // Network failure: fail open in dev, fail closed in production.
    return process.env.NODE_ENV !== 'production';
  }
}
