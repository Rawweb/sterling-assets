import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { checkLimit, tooManyRequests } from '@/lib/rate-limit';


export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // Per-user limit: 10 investment requests per hour.
  const limit = checkLimit(`invest:user:${user.id}`, 10, 60 * 60_000);
  if (limit.limited) return tooManyRequests(limit.retryAfterMs);

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
      await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user.id} FOR UPDATE`;

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

      // referral bonus: first investment only, credit the referrer 5%
      const investor = await tx.user.findUnique({
        where: { id: user.id },
        select: { referredBy: true, referralBonusPaid: true },
      });

      if (investor?.referredBy && !investor.referralBonusPaid) {
        // confirm the referrer still exists
        const referrer = await tx.user.findUnique({
          where: { id: investor.referredBy },
          select: { id: true },
        });

        if (referrer) {
          const bonus = Math.round(amount * 0.05); // 5% of the investment

          await tx.ledger.create({
            data: {
              userId: referrer.id,
              amount: bonus,
              type: 'REFERRAL_BONUS',
              referenceId: userPlan.id,
            },
          });

          // mark paid so it never fires again for this user
          await tx.user.update({
            where: { id: user.id },
            data: { referralBonusPaid: true },
          });
        }
      }

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
