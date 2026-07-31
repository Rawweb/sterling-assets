import 'server-only';
import { prisma } from './db';

export async function getAdminPlans() {
  return prisma.plan.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      minCents: true,
      maxCents: true,
      dailyRatePct: true,
      durationDays: true,
      referralPct: true,
      active: true,
      createdAt: true,
    },
  });
}

export type AdminPlan = Awaited<ReturnType<typeof getAdminPlans>>[number];

export async function getActiveUserPlans() {
  return prisma.userPlan.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { startedAt: 'desc' },
    select: {
      id: true,
      planName: true,
      investedCents: true,
      dailyRatePct: true,
      durationDays: true,
      daysPaid: true,
      accruedProfitCents: true,
      startedAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export type ActiveUserPlan = Awaited<
  ReturnType<typeof getActiveUserPlans>
>[number];
