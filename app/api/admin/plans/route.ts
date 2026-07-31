import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';

const planSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  minCents: z.number().int().positive('Minimum must be a positive amount'),
  maxCents: z.number().int().positive().nullable(),
  dailyRatePct: z.number().positive('Daily rate must be positive'),
  durationDays: z
    .number()
    .int()
    .positive('Duration must be a positive whole number'),
  referralPct: z.number().min(0, 'Referral % cannot be negative'),
});

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const parsed = planSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, minCents, maxCents, dailyRatePct, durationDays, referralPct } =
    parsed.data;

  if (maxCents !== null && maxCents <= minCents) {
    return NextResponse.json(
      { error: 'Maximum must be greater than minimum.' },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.plan.findUnique({ where: { name } });
      if (existing) {
        return {
          error: 'A plan with that name already exists.',
          status: 409 as const,
        };
      }

      const plan = await tx.plan.create({
        data: {
          name,
          minCents,
          maxCents,
          dailyRatePct,
          durationDays,
          referralPct,
        },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'PLAN_CREATED',
          targetId: plan.id,
        },
      });

      return { ok: true as const, plan };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ plan: result.plan }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Could not create the plan. Please try again.' },
      { status: 500 },
    );
  }
}
