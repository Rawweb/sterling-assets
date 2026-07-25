import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  // 1. auth
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // 2. parse body safely
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const { amount, coin, proofUrl } = body as {
    amount?: unknown;
    coin?: unknown;
    proofUrl?: unknown;
  };

  // 3. validate types
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: 'Amount must be a positive whole number of cents.' },
      { status: 400 },
    );
  }
  if (typeof coin !== 'string' || coin.trim() === '') {
    return NextResponse.json({ error: 'Coin is required.' }, { status: 400 });
  }
  if (typeof proofUrl !== 'string' || proofUrl.trim() === '') {
    return NextResponse.json(
      { error: 'Proof of payment is required.' },
      { status: 400 },
    );
  }

  // 4. validate coin against the real wallet table + enforce its minimum
  const wallet = await prisma.walletAddress.findUnique({ where: { coin } });
  if (!wallet) {
    return NextResponse.json({ error: 'Unsupported coin.' }, { status: 400 });
  }
  if (amount < wallet.minCents) {
    return NextResponse.json(
      { error: `Minimum deposit for ${coin} is ${wallet.minCents} cents.` },
      { status: 400 },
    );
  }

  // 5. create the deposit as PENDING. No ledger write. No balance change.
  const deposit = await prisma.deposit.create({
    data: {
      userId: user.id,
      amount,
      coin,
      proofUrl,
      status: 'PENDING',
    },
    select: {
      id: true,
      amount: true,
      coin: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ deposit }, { status: 201 });
}
