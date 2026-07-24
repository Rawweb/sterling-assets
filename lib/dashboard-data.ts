import {
  Home,
  Download,
  Upload,
  History,
  Receipt,
  User,
  ShieldCheck,
  LayoutGrid,
  Layers,
  Share2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const userNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: Home, exact: true },
  { label: 'Deposit', href: '/dashboard/deposit', icon: Download },
  { label: 'Withdraw', href: '/dashboard/withdraw', icon: Upload },
  { label: 'Profit history', href: '/dashboard/profit-history', icon: History },
  { label: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'KYC', href: '/dashboard/kyc', icon: ShieldCheck },
  { label: 'Investment plans', href: '/dashboard/plans', icon: LayoutGrid },
  { label: 'My plans', href: '/dashboard/my-plans', icon: Layers },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Share2 },
];


export const demoUser = {
  fullName: 'Joplin Natasha Sabrina',
  isOnline: true,
};

export const summary = {
  balanceCents: 458450,
  totalProfitCents: 128450,
  bonusCents: 5000,
  referralBonusCents: 25000,
  totalDepositCents: 1250000,
  totalWithdrawalCents: 200000,
};

export type Transaction = {
  id: string;
  date: string;
  type:
    | 'Deposit'
    | 'Withdrawal'
    | 'Profit'
    | 'Investment'
    | 'Referral bonus'
    | 'Bonus';
  amountCents: number;
};

export const recentTransactions: Transaction[] = [
  { id: 't1', date: '2026-07-24', type: 'Profit', amountCents: 8000 },
  { id: 't2', date: '2026-07-22', type: 'Investment', amountCents: -250000 },
  { id: 't3', date: '2026-07-21', type: 'Deposit', amountCents: 500000 },
];

export type UserPlan = {
  id: string;
  name: string;
  investedCents: number;
  durationDays: number;
  daysPaid: number;
  earnedCents: number;
  status: 'active' | 'expired';
  startDate: string;
};

export const userPlans: UserPlan[] = [
  {
    id: 'p1',
    name: 'Growth',
    investedCents: 500000,
    durationDays: 14,
    daysPaid: 9,
    earnedCents: 72000,
    status: 'active',
    startDate: '2026-07-15',
  },
  {
    id: 'p2',
    name: 'Starter',
    investedCents: 250000,
    durationDays: 7,
    daysPaid: 3,
    earnedCents: 9000,
    status: 'active',
    startDate: '2026-07-21',
  },
  {
    id: 'p3',
    name: 'Starter',
    investedCents: 100000,
    durationDays: 7,
    daysPaid: 7,
    earnedCents: 8400,
    status: 'expired',
    startDate: '2026-06-20',
  },
  {
    id: 'p4',
    name: 'Balanced',
    investedCents: 300000,
    durationDays: 21,
    daysPaid: 21,
    earnedCents: 63000,
    status: 'expired',
    startDate: '2026-05-28',
  },
];

export type ActivePlan = {
  id: string;
  name: string;
  investedCents: number;
  durationDays: number;
  daysPaid: number;
  earnedCents: number;
};

export const activePlans = userPlans.filter((p) => p.status === 'active');

export const referral = {
  code: 'HxUf7U',
  link: 'https://sterlingassetsholdings.com/register?ref=HxUf7U',
};

export type TxStatus = 'pending' | 'approved' | 'rejected';

export type DepositRow = {
  id: string;
  date: string;
  amountCents: number;
  coin: string;
  status: TxStatus;
};
export type WithdrawalRow = {
  id: string;
  date: string;
  amountCents: number;
  feeCents: number;
  coin: string;
  status: TxStatus;
};
export type OtherRow = {
  id: string;
  date: string;
  amountCents: number;
  type: string;
  note: string;
};

export const deposits: DepositRow[] = [
  {
    id: 'd1',
    date: '2026-07-21',
    amountCents: 500000,
    coin: 'USDT (TRC20)',
    status: 'approved',
  },
  {
    id: 'd2',
    date: '2026-07-18',
    amountCents: 250000,
    coin: 'Bitcoin',
    status: 'approved',
  },
  {
    id: 'd3',
    date: '2026-07-15',
    amountCents: 100000,
    coin: 'Ethereum',
    status: 'rejected',
  },
  {
    id: 'd4',
    date: '2026-07-12',
    amountCents: 300000,
    coin: 'USDT (TRC20)',
    status: 'approved',
  },
  {
    id: 'd5',
    date: '2026-07-09',
    amountCents: 75000,
    coin: 'Bitcoin',
    status: 'approved',
  },
  {
    id: 'd6',
    date: '2026-07-05',
    amountCents: 120000,
    coin: 'Ethereum',
    status: 'approved',
  },
  {
    id: 'd7',
    date: '2026-07-02',
    amountCents: 45000,
    coin: 'USDT (TRC20)',
    status: 'approved',
  },
  {
    id: 'd8',
    date: '2026-06-28',
    amountCents: 200000,
    coin: 'Bitcoin',
    status: 'approved',
  },
  {
    id: 'd9',
    date: '2026-06-24',
    amountCents: 65000,
    coin: 'Ethereum',
    status: 'rejected',
  },
  {
    id: 'd10',
    date: '2026-06-20',
    amountCents: 180000,
    coin: 'USDT (TRC20)',
    status: 'approved',
  },
  {
    id: 'd11',
    date: '2026-06-16',
    amountCents: 90000,
    coin: 'Bitcoin',
    status: 'approved',
  },
  {
    id: 'd12',
    date: '2026-06-11',
    amountCents: 250000,
    coin: 'USDT (TRC20)',
    status: 'pending',
  },
];

export const withdrawals: WithdrawalRow[] = [
  {
    id: 'w1',
    date: '2026-07-19',
    amountCents: 150000,
    feeCents: 2500,
    coin: 'Bitcoin',
    status: 'approved',
  },
  {
    id: 'w2',
    date: '2026-07-10',
    amountCents: 50000,
    feeCents: 1000,
    coin: 'USDT (TRC20)',
    status: 'approved',
  },
  {
    id: 'w3',
    date: '2026-07-23',
    amountCents: 80000,
    feeCents: 1500,
    coin: 'Ethereum',
    status: 'pending',
  },
];

export const otherTransactions: OtherRow[] = [
  {
    id: 'o1',
    date: '2026-07-24',
    amountCents: 8000,
    type: 'Profit',
    note: 'Growth plan, day 9',
  },
  {
    id: 'o2',
    date: '2026-07-22',
    amountCents: -250000,
    type: 'Investment',
    note: 'Starter plan',
  },
  {
    id: 'o3',
    date: '2026-07-20',
    amountCents: 25000,
    type: 'Referral bonus',
    note: 'Marcus Adeyemi',
  },
  {
    id: 'o4',
    date: '2026-07-14',
    amountCents: 5000,
    type: 'Bonus',
    note: 'Welcome bonus',
  },
];

export const pageSizeOptions = [10, 25, 50];

export type ProfitRow = {
  id: string;
  date: string;
  plan: string;
  amountCents: number;
  type: 'Daily return' | 'Plan bonus';
};

export const profitHistory: ProfitRow[] = [
  {
    id: 'pr1',
    date: '2026-07-24',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr2',
    date: '2026-07-23',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr3',
    date: '2026-07-23',
    plan: 'Starter',
    amountCents: 3000,
    type: 'Daily return',
  },
  {
    id: 'pr4',
    date: '2026-07-22',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr5',
    date: '2026-07-22',
    plan: 'Starter',
    amountCents: 3000,
    type: 'Daily return',
  },
  {
    id: 'pr6',
    date: '2026-07-21',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr7',
    date: '2026-07-20',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr8',
    date: '2026-07-19',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr9',
    date: '2026-07-18',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr10',
    date: '2026-07-17',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr11',
    date: '2026-07-16',
    plan: 'Growth',
    amountCents: 8000,
    type: 'Daily return',
  },
  {
    id: 'pr12',
    date: '2026-07-15',
    plan: 'Growth',
    amountCents: 4000,
    type: 'Plan bonus',
  },
];