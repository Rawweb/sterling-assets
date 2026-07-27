import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const { fullName, phone } = body as { fullName?: unknown; phone?: unknown };

  if (typeof fullName !== 'string' || fullName.trim().length < 2) {
    return NextResponse.json(
      { error: 'Enter a valid full name.' },
      { status: 400 },
    );
  }
  if (typeof phone !== 'string' || phone.trim().length < 5) {
    return NextResponse.json(
      { error: 'Enter a valid phone number.' },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { fullName: fullName.trim(), phone: phone.trim() },
  });

  return NextResponse.json({ updated: true }, { status: 200 });
}
