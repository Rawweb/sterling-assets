import Link from 'next/link';
import {
  Users,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
} from 'lucide-react';
import PageShell from '@/components/dashboard/PageShell';
import StatCard from '@/components/ui/StatCard';
import { getAdminOverview } from '@/lib/admin-overview';
import { formatCents, formatDate } from '@/lib/money';
import { docTypes } from '@/lib/dashboard-data';

export default async function AdminOverviewPage() {
  const { stats, pendingDepositRows, pendingWithdrawalRows, pendingKycRows } =
    await getAdminOverview();

  const docLabel = (type: string) =>
    docTypes.find((d) => d.id === type)?.label ?? type;

  return (
    <PageShell title='Overview'>
      {/* ── Stat cards ───────────────────────────────────────────────── */}
      <div className='mb-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          label='Total users'
          value={String(stats.totalUsers)}
          icon={<Users size={20} />}
          tone='primary'
        />
        <StatCard
          label='Active plans'
          value={String(stats.activeUserPlans)}
          icon={<LayoutGrid size={20} />}
          tone='primary'
        />
        <StatCard
          label='Total deposited'
          value={formatCents(stats.totalDepositCents)}
          icon={<TrendingUp size={20} />}
          tone='up'
        />
        <StatCard
          label='Total withdrawn'
          value={formatCents(stats.totalWithdrawalCents)}
          icon={<TrendingDown size={20} />}
          tone='down'
        />
      </div>

      {/* ── Pending queues ───────────────────────────────────────────── */}
      <h2 className='mb-3.5 text-base font-semibold'>Pending action</h2>

      <div className='grid gap-3.5 lg:grid-cols-3'>
        {/* Deposits */}
        <PendingQueue
          title='Deposits'
          count={stats.pendingDeposits}
          viewAllHref='/admin/deposits'
          icon={<ArrowDownCircle size={16} className='text-gold' />}
          empty='No deposits pending review.'
        >
          {pendingDepositRows.map((row) => (
            <PendingRow
              key={row.id}
              name={row.userFullName}
              meta={`${row.coin} · ${formatDate(row.createdAt)}`}
              value={formatCents(row.amount)}
              href='/admin/deposits'
            />
          ))}
        </PendingQueue>

        {/* Withdrawals */}
        <PendingQueue
          title='Withdrawals'
          count={stats.pendingWithdrawals}
          viewAllHref='/admin/withdrawals'
          icon={<ArrowUpCircle size={16} className='text-gold' />}
          empty='No withdrawals pending review.'
        >
          {pendingWithdrawalRows.map((row) => (
            <PendingRow
              key={row.id}
              name={row.userFullName}
              meta={`${row.coin} · ${formatDate(row.createdAt)}`}
              value={formatCents(row.amount)}
              href='/admin/withdrawals'
            />
          ))}
        </PendingQueue>

        {/* KYC */}
        <PendingQueue
          title='KYC'
          count={stats.pendingKyc}
          viewAllHref='/admin/kyc'
          icon={<ShieldCheck size={16} className='text-gold' />}
          empty='No KYC submissions pending review.'
        >
          {pendingKycRows.map((row) => (
            <PendingRow
              key={row.id}
              name={row.userFullName}
              meta={`${docLabel(row.documentType)} · ${formatDate(row.createdAt)}`}
              href='/admin/kyc'
            />
          ))}
        </PendingQueue>
      </div>
    </PageShell>
  );
}

// ─── Inline server components ─────────────────────────────────────────────────
// These are only used on this page so they live here, not in components/.

function PendingQueue({
  title,
  count,
  viewAllHref,
  icon,
  empty,
  children,
}: {
  title: string;
  count: number;
  viewAllHref: string;
  icon: React.ReactNode;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-[14px] border border-line p-5'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {icon}
          <h3 className='text-base font-semibold'>{title}</h3>
          {count > 0 && (
            <span className='inline-flex items-center rounded-full bg-gold/14 px-2 py-0.5 text-[11px] font-semibold text-gold'>
              {count}
            </span>
          )}
        </div>
        <Link
          href={viewAllHref}
          className='text-[13px] font-semibold text-primary hover:underline active:text-primary-press'
        >
          View all
        </Link>
      </div>

      {count === 0 ? (
        <p className='py-6 text-center text-sm text-muted'>{empty}</p>
      ) : (
        <div className='divide-y divide-line'>{children}</div>
      )}
    </div>
  );
}

function PendingRow({
  name,
  meta,
  value,
  href,
}: {
  name: string;
  meta: string;
  value?: string;
  href: string;
}) {
  return (
    <div className='flex items-center justify-between gap-3 py-3 text-sm'>
      <div className='min-w-0'>
        <p className='truncate font-medium'>{name}</p>
        <p className='text-xs text-muted'>{meta}</p>
      </div>
      <div className='shrink-0 text-right'>
        {value && <p className='font-mono font-semibold'>{value}</p>}
        <Link
          href={href}
          className='text-xs font-semibold text-primary hover:underline active:text-primary-press'
        >
          Review
        </Link>
      </div>
    </div>
  );
}
