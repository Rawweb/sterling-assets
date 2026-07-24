'use client';

import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { formatCents, formatSignedCents, formatDate } from '@/lib/money';
import {
  deposits,
  withdrawals,
  otherTransactions,
  type DepositRow,
  type WithdrawalRow,
  type OtherRow,
  type TxStatus,
} from '@/lib/dashboard-data';

const TABS = ['Deposit', 'Withdrawal', 'Others'] as const;
type Tab = (typeof TABS)[number];

const STATUS_TONE = {
  approved: 'success',
  pending: 'pending',
  rejected: 'danger',
} as const;

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
  { key: 'total', label: 'Amount + charges', align: 'right' },
  { key: 'coin', label: 'Receiving mode' },
  { key: 'status', label: 'Status' },
];

const otherCols: Column[] = [
  { key: 'date', label: 'Date created' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'type', label: 'Type' },
  { key: 'note', label: 'Plan / Narration' },
];

export default function TransactionsView() {
  const [tab, setTab] = useState<Tab>('Deposit');

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Deposit' && (
        <DataTable<DepositRow>
          columns={depositCols}
          rows={deposits}
          getId={(r) => r.id}
          searchIn={(r) => `${r.coin} ${r.status} ${r.date}`}
          emptyMessage='No deposits yet.'
          renderCell={(r, key) => {
            if (key === 'date')
              return <span className='text-muted'>{formatDate(r.date)}</span>;
            if (key === 'amount')
              return (
                <span className='font-mono font-semibold'>
                  {formatCents(r.amountCents)}
                </span>
              );
            if (key === 'coin') return r.coin;
            return <StatusBadge status={r.status} />;
          }}
        />
      )}

      {tab === 'Withdrawal' && (
        <DataTable<WithdrawalRow>
          columns={withdrawalCols}
          rows={withdrawals}
          getId={(r) => r.id}
          searchIn={(r) => `${r.coin} ${r.status} ${r.date}`}
          emptyMessage='No withdrawals yet.'
          renderCell={(r, key) => {
            if (key === 'date')
              return <span className='text-muted'>{formatDate(r.date)}</span>;
            if (key === 'amount')
              return (
                <span className='font-mono font-semibold'>
                  {formatCents(r.amountCents)}
                </span>
              );
            if (key === 'total')
              return (
                <span className='font-mono text-muted'>
                  {formatCents(r.amountCents + r.feeCents)}
                </span>
              );
            if (key === 'coin') return r.coin;
            return <StatusBadge status={r.status} />;
          }}
        />
      )}

      {tab === 'Others' && (
        <DataTable<OtherRow>
          columns={otherCols}
          rows={otherTransactions}
          getId={(r) => r.id}
          searchIn={(r) => `${r.type} ${r.note} ${r.date}`}
          emptyMessage='Nothing to show yet.'
          renderCell={(r, key) => {
            if (key === 'date')
              return <span className='text-muted'>{formatDate(r.date)}</span>;
            if (key === 'amount')
              return (
                <span
                  className={`font-mono font-semibold ${r.amountCents < 0 ? 'text-down' : 'text-up'}`}
                >
                  {formatSignedCents(r.amountCents)}
                </span>
              );
            if (key === 'type')
              return <span className='font-medium'>{r.type}</span>;
            return <span className='text-muted'>{r.note}</span>;
          }}
        />
      )}
    </>
  );
}
