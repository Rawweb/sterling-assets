import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
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

  const { notifyWithdrawal, notifyProfit, notifyPlanExpiry } = body as {
    notifyWithdrawal?: unknown;
    notifyProfit?: unknown;
    notifyPlanExpiry?: unknown;
  };

  if (
    typeof notifyWithdrawal !== 'boolean' ||
    typeof notifyProfit !== 'boolean' ||
    typeof notifyPlanExpiry !== 'boolean'
  ) {
    return NextResponse.json(
      { error: 'Invalid preferences.' },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { notifyWithdrawal, notifyProfit, notifyPlanExpiry },
  });

  return NextResponse.json({ updated: true }, { status: 200 });
}
