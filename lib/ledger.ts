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
  // three independent queries, run together instead of sequence
  const [rows, withdrawn, activeAccrued] = await Promise.all([
    prisma.ledger.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: { userId, status: 'APPROVED' },
      _sum: { amount: true },
    }),
    prisma.userPlan.aggregate({
      where: { userId, status: 'ACTIVE' },
      _sum: { accruedProfitCents: true },
    }),
  ]);

  const byType = (t: string) =>
    rows.find((r) => r.type === t)?._sum.amount ?? 0;

  const balance = rows.reduce((sum, r) => sum + (r._sum.amount ?? 0), 0);

  const totalProfit =
    byType('PROFIT') + (activeAccrued._sum.accruedProfitCents ?? 0);

  return {
    balanceCents: balance,
    totalProfitCents: totalProfit,
    bonusCents: byType('BONUS'),
    referralBonusCents: byType('REFERRAL_BONUS'),
    totalDepositCents: byType('DEPOSIT'),
    totalWithdrawalCents: withdrawn._sum.amount ?? 0,
  };
}
