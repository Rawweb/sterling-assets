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
      const deposit = await tx.deposit.findUnique({ where: { id } });

      if (!deposit) {
        return { error: 'Deposit not found.', status: 404 as const };
      }
      if (deposit.status !== 'PENDING') {
        return { error: 'This deposit is not pending.', status: 409 as const };
      }

      await tx.deposit.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'DEPOSIT_REJECTED',
          targetId: deposit.id,
        },
      });

      // in-app notification (deposit always notifies)
      await createNotification(
        tx,
        deposit.userId,
        'DEPOSIT_REJECTED',
        'Deposit rejected',
        `Your deposit of ${formatCents(deposit.amount)} could not be approved. Please contact support if you need help.`,
      );

      return {
        ok: true as const,
        email: {
          userId: deposit.userId,
          title: 'Deposit rejected',
          body: `Your deposit of ${formatCents(deposit.amount)} could not be approved. Please contact support if you need help.`,
        },
      };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // email notification (after commit, best-effort)
    await emailNotification(
      result.email.userId,
      result.email.title,
      result.email.body,
    );

    return NextResponse.json({ rejected: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not reject the deposit. Please try again.' },
      { status: 500 },
    );
  }
}
