import 'server-only';
import { prisma } from './db';

export async function getActivePlans() {
  return prisma.plan.findMany({
    where: { active: true },
    orderBy: { minCents: 'asc' },
    select: {
      id: true,
      name: true,
      minCents: true,
      maxCents: true,
      dailyRatePct: true,
      durationDays: true,
      referralPct: true,
    },
  });
}

export type Plan = Awaited<ReturnType<typeof getActivePlans>>[number];
