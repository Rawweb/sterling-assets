import { prisma } from '@/lib/db';

export type AdminStats = {
  totalUsers: number;
  activeUserPlans: number;
  totalDepositCents: number;
  totalWithdrawalCents: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingKyc: number;
};

export type PendingDepositRow = {
  id: string;
  userFullName: string;
  amount: number;
  coin: string;
  createdAt: Date;
};

export type PendingWithdrawalRow = {
  id: string;
  userFullName: string;
  amount: number;
  coin: string;
  createdAt: Date;
};

export type PendingKycRow = {
  id: string;
  userFullName: string;
  documentType: string;
  createdAt: Date;
};

export async function getAdminOverview() {
  const [
    totalUsers,
    pendingDeposits,
    pendingWithdrawals,
    pendingKyc,
    depositSum,
    withdrawalSum,
    activeUserPlans,
    pendingDepositRows,
    pendingWithdrawalRows,
    pendingKycRows,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.deposit.count({ where: { status: 'PENDING' } }),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.kycSubmission.count({ where: { status: 'PENDING' } }),
    prisma.deposit.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
    }),
    prisma.userPlan.count({ where: { status: 'ACTIVE' } }),
    prisma.deposit.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        coin: true,
        createdAt: true,
        user: { select: { fullName: true } },
      },
    }),
    prisma.withdrawal.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        coin: true,
        createdAt: true,
        user: { select: { fullName: true } },
      },
    }),
    prisma.kycSubmission.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        documentType: true,
        createdAt: true,
        user: { select: { fullName: true } },
      },
    }),
  ]);

  return {
    // stat cards
    stats: {
      totalUsers,
      activeUserPlans,
      totalDepositCents: depositSum._sum.amount ?? 0,
      totalWithdrawalCents: withdrawalSum._sum.amount ?? 0,
      pendingDeposits,
      pendingWithdrawals,
      pendingKyc,
    } as AdminStats,

    // deposit rows
    pendingDepositRows: pendingDepositRows.map((d) => ({
      id: d.id,
      userFullName: d.user.fullName,
      amount: d.amount,
      coin: d.coin,
      createdAt: d.createdAt,
    })) as PendingDepositRow[],

    // withdrawal row
    pendingWithdrawalRows: pendingWithdrawalRows.map((w) => ({
      id: w.id,
      userFullName: w.user.fullName,
      amount: w.amount,
      coin: w.coin,
      createdAt: w.createdAt,
    })) as PendingWithdrawalRow[],

    // kyc row
    pendingKycRows: pendingKycRows.map((k) => ({
      id: k.id,
      userFullName: k.user.fullName,
      documentType: k.documentType,
      createdAt: k.createdAt,
    })) as PendingKycRow[],
  };
}
