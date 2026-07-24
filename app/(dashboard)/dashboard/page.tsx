import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  Gift,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
} from 'lucide-react';

import {
  demoUser,
  summary,
  referral,
  recentTransactions,
  activePlans,
} from '@/lib/dashboard-data';
import { formatCents, formatSignedCents, formatDate } from '@/lib/money';

import PageShell from '@/components/dashboard/PageShell';
import MarketTicker from '@/components/dashboard/MarketTicker';
import PlanCard from '@/components/dashboard/PlanCard';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import CopyField from '@/components/ui/CopyField';

function Count({ n }: { n: number }) {
  return (
    <span className='ml-1.5 inline-grid h-[22px] min-w-[22px] place-items-center rounded-full bg-line/60 px-1.5 font-mono text-xs font-normal text-muted'>
      {n}
    </span>
  );
}

export default function DashboardHome() {
  const firstName = demoUser.fullName.split(' ')[0];

  const cards = [
    {
      label: 'Account balance',
      value: summary.balanceCents,
      icon: <Wallet size={20} />,
      tone: 'primary' as const,
    },
    {
      label: 'Total profit',
      value: summary.totalProfitCents,
      icon: <TrendingUp size={20} />,
      tone: 'up' as const,
    },
    {
      label: 'Bonus',
      value: summary.bonusCents,
      icon: <Gift size={20} />,
      tone: 'amber' as const,
    },
    {
      label: 'Referral bonus',
      value: summary.referralBonusCents,
      icon: <Users size={20} />,
      tone: 'primary' as const,
    },
    {
      label: 'Total deposit',
      value: summary.totalDepositCents,
      icon: <ArrowDownCircle size={20} />,
      tone: 'up' as const,
    },
    {
      label: 'Total withdrawal',
      value: summary.totalWithdrawalCents,
      icon: <ArrowUpCircle size={20} />,
      tone: 'down' as const,
    },
  ];

  return (
    <PageShell title={`Welcome back, ${firstName}`} heroSlot={<MarketTicker />}>
      <section className='mb-[26px]'>
        <h2 className='mb-3.5 text-base font-semibold'>Account summary</h2>
        <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3'>
          {cards.map((c) => (
            <StatCard
              key={c.label}
              label={c.label}
              value={formatCents(c.value)}
              icon={c.icon}
              tone={c.tone}
            />
          ))}
        </div>
      </section>

      <section className='mb-[26px]'>
        <div className='mb-3.5 flex items-center justify-between'>
          <h2 className='text-base font-semibold'>
            Active plans
            <Count n={activePlans.length} />
          </h2>
          {activePlans.length > 0 && (
            <Link
              href='/dashboard/my-plans'
              className='text-[13px] font-semibold text-primary hover:underline active:text-primary-press'
            >
              View all
            </Link>
          )}
        </div>

        {activePlans.length === 0 ? (
          <div className='rounded-[14px] border border-line'>
            <EmptyState
              message='You have no active plan yet. Put your capital to work.'
              action={
                <Link
                  href='/dashboard/plans'
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-primary-press'
                >
                  <Plus size={16} /> Buy a plan
                </Link>
              }
            />
          </div>
        ) : (
          <div className='grid gap-3.5 sm:grid-cols-2'>
            {activePlans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        )}
      </section>

      <section className='mb-[26px]'>
        <div className='mb-3.5 flex items-center justify-between'>
          <h2 className='text-base font-semibold'>
            Recent transactions
            <Count n={recentTransactions.length} />
          </h2>
          <Link
            href='/dashboard/transactions'
            className='text-[13px] font-semibold text-primary hover:underline active:text-primary-press'
          >
            View all
          </Link>
        </div>

        <div className='overflow-hidden rounded-[14px] border border-line'>
          <div className='grid grid-cols-3 gap-3 bg-bg px-4 py-3 text-xs font-semibold text-muted'>
            <span>Date</span>
            <span>Type</span>
            <span className='text-right'>Amount</span>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState message='Nothing here yet. Your first deposit will show up here.' />
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className='grid grid-cols-3 items-center gap-3 border-t border-line px-4 py-3.5 text-sm'
              >
                <span className='text-muted'>{formatDate(t.date)}</span>
                <span className='font-medium'>{t.type}</span>
                <span
                  className={`text-right font-mono font-semibold ${t.amountCents < 0 ? 'text-down' : 'text-up'}`}
                >
                  {formatSignedCents(t.amountCents)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className='rounded-[14px] border border-line p-5'>
          <h2 className='text-base font-semibold'>Refer and earn</h2>
          <p className='mb-4 mt-1 text-sm text-muted'>
            Share your link. You earn when they invest.
          </p>
          <CopyField value={referral.link} />
        </div>
      </section>
    </PageShell>
  );
}
