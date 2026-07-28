import 'server-only';
import { prisma } from './db';

export async function getAdminWithdrawals() {
  return prisma.withdrawal.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      amount: true,
      coin: true,
      address: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export type AdminWithdrawal = Awaited<
  ReturnType<typeof getAdminWithdrawals>
>[number];
