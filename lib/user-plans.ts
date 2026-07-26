import 'server-only';
import { prisma } from './db';

export async function getUserPlans(userId: string) {
  const plans = await prisma.userPlan.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  });

  // earnings per plan = sum of PROFIT ledger rows referencing that plan
  const profits = await prisma.ledger.groupBy({
    by: ['referenceId'],
    where: {
      userId,
      type: 'PROFIT',
      referenceId: { in: plans.map((p) => p.id) },
    },
    _sum: { amount: true },
  });

  const earnedByPlan = new Map(
    profits.map((row) => [row.referenceId, row._sum.amount ?? 0]),
  );

  return plans.map((p) => ({
    id: p.id,
    planName: p.planName,
    investedCents: p.investedCents,
    durationDays: p.durationDays,
    daysPaid: p.daysPaid,
    status: p.status,
    startedAt: p.startedAt,
    earnedCents: earnedByPlan.get(p.id) ?? 0,
  }));
}

export type UserPlanView = Awaited<ReturnType<typeof getUserPlans>>[number];
