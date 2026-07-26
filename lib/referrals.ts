import 'server-only';
import { prisma } from './db';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://sterlingassetsholdings.com';

export async function getReferralData(userId: string) {
  // the current user's own code
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });

  const code = me?.referralCode ?? '';

  // everyone this user referred
  const referredUsers = await prisma.user.findMany({
    where: { referredBy: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, fullName: true, createdAt: true },
  });

  // has each referred user invested? (any INVESTMENT ledger row)
  const investorRows = await prisma.ledger.groupBy({
    by: ['userId'],
    where: {
      userId: { in: referredUsers.map((u) => u.id) },
      type: 'INVESTMENT',
    },
  });
  const hasInvestedSet = new Set(investorRows.map((r) => r.userId));

  // bonus this user earned per referred person:
  // REFERRAL_BONUS rows on THIS user, referenceId is the referred user's plan.
  // simpler: total referral bonus earned overall
  const bonusAgg = await prisma.ledger.aggregate({
    where: { userId, type: 'REFERRAL_BONUS' },
    _sum: { amount: true },
  });

  const referrals = referredUsers.map((u) => ({
    id: u.id,
    name: u.fullName,
    joinedAt: u.createdAt,
    hasInvested: hasInvestedSet.has(u.id),
  }));

  return {
    code,
    link: `${APP_URL}/register?ref=${code}`,
    totalReferrals: referrals.length,
    investedCount: referrals.filter((r) => r.hasInvested).length,
    totalBonusCents: bonusAgg._sum.amount ?? 0,
    referrals,
  };
}

export type ReferralData = Awaited<ReturnType<typeof getReferralData>>;
export type ReferredPerson = ReferralData['referrals'][number];
  