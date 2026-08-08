import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { consumePasswordResetToken } from '@/lib/token';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.length < 8 ||
      password.length > 72
    ) {
      return NextResponse.json(
        { error: 'Password must be between 8 and 72 characters.' },
        { status: 400 },
      );
    }

    const result = await consumePasswordResetToken(token);

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            'This reset link is invalid or has expired. Please request a new one.',
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Update the password and wipe all active sessions in one transaction.
    // This forces any attacker who triggered the reset to log in again.
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: result.userId } }),
      prisma.user.update({
        where: { id: result.userId },
        data: { passwordHash },
      }),
    ]);

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
