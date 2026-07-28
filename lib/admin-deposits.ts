import 'server-only';
import { prisma } from './db';

export async function getAdminDeposits() {
  return prisma.deposit.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      amount: true,
      coin: true,
      status: true,
      proofUrl: true,
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

export type AdminDeposit = Awaited<ReturnType<typeof getAdminDeposits>>[number];
