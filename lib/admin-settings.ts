import 'server-only';
import { prisma } from './db';

export async function getWalletAddresses() {
  return prisma.walletAddress.findMany({
    orderBy: { coin: 'asc' },
    select: {
      id: true,
      coin: true,
      network: true,
      address: true,
      minCents: true,
      updatedAt: true,
    },
  });
}

export type WalletAddressRow = Awaited<
  ReturnType<typeof getWalletAddresses>
>[number];
