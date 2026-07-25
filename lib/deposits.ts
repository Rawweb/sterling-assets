import 'server-only';
import { prisma } from './db';

export async function getUserDeposits(userId: string) {
  return prisma.deposit.findMany({
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

export type UserDeposit = Awaited<ReturnType<typeof getUserDeposits>>[number];
