import 'server-only';
import { prisma } from './db';

export async function getAdminTransactions() {
  return prisma.ledger.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1000,
    select: {
      id: true,
      amount: true,
      type: true,
      referenceId: true,
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

export type AdminTransaction = Awaited<
  ReturnType<typeof getAdminTransactions>
>[number];
