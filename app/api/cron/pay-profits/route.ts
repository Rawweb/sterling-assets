import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// pays daily profit to every active plan that hasn't been paid today,
// and returns principal + completes plans that reach their term.
export async function POST(req: Request) {
  // secret guard — only a caller with the secret may trigger payouts
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  // start of today, UTC — used to skip plans already paid today
  const now = new Date();
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  // find active plans not yet paid today
  const plans = await prisma.userPlan.findMany({
    where: {
      status: 'ACTIVE',
      OR: [{ lastPaidAt: null }, { lastPaidAt: { lt: startOfToday } }],
    },
  });

  let paid = 0;
  let completed = 0;
  const errors: string[] = [];

  // each plan in its own transaction — one failure doesn't block the rest
  for (const plan of plans) {
    try {
     await prisma.$transaction(async (tx) => {
       if (plan.daysPaid >= plan.durationDays) {
         return;
       }

       const dailyProfit = Math.round(
         (plan.investedCents * plan.dailyRatePct) / 100,
       );
       const newDaysPaid = plan.daysPaid + 1;
       const newAccrued = plan.accruedProfitCents + dailyProfit;
       const isFinalDay = newDaysPaid >= plan.durationDays;

       if (isFinalDay) {
         // release everything: full accrued profit + principal, both to the ledger now
         await tx.ledger.create({
           data: {
             userId: plan.userId,
             amount: newAccrued, // total profit, released to spendable balance
             type: 'PROFIT',
             referenceId: plan.id,
           },
         });

         await tx.ledger.create({
           data: {
             userId: plan.userId,
             amount: plan.investedCents, // principal back
             type: 'PRINCIPAL_RETURN',
             referenceId: plan.id,
           },
         });

         await tx.userPlan.update({
           where: { id: plan.id },
           data: {
             daysPaid: newDaysPaid,
             accruedProfitCents: newAccrued,
             lastPaidAt: now,
             status: 'COMPLETED',
             completedAt: now,
           },
         });
         completed++;
       } else {
         // still running: accrue profit on the plan only, NOTHING to the ledger
         await tx.userPlan.update({
           where: { id: plan.id },
           data: {
             daysPaid: newDaysPaid,
             accruedProfitCents: newAccrued,
             lastPaidAt: now,
           },
         });
       }

       paid++;
     });
    } catch {
      errors.push(plan.id);
    }
  }

  return NextResponse.json({
    ranAt: now.toISOString(),
    plansPaid: paid,
    plansCompleted: completed,
    failed: errors,
  });
}
