import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { createNotification } from '@/lib/notify';
import { formatCents } from '@/lib/money';

const MIN_WITHDRAWAL_CENTS = 5000;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // KYC gate — server-enforced, §6
  if (user.kycStatus !== 'APPROVED') {
    return NextResponse.json(
      { error: 'Identity verification required before withdrawing.' },
      { status: 403 },
    );
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

  const { amount, coin, address } = body as {
    amount?: unknown;
    coin?: unknown;
    address?: unknown;
  };

  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: 'Amount must be a positive whole number of cents.' },
      { status: 400 },
    );
  }
  if (amount < MIN_WITHDRAWAL_CENTS) {
    return NextResponse.json(
      { error: `Minimum withdrawal is ${MIN_WITHDRAWAL_CENTS} cents.` },
      { status: 400 },
    );
  }
  if (typeof coin !== 'string' || coin.trim() === '') {
    return NextResponse.json({ error: 'Coin is required.' }, { status: 400 });
  }
  if (typeof address !== 'string' || address.trim() === '') {
    return NextResponse.json(
      { error: 'Payout address is required.' },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // current balance, computed inside the transaction
      const agg = await tx.ledger.aggregate({
        where: { userId: user.id },
        _sum: { amount: true },
      });
      const balance = agg._sum.amount ?? 0;

      if (amount > balance) {
        return {
          error: 'Amount exceeds your available balance.',
          status: 400 as const,
        };
      }

      // create the withdrawal request
      const withdrawal = await tx.withdrawal.create({
        data: { userId: user.id, amount, coin, address, status: 'PENDING' },
      });

      // HOLD: debit the balance now, at request time
      await tx.ledger.create({
        data: {
          userId: user.id,
          amount: -amount, // negative, the hold debit
          type: 'WITHDRAWAL',
          referenceId: withdrawal.id,
        },
      });

      const prefReq = await tx.user.findUnique({
        where: { id: user.id },
        select: { notifyWithdrawal: true },
      });
      if (prefReq?.notifyWithdrawal) {
        await createNotification(
          tx,
          user.id,
          'WITHDRAWAL_INITIATED',
          'Withdrawal initiated',
          `Your withdrawal of ${formatCents(amount)} has been initiated and will be processed shortly.`,
        );
      }

      return {
        ok: true as const,
        withdrawal: {
          id: withdrawal.id,
          amount: withdrawal.amount,
          coin: withdrawal.coin,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt,
        },
      };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      { withdrawal: result.withdrawal },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Could not submit the withdrawal. Please try again.' },
      { status: 500 },
    );
  }
}
