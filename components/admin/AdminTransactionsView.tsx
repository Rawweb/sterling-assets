'use client';

import { useState } from 'react';
import { formatDate, formatSignedCents } from '@/lib/money';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import type { AdminTransaction } from '@/lib/admin-transactions';

const TABS = ['All', 'Deposits', 'Withdrawals', 'Profits', 'Bonuses'] as const;
type Tab = (typeof TABS)[number];

const COLUMNS = [
  { key: 'user', label: 'User' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { key: 'date', label: 'Date' },
];

const TYPE_LABELS: Record<string, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  WITHDRAWAL_REVERSAL: 'Reversal',
  PROFIT: 'Profit',
  INVESTMENT: 'Investment',
  PRINCIPAL_RETURN: 'Return',
  BONUS: 'Bonus',
  REFERRAL_BONUS: 'Referral',
  ADJUSTMENT: 'Adjustment',
};

type BadgeTone = 'active' | 'success' | 'danger' | 'pending' | 'neutral';

function typeTone(type: string): BadgeTone {
  if (type === 'DEPOSIT') return 'active';
  if (type === 'WITHDRAWAL') return 'neutral';
  if (type === 'WITHDRAWAL_REVERSAL') return 'pending';
  if (['PROFIT', 'PRINCIPAL_RETURN', 'BONUS', 'REFERRAL_BONUS'].includes(type))
    return 'success';
  return 'neutral';
}

// Which ledger types belong to each tab.
const TAB_TYPES: Record<Tab, string[] | null> = {
  All: null,
  Deposits: ['DEPOSIT'],
  Withdrawals: ['WITHDRAWAL', 'WITHDRAWAL_REVERSAL'],
  Profits: ['PROFIT', 'PRINCIPAL_RETURN', 'INVESTMENT'],
  Bonuses: ['BONUS', 'REFERRAL_BONUS'],
};

export default function AdminTransactionsView({
  transactions,
}: {
  transactions: AdminTransaction[];
}) {
  const [tab, setTab] = useState<Tab>('All');

  const filtered = transactions.filter((t) => {
    const types = TAB_TYPES[tab];
    if (!types) return true;
    return types.includes(t.type);
  });

  function renderCell(row: AdminTransaction, key: string) {
    switch (key) {
      case 'user':
        return (
          <div>
            <p className='font-medium'>{row.user.fullName}</p>
            <p className='text-[12px] text-muted'>{row.user.email}</p>
          </div>
        );

      case 'type':
        return (
          <Badge tone={typeTone(row.type)}>
            {TYPE_LABELS[row.type] ?? row.type}
          </Badge>
        );

      case 'amount':
        return (
          <span
            className={`font-mono font-semibold ${
              row.amount >= 0 ? 'text-up' : 'text-down'
            }`}
          >
            {formatSignedCents(row.amount)}
          </span>
        );

      case 'date':
        return <span className='text-muted'>{formatDate(row.createdAt)}</span>;

      default:
        return null;
    }
  }

  return (
    <div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <DataTable
        columns={COLUMNS}
        rows={filtered}
        getId={(row) => row.id}
        searchIn={(row) =>
          `${row.user.fullName} ${row.user.email} ${TYPE_LABELS[row.type] ?? row.type}`
        }
        renderCell={renderCell}
        mobileCard={(row) => (
          <div className='space-y-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='truncate font-medium'>{row.user.fullName}</p>
                <p className='truncate text-[12px] text-muted'>
                  {row.user.email}
                </p>
              </div>
              <Badge tone={typeTone(row.type)}>
                {TYPE_LABELS[row.type] ?? row.type}
              </Badge>
            </div>

            <div className='flex items-center justify-between border-t border-line pt-3 text-sm'>
              <span className='text-muted'>{formatDate(row.createdAt)}</span>
              <span
                className={`font-mono font-semibold ${
                  row.amount >= 0 ? 'text-up' : 'text-down'
                }`}
              >
                {formatSignedCents(row.amount)}
              </span>
            </div>
          </div>
        )}
        emptyMessage='No transactions found.'
      />
    </div>
  );
}
