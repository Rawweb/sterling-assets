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
  Bitcoin,
  Coins,
  CircleDollarSign,
  LayoutDashboard,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  ScrollText,
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

export const adminNav: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Deposits', href: '/admin/deposits', icon: ArrowDownCircle },
  { label: 'Withdrawals', href: '/admin/withdrawals', icon: ArrowUpCircle },
  { label: 'KYC', href: '/admin/kyc', icon: ShieldCheck },
  { label: 'Plans', href: '/admin/plans', icon: LayoutGrid },
  { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Audit log', href: '/admin/audit-log', icon: ScrollText },
];

// Withdrawal
export const withdrawalConfig = {
  minCents: 500,
};

export const pageSizeOptions = [10, 25, 50];

// KYC
export type DocType = 'national_id' | 'passport' | 'drivers_license';

export const docTypes: { id: DocType; label: string }[] = [
  { id: 'national_id', label: 'National ID' },
  { id: 'passport', label: `Int'l Passport` },
  { id: 'drivers_license', label: "Driver's license" },
];
