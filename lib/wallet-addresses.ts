import 'server-only';
import { prisma } from './db';

export type DepositMethod = {
  id: string;
  coin: string;
  network: string;
  address: string;
  minCents: number;
};

export async function getDepositMethods(): Promise<DepositMethod[]> {
  return prisma.walletAddress.findMany({
    orderBy: { coin: 'asc' },
    select: {
      id: true,
      coin: true,
      network: true,
      address: true,
      minCents: true,
    },
  });
}
