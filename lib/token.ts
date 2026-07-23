// lib/tokens.ts
import { randomBytes, createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { clearPendingEmail } from '@/lib/session';

const EXPIRY_HOURS = 24;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createVerificationToken(userId: string) {
  await prisma.verificationToken.deleteMany({ where: { userId } });

  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  return token;
}

type VerifyResult = { ok: true } | { ok: false; reason: 'invalid' | 'expired' };

export async function consumeVerificationToken(
  token: string,
): Promise<VerifyResult> {
  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record) return { ok: false, reason: 'invalid' };

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return { ok: false, reason: 'expired' };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { id: record.id } }),
  ]);

  await clearPendingEmail()

  return { ok: true };
}

export const RESEND_COOLDOWN_SECONDS = 60;

export async function getResendCooldown(email: string | null) {
  if (!email) return 0;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return 0;

  const last = await prisma.verificationToken.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });
  if (!last) return 0;

  const elapsed = (Date.now() - last.createdAt.getTime()) / 1000;
  return Math.max(0, Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed));
}
