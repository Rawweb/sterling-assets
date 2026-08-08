'use client';

import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import { Bitcoin, Coins, CircleDollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import DetailRow from '@/components/ui/DetailRow';
import CopyField from '@/components/ui/CopyField';
import { formatCents } from '@/lib/money';
import { QRCodeSVG } from 'qrcode.react';
import FileDrop from '@/components/ui/FileDrop';
import Link from 'next/link';
import type { DepositMethod } from '@/lib/wallet-addresses';

const COIN_ICONS: Record<string, LucideIcon> = {
  Bitcoin: Bitcoin,
  Ethereum: Coins,
  'USDT (TRC20)': CircleDollarSign,
};

function getCoinIcon(coin: string): LucideIcon {
  return COIN_ICONS[coin] ?? CircleDollarSign;
}

// Upload a file to R2 via the presign endpoint and return the R2 key.
async function uploadFile(file: File, uploadType: string): Promise<string> {
  const presignRes = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, uploadType, contentLength: file.size }),
  });

  if (!presignRes.ok) {
    const d = await presignRes.json().catch(() => ({}));
    throw new Error(d.error ?? 'Failed to get upload URL.');
  }

  const { uploadUrl, key } = await presignRes.json();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('Failed to upload proof to storage.');

  return key;
}

export default function DepositView({ methods }: { methods: DepositMethod[] }) {
  const [methodId, setMethodId] = useState(methods[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const method = methods.find((m) => m.id === methodId) ?? methods[0];
  const cents = Math.round((parseFloat(amount) || 0) * 100);

  const error =
    method && amount !== '' && cents < method.minCents
      ? `Minimum deposit is ${formatCents(method.minCents)}`
      : null;

  async function handleSubmit() {
    if (!file || !method) return;
    setSubmitting(true);

    try {
      // Upload proof to R2 first, then record the deposit.
      const proofKey = await uploadFile(file, 'deposit-proof');

      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cents,
          coin: method.coin,
          proofUrl: proofKey,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      toast.success('Deposit submitted! We will review it shortly.');
      setSubmitted(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Network error. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!method) {
    return (
      <p className='py-10 text-center text-sm text-muted'>
        No deposit methods available. Please check back later.
      </p>
    );
  }

  if (submitted) {
    return (
      <div className='mx-auto max-w-md rounded-[14px] border border-line px-5 py-10 text-center'>
        <div className='mx-auto grid size-14 place-items-center rounded-full bg-up/12'>
          <Check size={28} className='text-up' />
        </div>
        <h2 className='mt-4 text-lg font-semibold'>Deposit submitted</h2>
        <p className='mx-auto mt-1.5 max-w-sm text-sm text-muted'>
          We have received your deposit and it is awaiting review. You will be
          notified once it is approved.
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

  if (confirmed) {
    return (
      <>
        <button
          type='button'
          onClick={() => setConfirmed(false)}
          className='mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary active:text-primary-press'
        >
          <ArrowLeft size={16} /> Change amount
        </button>

        <div className='grid gap-3.5 lg:grid-cols-[1fr_340px]'>
          <div className='rounded-[14px] border border-line p-5'>
            <h2 className='text-base font-semibold'>
              Send {formatCents(cents)} in {method.coin}
            </h2>
            <p className='mb-4 mt-1 text-sm text-muted'>
              Send only {method.coin} on the {method.network} network to this
              address.
            </p>

            <div className='mb-4 flex justify-center rounded-xl border border-line bg-surface p-5'>
              <QRCodeSVG
                value={method.address}
                size={180}
                level='M'
                marginSize={0}
              />
            </div>

            <CopyField value={method.address} />

            <div className='mt-4 flex gap-2.5 rounded-xl border border-gold/40 bg-gold/10 p-3.5'>
              <AlertTriangle size={18} className='mt-0.5 shrink-0 text-gold' />
              <p className='text-[13px]'>
                Sending any other coin, or using a different network, will lose
                your funds permanently. We cannot recover them.
              </p>
            </div>

            <div className='mt-6'>
              <FileDrop
                id='deposit-proof'
                label='Upload proof of payment'
                file={file}
                onChange={setFile}
                hint='Screenshot of your payment, PNG or JPG'
              />
            </div>
          </div>

          <aside className='h-fit rounded-[14px] border border-line bg-bg p-5'>
            <h3 className='mb-4 text-base font-semibold'>Deposit summary</h3>
            <dl className='space-y-3 text-sm'>
              <DetailRow label='Amount' value={formatCents(cents)} />
              <DetailRow label='Coin' value={method.coin} />
              <DetailRow label='Network' value={method.network} />
              <DetailRow label='Status' value='Awaiting payment' />
            </dl>

            <button
              type='button'
              onClick={handleSubmit}
              disabled={!file || submitting}
              className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'
            >
              {submitting ? 'Uploading...' : 'I have sent the payment'}
            </button>
          </aside>
        </div>
      </>
    );
  }

  return (
    <div className='grid gap-3.5 lg:grid-cols-[1fr_340px]'>
      <div className='rounded-[14px] border border-line p-5'>
        <p className='mb-2.5 text-sm font-medium'>Choose a coin</p>
        <div
          role='radiogroup'
          aria-label='Choose a coin'
          className='mb-6 grid gap-2.5 sm:grid-cols-3'
        >
          {methods.map((m) => {
            const Icon = getCoinIcon(m.coin);
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
                  name='coin'
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

        <label
          htmlFor='deposit-amount'
          className='mb-1.5 block text-sm font-medium'
        >
          Amount
        </label>
        <div
          className={`flex items-center rounded-xl border px-3.5 ${
            error ? 'border-down' : 'border-line focus-within:border-primary'
          }`}
        >
          <span className='text-muted'>$</span>
          <input
            id='deposit-amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode='decimal'
            placeholder='0.00'
            aria-invalid={!!error}
            aria-describedby={error ? 'deposit-error' : undefined}
            className='w-full bg-transparent px-2 py-3 font-mono outline-none'
          />
        </div>
        {error && (
          <p id='deposit-error' className='mt-1.5 text-[13px] text-down'>
            {error}
          </p>
        )}
      </div>

      <aside className='h-fit rounded-[14px] border border-line bg-bg p-5'>
        <h3 className='mb-4 text-base font-semibold'>Deposit details</h3>
        <dl className='space-y-3 text-sm'>
          <DetailRow label='Coin' value={method.coin} />
          <DetailRow label='Network' value={method.network} />
          <DetailRow label='You deposit' value={formatCents(cents)} />
        </dl>

        <button
          type='button'
          disabled={cents <= 0 || error !== null}
          onClick={() => setConfirmed(true)}
          className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'
        >
          Continue
        </button>
      </aside>
    </div>
  );
}
