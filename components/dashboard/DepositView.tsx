'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Upload, ArrowLeft, X } from 'lucide-react';
import DetailRow from '@/components/ui/DetailRow';
import CopyField from '@/components/ui/CopyField';
import { formatCents } from '@/lib/money';
import { depositMethods } from '@/lib/dashboard-data';
import { QRCodeSVG } from 'qrcode.react';

export default function DepositView() {
  const [methodId, setMethodId] = useState(depositMethods[0].id);
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const method = depositMethods.find((m) => m.id === methodId)!;
  const cents = Math.round((parseFloat(amount) || 0) * 100);

  const error =
    amount !== '' && cents < method.minCents
      ? `Minimum deposit is ${formatCents(method.minCents)}`
      : null;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = '';

    if (!picked) return;

    if (!['image/png', 'image/jpeg'].includes(picked.type)) {
      setFileError('Only PNG or JPG files are allowed.');
      setFile(null);
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      setFileError('That file is larger than 5MB.');
      setFile(null);
      return;
    }

    setFileError(null);
    setFile(picked);
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

            {/* qrcode */}
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

            <p className='mb-1.5 mt-6 text-sm font-medium'>
              Upload proof of payment
            </p>

            {file && preview ? (
              <div className='rounded-xl border border-line p-3.5'>
                <div className='flex items-start gap-3.5'>
                  <img
                    src={preview}
                    alt='Proof of payment preview'
                    className='size-20 shrink-0 rounded-lg border border-line object-cover'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{file.name}</p>
                    <p className='mt-0.5 text-xs text-muted'>
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setFile(null)}
                    aria-label='Remove file'
                    className='grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:text-down active:scale-95'
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <label className='flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line px-4 py-8 text-center transition hover:border-primary active:scale-[0.99]'>
                <Upload size={22} className='text-muted' />
                <span className='text-sm font-medium'>Choose a screenshot</span>
                <span className='text-xs text-muted'>
                  PNG or JPG, up to 5MB
                </span>
                <input
                  type='file'
                  accept='image/png,image/jpeg'
                  onChange={onPick}
                  className='sr-only'
                />
              </label>
            )}

            {fileError && (
              <p className='mt-1.5 text-[13px] text-down'>{fileError}</p>
            )}
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
              className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
            >
              I have sent the payment
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
          {/* <DetailRow label='Minimum' value={formatCents(method.minCents)} /> */}
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
