import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';

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
      if (submission.status !== 'PENDING') {
        return {
          error: 'This submission is not pending.',
          status: 409 as const,
        };
      }

      // flip the submission
      await tx.kycSubmission.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

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

      return { ok: true as const };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ approved: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Could not approve the submission. Please try again.' },
      { status: 500 },
    );
  }
}
