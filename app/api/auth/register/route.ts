import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validation';

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

  const { fullName, email, phone, password, country } = result.data;

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

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        country,
        passwordHash,
      },
      select: { id: true, email: true, fullName: true },
    });

    return Response.json({ ok: true, user }, { status: 201 });
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
