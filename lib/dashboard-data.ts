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

// Deposit
export type DepositMethod = {
  id: string;
  coin: string;
  network: string;
  address: string;
  minCents: number;
  icon: LucideIcon;
};

export const depositMethods: DepositMethod[] = [
  {
    id: 'btc',
    coin: 'Bitcoin',
    network: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minCents: 5000,
    icon: Bitcoin,
  },
  {
    id: 'eth',
    coin: 'Ethereum',
    network: 'ERC20',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    minCents: 5000,
    icon: Coins,
  },
  {
    id: 'usdt',
    coin: 'USDT (TRC20)',
    network: 'TRC20',
    address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxbxa1',
    minCents: 2000,
    icon: CircleDollarSign,
  },
];

// KYC
export type DocType = 'national_id' | 'passport' | 'drivers_license';

export const docTypes: { id: DocType; label: string }[] = [
  { id: 'national_id', label: 'National ID' },
  { id: 'passport', label: `Int'l Passport` },
  { id: 'drivers_license', label: "Driver's license" },
];
