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

      await tx.kycSubmission.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

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
      { error: 'Could not reject the submission. Please try again.' },
      { status: 500 },
    );
  }
}
