import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCurrentUser, revokeOtherSessions } from '@/lib/session';
import { prisma } from '@/lib/db';
import { checkLimit, tooManyRequests } from '@/lib/rate-limit';


export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // Per-user limit: 5 password-change attempts per hour.
  const limit = checkLimit(`change-pw:user:${user.id}`, 5, 60 * 60_000);
  if (limit.limited) return tooManyRequests(limit.retryAfterMs);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const { current, next } = body as { current?: unknown; next?: unknown };

  if (typeof current !== 'string' || current === '') {
    return NextResponse.json(
      { error: 'Current password is required.' },
      { status: 400 },
    );
  }
  if (typeof next !== 'string' || next.length < 8 || next.length > 72) {
    return NextResponse.json(
      { error: 'New password must be between 8 and 72 characters.' },
      { status: 400 },
    );
  }

  // fetch the stored hash — getCurrentUser doesn't select it
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!record) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
  }

  // verify the current password
  const valid = await bcrypt.compare(current, record.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: 'Your current password is incorrect.' },
      { status: 400 },
    );
  }

  // prevent setting the same password
  const same = await bcrypt.compare(next, record.passwordHash);
  if (same) {
    return NextResponse.json(
      { error: 'New password must be different from your current one.' },
      { status: 400 },
    );
  }

  const newHash = await bcrypt.hash(next, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  await revokeOtherSessions(user.id);

  return NextResponse.json({ updated: true }, { status: 200 });
}
