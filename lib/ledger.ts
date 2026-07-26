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

  // total withdrawal = approved withdrawals only, from the Withdrawal table
  const withdrawn = await prisma.withdrawal.aggregate({
    where: { userId, status: 'APPROVED' },
    _sum: { amount: true },
  });

  // profit still accruing on active plans (not yet released to the ledger)
  const activeAccrued = await prisma.userPlan.aggregate({
    where: { userId, status: 'ACTIVE' },
    _sum: { accruedProfitCents: true },
  });

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
