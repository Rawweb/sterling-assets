import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createPasswordResetToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/mail';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { checkLimit, getIP } from '@/lib/rate-limit';

// Always return this exact message regardless of what happened.
// Identical response on rate-limit, bad email, and success prevents
// any form of enumeration through this endpoint.
const OK = {
  message:
    'If that email is registered, you will receive a reset link shortly.',
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // reCAPTCHA — fail silently (return OK) to stay enumeration-safe.
    const recaptchaToken = (body as Record<string, unknown>).recaptchaToken;
    if (
      typeof recaptchaToken !== 'string' ||
      !(await verifyRecaptcha(recaptchaToken))
    ) {
      return NextResponse.json(OK);
    }

    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email) return NextResponse.json(OK);

    // Per-IP limit: 10 requests per hour.
    // Primary DoS backstop — catches bulk requests from one source.
    const ip = getIP(req);
    const ipCheck = checkLimit(`forgot:ip:${ip}`, 10, 60 * 60_000);
    if (ipCheck.limited) return NextResponse.json(OK); // enumeration-safe: same response

    // Per-email limit: 3 reset emails per hour per address.
    // This is the primary control for the email-bombing risk —
    // the attacker's leverage here is the target's inbox, not source IP,
    // so IP limiting alone would not catch a distributed email-bombing campaign.
    const emailCheck = checkLimit(`forgot:email:${email}`, 3, 60 * 60_000);
    if (emailCheck.limited) return NextResponse.json(OK); // enumeration-safe: same response

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = await createPasswordResetToken(user.id);
      const resetUrl = `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
      // Fire-and-forget: email delivery failure must not change the response.
      sendPasswordResetEmail(user.email, user.fullName, resetUrl).catch(
        () => {},
      );
    }

    return NextResponse.json(OK);
  } catch {
    return NextResponse.json(OK);
  }
}
