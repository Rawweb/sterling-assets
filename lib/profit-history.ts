import 'server-only';
import { prisma } from './db';

export async function getProfitHistory(userId: string) {
  // profit released to the ledger, joined to the plan that produced it
  const rows = await prisma.ledger.findMany({
    where: { userId, type: 'PROFIT' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, amount: true, createdAt: true, referenceId: true },
  });

  // look up plan names for the referenced plans
  const planIds = rows
    .map((r) => r.referenceId)
    .filter((x): x is string => !!x);
  const plans = await prisma.userPlan.findMany({
    where: { id: { in: planIds } },
    select: { id: true, planName: true },
  });
  const nameById = new Map(plans.map((p) => [p.id, p.planName]));

  return rows.map((r) => ({
    id: r.id,
    planName: r.referenceId ? (nameById.get(r.referenceId) ?? 'Plan') : 'Plan',
    amountCents: r.amount,
    createdAt: r.createdAt,
  }));
}

export type ProfitHistoryRow = Awaited<
  ReturnType<typeof getProfitHistory>
>[number];
