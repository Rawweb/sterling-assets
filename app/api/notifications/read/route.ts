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
    body = {};
  }

  const { id, all } = body as { id?: unknown; all?: unknown };

  if (all === true) {
    // mark every unread notification for this user
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (typeof id === 'string') {
    // mark one, scoped to this user so they can't touch others'
    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ error: 'Nothing to mark.' }, { status: 400 });
}
