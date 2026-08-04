import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getBalance } from '@/lib/ledger';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const balanceCents = await getBalance(user.id);
  return NextResponse.json({ balanceCents });
}
