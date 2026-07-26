'use client';

import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { formatCents, formatSignedCents, formatDate } from '@/lib/money';
import { type TxStatus } from '@/lib/dashboard-data';
import type { UserDeposit } from '@/lib/deposits';
import type { UserWithdrawal } from '@/lib/withdrawals';
import type { OtherTransaction } from '@/lib/transactions';

const TABS = ['Deposit', 'Withdrawal', 'Others'] as const;
type Tab = (typeof TABS)[number];

const STATUS_TONE = {
  approved: 'success',
  pending: 'pending',
  rejected: 'danger',
} as const;

const DEPOSIT_TONE = {
  APPROVED: 'success',
  PENDING: 'pending',
  REJECTED: 'danger',
} as const;

const WITHDRAWAL_TONE = {
  APPROVED: 'success',
  PENDING: 'pending',
  REJECTED: 'danger',
} as const;

function WithdrawalBadge({
  status,
}: {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}) {
  return <Badge tone={WITHDRAWAL_TONE[status]}>{status.toLowerCase()}</Badge>;
}

function DepositBadge({
  status,
}: {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}) {
  return <Badge tone={DEPOSIT_TONE[status]}>{status.toLowerCase()}</Badge>;
}

function StatusBadge({ status }: { status: TxStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
}

const depositCols: Column[] = [
  { key: 'date', label: 'Date created' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'coin', label: 'Payment mode' },
  { key: 'status', label: 'Status' },
];

const withdrawalCols: Column[] = [
  { key: 'date', label: 'Date created' },
  { key: 'amount', label: 'Amount requested', align: 'right' },
  { key: 'coin', label: 'Receiving mode' },
  { key: 'status', label: 'Status' },
];

const otherCols: Column[] = [
  { key: 'date', label: 'Date created' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
];

export default function TransactionsView({
  deposits,
  withdrawals,
  others,
}: {
  deposits: UserDeposit[];
  withdrawals: UserWithdrawal[];
  others: OtherTransaction[];
}) {
  const [tab, setTab] = useState<Tab>('Deposit');

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Deposit' && (
        <DataTable<UserDeposit>
          columns={depositCols}
          rows={deposits}
          getId={(r) => r.id}
          searchIn={(r) => `${r.coin} ${r.status}`}
          emptyMessage='No deposits yet.'
          renderCell={(r, key) => {
            if (key === 'date')
              return (
                <span className='text-muted'>{formatDate(r.createdAt)}</span>
              );
            if (key === 'amount')
              return (
                <span className='font-mono font-semibold'>
                  {formatCents(r.amount)}
                </span>
              );
            if (key === 'coin') return r.coin;
            return <DepositBadge status={r.status} />;
          }}
        />
      )}

      {tab === 'Withdrawal' && (
        <DataTable<UserWithdrawal>
          columns={withdrawalCols}
          rows={withdrawals}
          getId={(r) => r.id}
          searchIn={(r) => `${r.coin} ${r.status}`}
          emptyMessage='No withdrawals yet.'
          renderCell={(r, key) => {
            if (key === 'date')
              return (
                <span className='text-muted'>{formatDate(r.createdAt)}</span>
              );
            if (key === 'amount')
              return (
                <span className='font-mono font-semibold'>
                  {formatCents(r.amount)}
                </span>
              );
            if (key === 'coin') return r.coin;
            return <WithdrawalBadge status={r.status} />;
          }}
        />
      )}

      {tab === 'Others' && (
        <DataTable<OtherTransaction>
          columns={otherCols}
          rows={others}
          getId={(r) => r.id}
          searchIn={(r) => r.label}
          emptyMessage='Nothing here yet.'
          renderCell={(r, key) => {
            if (key === 'date')
              return (
                <span className='text-muted'>{formatDate(r.createdAt)}</span>
              );
            if (key === 'type')
              return <span className='font-medium'>{r.label}</span>;
            if (key === 'amount')
              return (
                <span
                  className={`font-mono font-semibold ${r.amountCents < 0 ? 'text-down' : 'text-up'}`}
                >
                  {formatSignedCents(r.amountCents)}
                </span>
              );
            return null;
          }}
        />
      )}
    </>
  );
}
