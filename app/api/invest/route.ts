import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
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

  const { planId, amount } = body as { planId?: unknown; amount?: unknown };

  if (typeof planId !== 'string' || planId.trim() === '') {
    return NextResponse.json({ error: 'Plan is required.' }, { status: 400 });
  }
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: 'Amount must be a positive whole number of cents.' },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // fetch the plan, must exist and be active
      const plan = await tx.plan.findUnique({ where: { id: planId } });
      if (!plan || !plan.active) {
        return { error: 'Plan not available.', status: 400 as const };
      }

      // enforce the plan's own min/max
      if (amount < plan.minCents) {
        return {
          error: `Minimum for ${plan.name} is ${plan.minCents} cents.`,
          status: 400 as const,
        };
      }
      if (plan.maxCents !== null && amount > plan.maxCents) {
        return {
          error: `Maximum for ${plan.name} is ${plan.maxCents} cents.`,
          status: 400 as const,
        };
      }

      // balance check, inside the transaction
      const agg = await tx.ledger.aggregate({
        where: { userId: user.id },
        _sum: { amount: true },
      });
      const balance = agg._sum.amount ?? 0;
      if (amount > balance) {
        return {
          error: 'Not enough balance for this investment.',
          status: 400 as const,
        };
      }

      // create the active plan, snapshotting terms
      const userPlan = await tx.userPlan.create({
        data: {
          userId: user.id,
          planId: plan.id,
          planName: plan.name,
          investedCents: amount,
          dailyRatePct: plan.dailyRatePct,
          durationDays: plan.durationDays,
          status: 'ACTIVE',
        },
      });

      // debit the balance, the principal moves into the plan
      await tx.ledger.create({
        data: {
          userId: user.id,
          amount: -amount, // negative, principal leaves spendable balance
          type: 'INVESTMENT',
          referenceId: userPlan.id,
        },
      });

      return {
        ok: true as const,
        userPlan: {
          id: userPlan.id,
          planName: userPlan.planName,
          investedCents: userPlan.investedCents,
          durationDays: userPlan.durationDays,
        },
      };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ userPlan: result.userPlan }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Could not complete the investment. Please try again.' },
      { status: 500 },
    );
  }
}
