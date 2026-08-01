import 'server-only';

// Verify a reCAPTCHA v3 token against Google's API.
// Returns true if the token is valid and the score meets the threshold.
// Returns true unconditionally if the secret key is not configured,
// so local dev works without a key.

console.log(
  'RECAPTCHA_SECRET_KEY present:',
  !!process.env.RECAPTCHA_SECRET_KEY,
);

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn('RECAPTCHA_SECRET_KEY not set — skipping verification.');
    return true;
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json();

    // v3 returns a score 0–1. 0.5 is the standard threshold.
    // 1.0 = very likely human. 0.0 = very likely bot.
    return data.success === true && (data.score ?? 0) >= 0.5;
  } catch {
    // If the verification request itself fails, fail open in dev
    // and fail closed in production.
    return process.env.NODE_ENV !== 'production';
  }
}
