import 'server-only';
import { prisma } from './db';

export async function getBalance(userId: string): Promise<number> {
  const result = await prisma.ledger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

export async function getSummary(userId: string) {
  const rows = await prisma.ledger.groupBy({
    by: ['type'],
    where: { userId },
    _sum: { amount: true },
  });

  const byType = (t: string) =>
    rows.find((r) => r.type === t)?._sum.amount ?? 0;

  const balance = rows.reduce((sum, r) => sum + (r._sum.amount ?? 0), 0);

  return {
    balanceCents: balance,
    totalProfitCents: byType('PROFIT'),
    bonusCents: byType('BONUS'),
    referralBonusCents: byType('REFERRAL_BONUS'),
    totalDepositCents: byType('DEPOSIT'),
    // withdrawals are stored negative; flip the sign for display
    totalWithdrawalCents: Math.abs(byType('WITHDRAWAL')),
  };
}
