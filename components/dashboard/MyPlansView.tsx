'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import Tabs from '@/components/ui/Tabs';
import PlanCard from '@/components/dashboard/PlanCard';
import EmptyState from '@/components/ui/EmptyState';
import { formatCents } from '@/lib/money';
import { userPlans } from '@/lib/dashboard-data';

const TABS = ['Active', 'Expired', 'All'] as const;
type Tab = (typeof TABS)[number];

export default function MyPlansView() {
  const [tab, setTab] = useState<Tab>('Active');

  const filtered = userPlans.filter((p) =>
    tab === 'All'
      ? true
      : tab === 'Active'
        ? p.status === 'active'
        : p.status === 'expired',
  );

  const invested = userPlans.reduce((s, p) => s + p.investedCents, 0);
  const earned = userPlans.reduce((s, p) => s + p.earnedCents, 0);

  return (
    <>
      <div className='mb-5 grid gap-3.5 sm:grid-cols-3'>
        <Stat label='Total invested' value={formatCents(invested)} />
        <Stat label='Total earned' value={formatCents(earned)} tone='up' />
        <Stat
          label='Active plans'
          value={String(userPlans.filter((p) => p.status === 'active').length)}
        />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {filtered.length === 0 ? (
        <div className='rounded-[14px] border border-line'>
          <EmptyState
            message='You do not have an investment plan yet, or none match your filter.'
            action={
              <Link
                href='/dashboard/plans'
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
              >
                <Plus size={16} /> Buy a plan
              </Link>
            }
          />
        </div>
      ) : (
        <div className='grid gap-3.5 sm:grid-cols-2'>
          {filtered.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
      )}
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'up';
}) {
  return (
    <div className='rounded-[14px] border border-line bg-bg px-4 py-3.5'>
      <p className='text-xs text-muted'>{label}</p>
      <p
        className={`mt-1 font-mono text-lg font-semibold ${tone === 'up' ? 'text-up' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
