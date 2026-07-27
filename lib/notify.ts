import 'server-only';
import type { Prisma, NotificationType } from '@/lib/generated/prisma/client';

type Tx = Prisma.TransactionClient;

// writes an in-app notification inside an existing transaction
export async function createNotification(
  tx: Tx,
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
) {
  await tx.notification.create({
    data: { userId, type, title, body },
  });
}
