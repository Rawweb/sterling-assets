import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { createNotification, emailNotification } from '@/lib/notify';

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
      const submission = await tx.kycSubmission.findUnique({ where: { id } });

      if (!submission) {
        return { error: 'Submission not found.', status: 404 as const };
      }
      const updated = await tx.kycSubmission.updateMany({
        where: { id, status: 'PENDING' },
        data: {
          status: 'APPROVED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });
      if (updated.count === 0) {
        return { error: 'This submission is not pending.', status: 409 as const };
      }

      // flip the user — THIS unlocks withdrawals
      await tx.user.update({
        where: { id: submission.userId },
        data: { kycStatus: 'APPROVED' },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'KYC_APPROVED',
          targetId: submission.id,
        },
      });

      // in-app notification (KYC always notifies)
      await createNotification(
        tx,
        submission.userId,
        'KYC_APPROVED',
        'Identity verified',
        'Your identity verification was approved. Withdrawals are now unlocked.',
      );

      return {
        ok: true as const,
        email: {
          userId: submission.userId,
          title: 'Identity verified',
          body: 'Your identity verification was approved. Withdrawals are now unlocked.',
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

    return NextResponse.json({ approved: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not approve the submission. Please try again.' },
      { status: 500 },
    );
  }
}
