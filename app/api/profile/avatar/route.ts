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

  const { avatarUrl } = body as { avatarUrl?: unknown };

  // Only accept real Cloudinary URLs — prevents arbitrary URL injection.
  if (
    typeof avatarUrl !== 'string' ||
    !avatarUrl.startsWith('https://res.cloudinary.com/')
  ) {
    return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl },
  });

  return NextResponse.json({ updated: true });
}
