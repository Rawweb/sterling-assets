'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import { formatCents, formatDate } from '@/lib/money';
import { profitHistory, type ProfitRow } from '@/lib/dashboard-data';

const columns: Column[] = [
  { key: 'date', label: 'Date created' },
  { key: 'plan', label: 'Plan' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount', align: 'right' },
];

export default function ProfitHistoryView() {
  const total = profitHistory.reduce((sum, r) => sum + r.amountCents, 0);

  return (
    <>
      <div className='mb-4 flex items-center justify-between rounded-[14px] border border-line bg-bg px-4 py-3.5'>
        <span className='text-sm text-muted'>Total profit earned</span>
        <b className='font-mono text-lg text-up'>{formatCents(total)}</b>
      </div>

      <DataTable<ProfitRow>
        columns={columns}
        rows={profitHistory}
        getId={(r) => r.id}
        searchIn={(r) => `${r.plan} ${r.type} ${r.date}`}
        emptyMessage='No ROI recorded yet.'
        renderCell={(r, key) => {
          if (key === 'date')
            return <span className='text-muted'>{formatDate(r.date)}</span>;
          if (key === 'plan')
            return <span className='font-medium'>{r.plan}</span>;
          if (key === 'type')
            return <span className='text-muted'>{r.type}</span>;
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
