import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNotification, emailNotification } from '@/lib/notify';
import { formatCents } from '@/lib/money';

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
      // the transaction returns any email that should be sent after it commits
      const emailToSend = await prisma.$transaction(async (tx) => {
        if (plan.daysPaid >= plan.durationDays) {
          return null;
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

          const prefPlan = await tx.user.findUnique({
            where: { id: plan.userId },
            select: { notifyPlanExpiry: true },
          });

          completed++;
          paid++;

          if (prefPlan?.notifyPlanExpiry) {
            const title = 'Investment plan completed';
            const body = `Your ${plan.planName} plan has completed. Profit and principal have been credited to your balance.`;
            // in-app notification (gated by notifyPlanExpiry)
            await createNotification(
              tx,
              plan.userId,
              'PLAN_COMPLETED',
              title,
              body,
            );
            // return the email so it can be sent after commit
            return { userId: plan.userId, title, body };
          }
          return null;
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

          const prefProfit = await tx.user.findUnique({
            where: { id: plan.userId },
            select: { notifyProfit: true },
          });

          paid++;

          if (prefProfit?.notifyProfit) {
            const title = 'Profit earned';
            const body = `You earned ${formatCents(dailyProfit)} today on your ${plan.planName} plan.`;
            // in-app notification (gated by notifyProfit)
            await createNotification(
              tx,
              plan.userId,
              'PROFIT_EARNED',
              title,
              body,
            );
            // return the email so it can be sent after commit
            return { userId: plan.userId, title, body };
          }
          return null;
        }
      });

      // email notification (sent after this plan's transaction commits, best-effort)
      if (emailToSend) {
        await emailNotification(
          emailToSend.userId,
          emailToSend.title,
          emailToSend.body,
        );
      }
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
