import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { createSession, setPendingEmail } from '@/lib/session';
import { verifyRecaptcha } from '@/lib/recaptcha';
import {
  checkLimit,
  clearFailures,
  getIP,
  recordFailure,
  tooManyRequests,
} from '@/lib/rate-limit';

const DUMMY_HASH = '$2b$12$abcdefghijklmnopqrstuuWDlDPmZuGtaEYIvHTQyyBpNZ8p9L6';
const INVALID = 'Invalid email or password';

export async function POST(req: NextRequest) {
  // TEMP: verifying Render's x-forwarded-for append behavior — remove after testing.
  console.log('XFF:', req.headers.get('x-forwarded-for'));

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Verify reCAPTCHA before any database work.
  const recaptchaToken = (body as Record<string, unknown>).recaptchaToken;
  if (
    typeof recaptchaToken !== 'string' ||
    !(await verifyRecaptcha(recaptchaToken))
  ) {
    return Response.json(
      { error: 'Security check failed. Please try again.' },
      { status: 400 },
    );
  }

  // Per-IP limit: 20 attempts per 15 minutes.
  // Catches high-volume single-source abuse and acts as a DoS backstop
  // regardless of intent.
  const ip = getIP(req);
  const ipCheck = checkLimit(`login:ip:${ip}`, 20, 15 * 60_000);
  if (ipCheck.limited) return tooManyRequests(ipCheck.retryAfterMs);

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: INVALID }, { status: 401 });
  }

  const { email, password, remember } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        emailVerified: true,
        role: true,
      },
    });

    if (!user) {
      // Run the dummy hash to prevent timing-based user enumeration.
      await bcrypt.compare(password, DUMMY_HASH);
      // Still record a failure against the submitted email so a distributed
      // attacker hitting one account repeatedly is throttled.
      const delay = recordFailure(email);
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      return Response.json({ error: INVALID }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      // Per-email progressive throttle: slows brute force without lockout.
      // Backoff grows with each failure; resets after 15 min of no attempts.
      const delay = recordFailure(email);
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      return Response.json({ error: INVALID }, { status: 401 });
    }

    // Correct password — clear any accumulated failure count.
    clearFailures(email);

    if (!user.emailVerified) {
      await setPendingEmail(email);
      return Response.json(
        {
          error: 'Please verify your email before signing in',
          code: 'UNVERIFIED',
        },
        { status: 403 },
      );
    }

    await createSession(user.id, remember);

    return Response.json({ ok: true, role: user.role }, { status: 200 });
  } catch (error) {
    console.error('Login failed:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
