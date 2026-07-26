import 'server-only';
import { prisma } from './db';
import type { LedgerType } from '@/lib/generated/prisma/client';

const TYPE_LABEL: Record<LedgerType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  WITHDRAWAL_REVERSAL: 'Withdrawal reversed',
  PROFIT: 'Profit',
  INVESTMENT: 'Investment',
  BONUS: 'Bonus',
  REFERRAL_BONUS: 'Referral bonus',
  ADJUSTMENT: 'Adjustment',
};

export async function getRecentTransactions(userId: string, take = 5) {
  const rows = await prisma.ledger.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take,
    select: { id: true, amount: true, type: true, createdAt: true },
  });

  return rows.map((r) => ({
    id: r.id,
    label: TYPE_LABEL[r.type],
    amountCents: r.amount,
    createdAt: r.createdAt,
  }));
}

export type RecentTransaction = Awaited<
  ReturnType<typeof getRecentTransactions>
>[number];


export async function getOtherTransactions(userId: string) {
  const rows = await prisma.ledger.findMany({
    where: {
      userId,
      type: {
        notIn: ['DEPOSIT', 'WITHDRAWAL'],
      },
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, amount: true, type: true, createdAt: true },
  });

  return rows.map((r) => ({
    id: r.id,
    label: TYPE_LABEL[r.type],
    amountCents: r.amount,
    createdAt: r.createdAt,
  }));
}

export type OtherTransaction = Awaited<
  ReturnType<typeof getOtherTransactions>
>[number];