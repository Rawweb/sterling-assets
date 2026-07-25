'use client';

import { useState } from 'react';
import { ChevronDown, Wallet } from 'lucide-react';

import PlanTierCard from './PlanTierCard';
import { formatCents } from '@/lib/money';
import { plans } from '@/lib/dashboard-data';
import DetailRow from '@/components/ui/DetailRow';

export default function InvestView({ balanceCents }: { balanceCents: number }) {
  const [planId, setPlanId] = useState(plans[0].id);
  const [amount, setAmount] = useState('');

  const plan = plans.find((p) => p.id === planId)!;
  const balance = balanceCents;

  const cents = Math.round((parseFloat(amount) || 0) * 100);
  const projected = Math.round(
    (cents * plan.dailyRatePct * plan.durationDays) / 100,
  );

  let error: string | null = null;
  if (amount !== '') {
    if (cents < plan.minCents)
      error = `Minimum for ${plan.name} is ${formatCents(plan.minCents)}`;
    else if (plan.maxCents !== null && cents > plan.maxCents)
      error = `Maximum for ${plan.name} is ${formatCents(plan.maxCents)}`;
    else if (cents > balance)
      error = 'Not enough balance. Fund your account first.';
  }

  const canSubmit = cents > 0 && error === null;

  return (
    <>
      <h2 className='mb-3.5 text-base font-semibold'>Choose a plan</h2>

      {/* mobile: picker plus the selected card */}
      <div className='mb-6 lg:hidden'>
        <div className='relative mb-3.5'>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            aria-label='Choose a plan'
            className='w-full appearance-none rounded-xl border border-line bg-surface py-3 pl-3.5 pr-10 text-sm font-medium outline-none focus:border-primary'
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.dailyRatePct}% daily)
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted'
          />
        </div>

        <PlanTierCard plan={plan} selected />
      </div>

      {/* desktop: full grid */}
      <div className='mb-6 hidden gap-3.5 lg:grid lg:grid-cols-2 xl:grid-cols-3'>
        {plans.map((p) => (
          <PlanTierCard
            key={p.id}
            plan={p}
            selected={p.id === planId}
            onSelect={() => setPlanId(p.id)}
          />
        ))}
      </div>

      <div className='grid gap-3.5 lg:grid-cols-[1fr_340px]'>
        <div className='rounded-[14px] border border-line p-5'>
          <label htmlFor='amount' className='mb-1.5 block text-sm font-medium'>
            Amount to invest
          </label>

          <div
            className={`flex items-center rounded-xl border px-3.5 ${
              error ? 'border-down' : 'border-line focus-within:border-primary'
            }`}
          >
            <span className='text-muted'>$</span>
            <input
              id='amount'
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ''))
              }
              inputMode='decimal'
              placeholder='0.00'
              aria-invalid={!!error}
              aria-describedby={error ? 'amount-error' : undefined}
              className='w-full bg-transparent px-2 py-3 font-mono outline-none'
            />
          </div>

          {error && (
            <p id='amount-error' className='mt-1.5 text-[13px] text-down'>
              {error}
            </p>
          )}

          <p className='mt-6 mb-1.5 text-sm font-medium'>Payment method</p>
          <div className='flex items-center gap-2.5 rounded-xl border border-primary bg-primary/5 px-3.5 py-3'>
            <Wallet size={18} className='text-primary' />
            <span className='text-sm font-medium'>Account balance</span>
            <span className='ml-auto font-mono text-sm text-muted'>
              {formatCents(balance)}
            </span>
          </div>
        </div>

        <aside className='h-fit rounded-[14px] border border-line bg-bg p-5'>
          <h3 className='mb-4 text-base font-semibold'>Investment details</h3>

          <dl className='space-y-3 text-sm'>
            <DetailRow label='Plan' value={plan.name} />
            <DetailRow label='Minimum' value={formatCents(plan.minCents)} />
            <DetailRow
              label='Maximum'
              value={
                plan.maxCents === null
                  ? 'Unlimited'
                  : formatCents(plan.maxCents)
              }
            />
            <DetailRow label='Duration' value={`${plan.durationDays} days`} />
            <DetailRow label='Daily return' value={`${plan.dailyRatePct}%`} />
          </dl>

          <div className='my-4 h-px bg-line' />

          <dl className='space-y-3 text-sm'>
            <DetailRow label='You invest' value={formatCents(cents)} />
            <DetailRow
              label='Projected return'
              value={formatCents(projected)}
              tone='up'
            />
          </dl>

          <button
            type='button'
            disabled={!canSubmit}
            className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'
          >
            Confirm and invest
          </button>
        </aside>
      </div>
    </>
  );
}
