import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { createVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';
import { setPendingEmail } from '@/lib/session';
import { generateReferralCode } from '@/lib/referral';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        error: 'Please check the form',
        fields: z.flattenError(result.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { fullName, email, phone, password, country, referral } = result.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // this user's own unique code
    const referralCode = await generateReferralCode();

    // resolve the entered referral code to a referrer id, if valid
    let referredBy: string | null = null;
    if (referral) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referral },
        select: { id: true },
      });
      referredBy = referrer?.id ?? null;
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        country,
        passwordHash,
        referralCode,
        referredBy,
      },
      select: { id: true, email: true, fullName: true },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'WELCOME',
        title: 'Welcome to Sterling Assets Holdings',
        body: 'Your account has been created. Complete your identity verification to unlock all features.',
      },
    });

    const token = await createVerificationToken(user.id);
    await setPendingEmail(user.email);

    let emailSent = true;
    try {
      await sendVerificationEmail(user.email, token, user.fullName);
    } catch (mailError) {
      console.error('Verification email failed to send:', mailError);
      emailSent = false;
    }

    return Response.json({ ok: true, user, emailSent }, { status: 201 });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    console.error('Register failed:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
