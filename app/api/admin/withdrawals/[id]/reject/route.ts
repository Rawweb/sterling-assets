import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { createNotification } from '@/lib/notify';
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
      const withdrawal = await tx.withdrawal.findUnique({ where: { id } });

      if (!withdrawal) {
        return { error: 'Withdrawal not found.', status: 404 as const };
      }
      if (withdrawal.status !== 'PENDING') {
        return {
          error: 'This withdrawal is not pending.',
          status: 409 as const,
        };
      }

      // flip status FIRST — this is the lock that stops double-refund
      await tx.withdrawal.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

      // REVERSAL: return the held money to the balance
      await tx.ledger.create({
        data: {
          userId: withdrawal.userId,
          amount: withdrawal.amount, // positive, returns the hold
          type: 'WITHDRAWAL_REVERSAL',
          referenceId: withdrawal.id,
        },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'WITHDRAWAL_REJECTED',
          targetId: withdrawal.id,
        },
      });

      
      const prefRej = await tx.user.findUnique({
        where: { id: withdrawal.userId },
        select: { notifyWithdrawal: true },
      });
      if (prefRej?.notifyWithdrawal) {
        await createNotification(
          tx,
          withdrawal.userId,
          'WITHDRAWAL_REJECTED',
          'Withdrawal rejected',
          `Your withdrawal of ${formatCents(withdrawal.amount)} was rejected and the amount has been returned to your balance.`,
        );
      }

      return { ok: true as const };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ rejected: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not reject the withdrawal. Please try again.' },
      { status: 500 },
    );
  }
}
