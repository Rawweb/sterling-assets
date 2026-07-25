import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. admin guard
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { id } = await params;

  // 2. do everything atomically
  try {
    const result = await prisma.$transaction(async (tx) => {
      // read the deposit and lock our logic to its current state
      const deposit = await tx.deposit.findUnique({ where: { id } });

      if (!deposit) {
        return { error: 'Deposit not found.', status: 404 as const };
      }
      if (deposit.status !== 'PENDING') {
        return { error: 'This deposit is not pending.', status: 409 as const };
      }

      // flip the deposit to approved
      await tx.deposit.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

      // write the ledger credit — THIS is where the balance moves
      await tx.ledger.create({
        data: {
          userId: deposit.userId,
          amount: deposit.amount, // positive, a credit
          type: 'DEPOSIT',
          referenceId: deposit.id,
        },
      });

      // record the admin action
      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'DEPOSIT_APPROVED',
          targetId: deposit.id,
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
      { error: 'Could not approve the deposit. Please try again.' },
      { status: 500 },
    );
  }
}
