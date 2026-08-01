import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createPasswordResetToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/mail';
import { verifyRecaptcha } from '@/lib/recaptcha';

// Always return this exact message regardless of what happened.
// Returning a different message on reCAPTCHA failure would still
// be safe, but returning OK everywhere is the simplest policy.
const OK = {
  message:
    'If that email is registered, you will receive a reset link shortly.',
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Verify reCAPTCHA. On failure, still return the generic OK
    // so this endpoint cannot be used to probe for bot detection.
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

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = await createPasswordResetToken(user.id);
      const resetUrl = `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
      sendPasswordResetEmail(user.email, user.fullName, resetUrl).catch(
        () => {},
      );
    }

    return NextResponse.json(OK);
  } catch {
    return NextResponse.json(OK);
  }
}
