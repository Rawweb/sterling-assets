import 'server-only';
import { prisma } from './db';

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      read: true,
      createdAt: true,
    },
  });
}

export type NotificationRow = Awaited<
  ReturnType<typeof getNotifications>
>[number];
