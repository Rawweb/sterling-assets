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
          status: 'REJECTED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });
      if (updated.count === 0) {
        return { error: 'This submission is not pending.', status: 409 as const };
      }
      // user goes to REJECTED so they can resubmit
      await tx.user.update({
        where: { id: submission.userId },
        data: { kycStatus: 'REJECTED' },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'KYC_REJECTED',
          targetId: submission.id,
        },
      });

      // in-app notification (KYC always notifies, no preference gate)
      await createNotification(
        tx,
        submission.userId,
        'KYC_REJECTED',
        'Verification rejected',
        'Your identity verification was rejected. Please review and submit your documents again.',
      );

      return {
        ok: true as const,
        email: {
          userId: submission.userId,
          title: 'Verification rejected',
          body: 'Your identity verification was rejected. Please review and submit your documents again.',
        },
      };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    // email notification (sent after commit, best-effort)
    await emailNotification(
      result.email.userId,
      result.email.title,
      result.email.body,
    );

    return NextResponse.json({ rejected: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not reject the submission. Please try again.' },
      { status: 500 },
    );
  }
}
