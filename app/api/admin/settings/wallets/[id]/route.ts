import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminUser } from '@/lib/session';
import { prisma } from '@/lib/db';

const schema = z.object({
  network: z.string().min(1, 'Network is required'),
  address: z.string().min(10, 'Address is too short'),
  minCents: z.number().int().positive('Minimum deposit must be positive'),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { network, address, minCents } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.walletAddress.findUnique({ where: { id } });
      if (!wallet) {
        return { error: 'Wallet address not found.', status: 404 as const };
      }

      const updated = await tx.walletAddress.update({
        where: { id },
        data: { network, address, minCents },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'WALLET_ADDRESS_UPDATED',
          targetId: id,
        },
      });

      return { ok: true as const, wallet: updated };
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ wallet: result.wallet });
  } catch {
    return NextResponse.json(
      { error: 'Could not update the wallet address. Please try again.' },
      { status: 500 },
    );
  }
}
