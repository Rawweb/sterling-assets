import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createPasswordResetToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/mail';

// Always return this exact message regardless of whether the email exists.
// Returning a different message would let an attacker enumerate registered emails.
const OK = {
  message:
    'If that email is registered, you will receive a reset link shortly.',
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) return NextResponse.json(OK);

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = await createPasswordResetToken(user.id);
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

      // Fire-and-forget. A mail failure must never reveal whether the user exists.
      sendPasswordResetEmail(user.email, user.fullName, resetUrl).catch(
        () => {},
      );
    }

    return NextResponse.json(OK);
  } catch {
    // Even on unexpected errors, return the generic message.
    return NextResponse.json(OK);
  }
}
