import 'server-only';
import { prisma } from './db';

export async function getUserWithdrawals(userId: string) {
  return prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      amount: true,
      coin: true,
      status: true,
      createdAt: true,
    },
  });
}

export type UserWithdrawal = Awaited<
  ReturnType<typeof getUserWithdrawals>
>[number];
