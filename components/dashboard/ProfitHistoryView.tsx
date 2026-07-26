'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import { formatCents, formatDate } from '@/lib/money';
import type { ProfitHistoryRow } from '@/lib/profit-history';

const columns: Column[] = [
  { key: 'date', label: 'Date created' },
  { key: 'plan', label: 'Plan' },
  { key: 'amount', label: 'Amount', align: 'right' },
];

export default function ProfitHistoryView({
  rows,
}: {
  rows: ProfitHistoryRow[];
}) {
  const total = rows.reduce((sum, r) => sum + r.amountCents, 0);

  return (
    <>
      <div className='mb-4 flex items-center justify-between rounded-[14px] border border-line bg-bg px-4 py-3.5'>
        <span className='text-sm text-muted'>Total profit earned</span>
        <b className='font-mono text-lg text-up'>{formatCents(total)}</b>
      </div>

      <DataTable<ProfitHistoryRow>
        columns={columns}
        rows={rows}
        getId={(r) => r.id}
        searchIn={(r) => r.planName}
        emptyMessage='No profit recorded yet.'
        renderCell={(r, key) => {
          if (key === 'date')
            return (
              <span className='text-muted'>{formatDate(r.createdAt)}</span>
            );
          if (key === 'plan')
            return <span className='font-medium'>{r.planName}</span>;
          return (
            <span className='font-mono font-semibold text-up'>
              +{formatCents(r.amountCents)}
            </span>
          );
        }}
      />
    </>
  );
}
