'use client';

import { Check } from 'lucide-react';
import type { Plan } from '@/lib/dashboard-data';
import { formatCents } from '@/lib/money';

export default function PlanTierCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect?: () => void;
}) {
  const features = [
    `Minimum ${formatCents(plan.minCents)}`,
    plan.maxCents === null
      ? 'No maximum'
      : `Maximum ${formatCents(plan.maxCents)}`,
    `Paid daily for ${plan.durationDays} days`,
    `${plan.referralPct}% referral bonus`,
  ];

  const base = `flex flex-col rounded-[14px] border p-[18px] text-left transition ${
    selected ? 'border-primary ring-2 ring-primary/30' : 'border-line'
  }`;

  const content = (
    <>
      <div className='rounded-xl bg-linear-to-br from-primary to-primary-press px-4 py-3.5 text-center text-surface'>
        <p className='text-[13px] font-semibold opacity-80'>{plan.name}</p>
        <p className='font-mono text-3xl font-bold leading-tight'>
          {plan.dailyRatePct}
          <span className='text-lg'>%</span>
        </p>
        <p className='text-[11px] uppercase tracking-wider opacity-80'>daily</p>
      </div>

      <ul className='mt-4 space-y-2.5'>
        {features.map((f) => (
          <li key={f} className='flex items-start gap-2 text-[13px] text-muted'>
            <Check size={15} className='mt-0.5 shrink-0 text-up' />
            {f}
          </li>
        ))}
      </ul>
    </>
  );

  if (!onSelect) return <div className={base}>{content}</div>;

  return (
    <button
      type='button'
      onClick={onSelect}
      aria-pressed={selected}
      className={`${base} active:scale-[0.99] ${selected ? '' : 'hover:border-primary/50'}`}
    >
      {content}
    </button>
  );
}
