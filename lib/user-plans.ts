import 'server-only';
import { prisma } from './db';

export async function getUserPlans(userId: string) {
  const plans = await prisma.userPlan.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  });

  return plans.map((p) => ({
    id: p.id,
    planName: p.planName,
    investedCents: p.investedCents,
    durationDays: p.durationDays,
    daysPaid: p.daysPaid,
    status: p.status,
    startedAt: p.startedAt,
    earnedCents: p.accruedProfitCents,
  }));
}

export type UserPlanView = Awaited<ReturnType<typeof getUserPlans>>[number];
