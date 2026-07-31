import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { createNotification, emailNotification } from '@/lib/notify';
import { formatCents } from '@/lib/money';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const userPlan = await tx.userPlan.findUnique({ where: { id } });

      if (!userPlan) {
        return { error: 'Plan not found.', status: 404 as const };
      }
      if (userPlan.status !== 'ACTIVE') {
        return { error: 'This plan is not active.', status: 409 as const };
      }

      // Mark the plan as cancelled.
      await tx.userPlan.update({
        where: { id },
        data: { status: 'CANCELLED', completedAt: new Date() },
      });

      // Return the principal to the user's spendable balance.
      // Accrued profit is discarded — it was never in the ledger so
      // no reversal row is needed. The accruedProfitCents column
      // simply stays on the cancelled record for audit reference.
      await tx.ledger.create({
        data: {
          userId: userPlan.userId,
          amount: userPlan.investedCents, // positive credit
          type: 'PRINCIPAL_RETURN',
          referenceId: userPlan.id,
        },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'USER_PLAN_CANCELLED',
          targetId: userPlan.id,
        },
      });

      const title = 'Investment plan cancelled';
      const body = `Your ${userPlan.planName} plan has been cancelled. Your principal of ${formatCents(userPlan.investedCents)} has been returned to your balance.`;

      // Plan cancellation always notifies — no preference gate.
      await createNotification(
        tx,
        userPlan.userId,
        'PLAN_CANCELLED',
        title,
        body,
      );

      return {
        ok: true as const,
        email: { userId: userPlan.userId, title, body },
      };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // Email fires after commit, best-effort.
    await emailNotification(
      result.email.userId,
      result.email.title,
      result.email.body,
    );

    return NextResponse.json({ cancelled: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not cancel the plan. Please try again.' },
      { status: 500 },
    );
  }
}
