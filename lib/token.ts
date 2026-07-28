import { randomBytes, createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { clearPendingEmail } from '@/lib/session';

const EXPIRY_HOURS = 24;
export const RESEND_COOLDOWN_SECONDS = 60;

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

type VerifyResult =
  { ok: true; userId: string } | { ok: false; reason: 'invalid' | 'expired' };

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

  await clearPendingEmail();

  return { ok: true, userId: record.userId };
}

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

// password reset
export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  const raw = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.deleteMany({ where: { userId } });

  await prisma.passwordResetToken.create({
    data: { tokenHash: hashToken(raw), userId, expiresAt },
  });

  return raw;
}

export async function consumePasswordResetToken(
  raw: string,
): Promise<{ ok: true; userId: string } | { ok: false }> {
  const hash = hashToken(raw);

  const token = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hash },
  });

  if (!token) return { ok: false };

  // Delete immediately regardless of expiry.
  await prisma.passwordResetToken.delete({ where: { id: token.id } });

  if (token.expiresAt < new Date()) return { ok: false };

  return { ok: true, userId: token.userId };
}