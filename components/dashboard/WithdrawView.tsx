'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Clock, XCircle, Check } from 'lucide-react';
import DetailRow from '@/components/ui/DetailRow';
import { formatCents } from '@/lib/money';
import {
  depositMethods,
  withdrawalConfig,
} from '@/lib/dashboard-data';

const GATE = {
  NONE: {
    icon: ShieldAlert,
    tone: 'text-gold',
    title: 'Verify your identity first',
    body: 'Withdrawals are locked until your identity is verified. It takes a few minutes.',
    cta: 'Start verification',
  },
  PENDING: {
    icon: Clock,
    tone: 'text-primary',
    title: 'Verification under review',
    body: 'We are reviewing your documents. Withdrawals unlock as soon as this is approved.',
    cta: 'View status',
  },
  REJECTED: {
    icon: XCircle,
    tone: 'text-down',
    title: 'Verification was rejected',
    body: 'Your documents could not be verified. Please review the notes and submit again.',
    cta: 'Resubmit documents',
  },
} as const;

export default function WithdrawView({
  balanceCents,
  kycStatus,
}: {
  balanceCents: number;
  kycStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}) {
  const [methodId, setMethodId] = useState(depositMethods[0].id);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (kycStatus !== 'APPROVED') {
    const g = GATE[kycStatus as keyof typeof GATE];
    const Icon = g.icon;

    return (
      <div className='mx-auto max-w-md rounded-[14px] border border-line px-5 py-10 text-center'>
        <Icon size={38} className={`mx-auto ${g.tone}`} />
        <h2 className='mt-3.5 text-lg font-semibold'>{g.title}</h2>
        <p className='mx-auto mt-1.5 max-w-sm text-sm text-muted'>{g.body}</p>
        <Link
          href='/dashboard/kyc'
          className='mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
        >
          {g.cta}
        </Link>
      </div>
    );
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cents,
          coin: `${method.coin}`,
          address: address.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const method = depositMethods.find((m) => m.id === methodId)!;
  const balance = balanceCents;

  const cents = Math.round((parseFloat(amount) || 0) * 100);
  // const fee = Math.round((cents * withdrawalConfig.feePct) / 100);
  // const receives = Math.max(0, cents - fee);

  let error: string | null = null;
  if (amount !== '') {
    if (cents < withdrawalConfig.minCents)
      error = `Minimum withdrawal is ${formatCents(withdrawalConfig.minCents)}`;
    else if (cents > balance)
      error = 'That is more than your available balance.';
  }

  const canSubmit = cents > 0 && !error && address.trim().length > 0;

  if (submitted) {
    return (
      <div className='mx-auto max-w-md rounded-[14px] border border-line px-5 py-10 text-center'>
        <div className='mx-auto grid size-14 place-items-center rounded-full bg-up/12'>
          <Check size={28} className='text-up' />
        </div>
        <h2 className='mt-4 text-lg font-semibold'>Withdrawal requested</h2>
        <p className='mx-auto mt-1.5 max-w-sm text-sm text-muted'>
          Your withdrawal is pending review. The amount has been deducted from
          your balance and will be released once approved. If it is rejected, it
          returns to your balance.
        </p>
        <Link
          href='/dashboard/transactions'
          className='mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
        >
          View my transactions
        </Link>
      </div>
    );
  }

  return (
    <div className='grid gap-3.5 lg:grid-cols-[1fr_340px]'>
      <div className='rounded-[14px] border border-line p-5'>
        <p className='mb-2.5 text-sm font-medium'>Receive in</p>
        <div
          role='radiogroup'
          aria-label='Receive in'
          className='mb-6 grid gap-2.5 sm:grid-cols-3'
        >
          {depositMethods.map((m) => {
            const Icon = m.icon;
            const active = m.id === methodId;

            return (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition active:scale-[0.98] ${
                  active
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-line hover:border-primary/50'
                }`}
              >
                <input
                  type='radio'
                  name='payout-coin'
                  value={m.id}
                  checked={active}
                  onChange={() => setMethodId(m.id)}
                  className='peer sr-only'
                />
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg ${active ? 'bg-primary/12 text-primary' : 'bg-bg text-muted'}`}
                >
                  <Icon size={18} />
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-sm font-semibold'>
                    {m.coin}
                  </span>
                  <span className='block text-xs text-muted'>{m.network}</span>
                </span>
                <span
                  className={`grid size-[18px] shrink-0 place-items-center rounded-full border-2 transition ${active ? 'border-primary' : 'border-line'} peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40`}
                >
                  {active && (
                    <span className='size-2 rounded-full bg-primary' />
                  )}
                </span>
              </label>
            );
          })}
        </div>

        <div className='mb-1.5 flex items-center justify-between'>
          <label htmlFor='wd-amount' className='text-sm font-medium'>
            Amount
          </label>
          <button
            type='button'
            onClick={() => setAmount((balance / 100).toFixed(2))}
            className='text-[13px] font-semibold text-primary active:text-primary-press'
          >
            Withdraw all
          </button>
        </div>

        <div
          className={`flex items-center rounded-xl border px-3.5 ${error ? 'border-down' : 'border-line focus-within:border-primary'}`}
        >
          <span className='text-muted'>$</span>
          <input
            id='wd-amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode='decimal'
            placeholder='0.00'
            aria-invalid={!!error}
            aria-describedby={error ? 'wd-error' : undefined}
            className='w-full bg-transparent px-2 py-3 font-mono outline-none'
          />
        </div>
        {error ? (
          <p id='wd-error' className='mt-1.5 text-[13px] text-down'>
            {error}
          </p>
        ) : (
          <p className='mt-1.5 text-[13px] text-muted'>
            Available: {formatCents(balance)}
          </p>
        )}

        <label
          htmlFor='wd-address'
          className='mb-1.5 mt-6 block text-sm font-medium'
        >
          Your {method.coin} address
        </label>
        <input
          id='wd-address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={`Paste your ${method.network} address`}
          spellCheck={false}
          autoComplete='off'
          className='w-full rounded-xl border border-line bg-transparent px-3.5 py-3 font-mono text-[13px] outline-none focus:border-primary'
        />
        <p className='mt-1.5 text-[13px] text-muted'>
          Must be a {method.network} address. Funds sent to the wrong network
          cannot be recovered.
        </p>
      </div>

      <aside className='h-fit rounded-[14px] border border-line bg-bg p-5'>
        <h3 className='mb-4 text-base font-semibold'>Withdrawal summary</h3>
        <dl className='space-y-3 text-sm'>
          <DetailRow
            label='Minimum'
            value={formatCents(withdrawalConfig.minCents)}
          />
          <DetailRow
            label='Coin'
            value={`${method.coin} (${method.network})`}
          />
        </dl>

        <div className='my-4 h-px bg-line' />
        <dl>
          <DetailRow label='You receive' value={formatCents(cents)} tone='up' />
        </dl>

        <button
          type='button'
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'
        >
          {submitting ? 'Submitting...' : 'Request withdrawal'}
        </button>

        {submitError && (
          <p className='mt-3 text-center text-[13px] text-down'>
            {submitError}
          </p>
        )}
      </aside>
    </div>
  );
}
