import 'server-only';
import { prisma } from './db';

export async function getAdminUsers() {
  return prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      country: true,
      kycStatus: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}

export type AdminUser = Awaited<ReturnType<typeof getAdminUsers>>[number];
