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
      const plan = await tx.plan.findUnique({ where: { id } });
      if (!plan) {
        return { error: 'Plan not found.', status: 404 as const };
      }

      const updated = await tx.plan.update({
        where: { id },
        data: { active: !plan.active },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: plan.active ? 'PLAN_DEACTIVATED' : 'PLAN_ACTIVATED',
          targetId: id,
        },
      });

      return { ok: true as const, active: updated.active };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ active: result.active });
  } catch {
    return NextResponse.json(
      { error: 'Could not update the plan. Please try again.' },
      { status: 500 },
    );
  }
}
