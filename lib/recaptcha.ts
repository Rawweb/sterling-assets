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

  // An empty token is never valid. Fail closed instead of making a
  // network call to Google for a request that can't possibly pass.
  if (!token) return false;

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
