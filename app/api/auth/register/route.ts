import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { createVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';
import { setPendingEmail } from '@/lib/session';
import { generateReferralCode } from '@/lib/referral';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { checkLimit, getIP, tooManyRequests } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Verify reCAPTCHA before touching the database.
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

  // Per-IP limit: 5 registrations per hour.
  // Stricter than login — account farming has a lower legitimate-use ceiling.
  const ip = getIP(req);
  const ipCheck = checkLimit(`register:ip:${ip}`, 5, 60 * 60_000);
  if (ipCheck.limited) return tooManyRequests(ipCheck.retryAfterMs);

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
    const referralCode = await generateReferralCode();

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
