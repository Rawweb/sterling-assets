import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { createSession, setPendingEmail } from '@/lib/session';

const DUMMY_HASH = '$2b$12$abcdefghijklmnopqrstuuWDlDPmZuGtaEYIvHTQyyBpNZ8p9L6';

const INVALID = 'Invalid email or password';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

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
      },
    });

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      return Response.json({ error: INVALID }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json({ error: INVALID }, { status: 401 });
    }

    if (!user.emailVerified) {
      await setPendingEmail(email)
      return Response.json(
        {
          error: 'Please verify your email before signing in',
          code: 'UNVERIFIED',
        },
        { status: 403 },
      );
    }

    await createSession(user.id, remember);

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Login failed:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
