import 'server-only';
import type { Prisma, NotificationType } from '@/lib/generated/prisma/client';
import { prisma } from './db';
import { sendNotificationEmail } from './mail';

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

// call AFTER the transaction commits. sends the email, best-effort.
export async function emailNotification(
  userId: string,
  title: string,
  body: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, fullName: true },
  });
  if (!user) return;

  await sendNotificationEmail(user.email, title, body, user.fullName);
}