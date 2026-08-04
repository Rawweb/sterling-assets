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
      const withdrawal = await tx.withdrawal.findUnique({ where: { id } });

      if (!withdrawal) {
        return { error: 'Withdrawal not found.', status: 404 as const };
      }

      const updated = await tx.withdrawal.updateMany({
        where: { id, status: 'PENDING' },
        data: {
          status: 'APPROVED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });
      if (updated.count === 0) {
        return { error: 'This withdrawal is not pending.', status: 409 as const };
      }

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'WITHDRAWAL_APPROVED',
          targetId: withdrawal.id,
        },
      });

      // check preference once, reused for both in-app and email
      const prefApp = await tx.user.findUnique({
        where: { id: withdrawal.userId },
        select: { notifyWithdrawal: true },
      });

      let email: { userId: string; title: string; body: string } | null = null;
      if (prefApp?.notifyWithdrawal) {
        const title = 'Withdrawal approved';
        const emailBody = `Your withdrawal of ${formatCents(withdrawal.amount)} has been approved. Please check your wallet address.`;
        // in-app notification (gated by notifyWithdrawal)
        await createNotification(
          tx,
          withdrawal.userId,
          'WITHDRAWAL_APPROVED',
          title,
          emailBody,
        );
        email = { userId: withdrawal.userId, title, body: emailBody };
      }

      return { ok: true as const, email };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // email notification (after commit, only if preference was on)
    if (result.email) {
      await emailNotification(
        result.email.userId,
        result.email.title,
        result.email.body,
      );
    }

    return NextResponse.json({ approved: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not approve the withdrawal. Please try again.' },
      { status: 500 },
    );
  }
}
