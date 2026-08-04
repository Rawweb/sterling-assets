import { randomBytes, createHash } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

const COOKIE_NAME = 'session';
const PENDING_COOKIE = 'pending_email';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string, remember = false) {
  const token = randomBytes(32).toString('base64url');
  const days = remember ? 30 : 1;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { id: hashToken(token), userId, expiresAt },
  });

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

// get user
export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: hashToken(token) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          country: true,
          role: true,
          avatarUrl: true,
          emailVerified: true,
          kycStatus: true,
          notifyWithdrawal: true,
          notifyProfit: true,
          notifyPlanExpiry: true,
        },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

// get admin
export async function getAdminUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'ADMIN') return null;
  return user;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { id: hashToken(token) } });
  }

  jar.delete(COOKIE_NAME);
}

export async function setPendingEmail(email: string) {
  const jar = await cookies();
  jar.set(PENDING_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour, in seconds
  });
}

export async function getPendingEmail() {
  const jar = await cookies();
  return jar.get(PENDING_COOKIE)?.value ?? null;
}

export async function clearPendingEmail() {
  const jar = await cookies();
  jar.delete(PENDING_COOKIE);
}

export async function revokeOtherSessions(userId: string): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const currentId = token ? hashToken(token) : null;

  await prisma.session.deleteMany({
    where: {
      userId,
      ...(currentId ? { id: { not: currentId } } : {}),
    },
  });
}