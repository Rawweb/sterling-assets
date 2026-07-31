'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatCents, formatDate } from '@/lib/money';
import type { WalletAddressRow } from '@/lib/admin-settings';

export default function AdminSettingsView({
  wallets,
}: {
  wallets: WalletAddressRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  return (
    <div>
      <h2 className='mb-1 text-base font-semibold'>Wallet addresses</h2>
      <p className='mb-5 text-sm text-muted'>
        These are the addresses users send crypto to. Changes take effect
        immediately for all new deposits.
      </p>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {wallets.map((wallet) =>
          editingId === wallet.id ? (
            <WalletEditCard
              key={wallet.id}
              wallet={wallet}
              onCancel={() => setEditingId(null)}
              onSaved={handleSaved}
            />
          ) : (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setEditingId(wallet.id)}
            />
          ),
        )}
      </div>
    </div>
  );
}

// ─── Read-only card ───────────────────────────────────────────────────────────

function WalletCard({
  wallet,
  onEdit,
}: {
  wallet: WalletAddressRow;
  onEdit: () => void;
}) {
  return (
    <div className='rounded-[14px] border border-line p-5'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h3 className='font-semibold'>{wallet.coin}</h3>
          <span className='inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary'>
            {wallet.network}
          </span>
        </div>
        <button
          type='button'
          onClick={onEdit}
          className='inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-[13px] font-semibold transition hover:bg-bg active:scale-[0.97]'
        >
          <Pencil size={13} /> Edit
        </button>
      </div>

      <dl className='space-y-3 text-sm'>
        <div>
          <dt className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
            Address
          </dt>
          <dd className='mt-1 break-all font-mono text-[12px]'>
            {wallet.address}
          </dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Min deposit</dt>
          <dd className='font-mono font-semibold'>
            {formatCents(wallet.minCents)}
          </dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Last updated</dt>
          <dd className='text-muted'>{formatDate(wallet.updatedAt)}</dd>
        </div>
      </dl>
    </div>
  );
}

// ─── Edit card ────────────────────────────────────────────────────────────────

function WalletEditCard({
  wallet,
  onCancel,
  onSaved,
}: {
  wallet: WalletAddressRow;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const inputClass =
    'w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-primary bg-surface';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const minDollars = parseFloat(String(fd.get('min') ?? '0'));

    const payload = {
      network: String(fd.get('network') ?? '').trim(),
      address: String(fd.get('address') ?? '').trim(),
      minCents: Math.round(minDollars * 100),
    };

    try {
      const res = await fetch(`/api/admin/settings/wallets/${wallet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      toast.success(`${wallet.coin} address updated.`);
      onSaved();
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='rounded-[14px] border border-primary/40 p-5 ring-2 ring-primary/20'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='font-semibold'>{wallet.coin}</h3>
        <button
          type='button'
          onClick={onCancel}
          className='grid size-7 place-items-center rounded-lg text-muted hover:bg-bg active:scale-[0.97]'
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className='space-y-3'>
        {error && (
          <p className='rounded-lg border border-down/30 bg-down/10 px-3 py-2 text-[13px] text-down'>
            {error}
          </p>
        )}

        <div>
          <label className='mb-1 block text-[12px] font-medium text-muted'>
            Network
          </label>
          <input
            name='network'
            defaultValue={wallet.network}
            required
            className={inputClass}
            placeholder='e.g. BTC, ERC20, TRC20'
          />
        </div>

        <div>
          <label className='mb-1 block text-[12px] font-medium text-muted'>
            Address
          </label>
          <textarea
            name='address'
            defaultValue={wallet.address}
            required
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder='Paste the wallet address'
          />
        </div>

        <div>
          <label className='mb-1 block text-[12px] font-medium text-muted'>
            Min deposit ($)
          </label>
          <input
            name='min'
            type='number'
            step='0.01'
            min='0.01'
            defaultValue={wallet.minCents / 100}
            required
            className={inputClass}
          />
        </div>

        <div className='flex gap-2 pt-1'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 rounded-xl border border-line px-3 py-2.5 text-[13px] font-semibold transition hover:bg-bg active:scale-[0.97]'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={submitting}
            className='flex-1 rounded-xl bg-primary px-3 py-2.5 text-[13px] font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:opacity-60'
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
