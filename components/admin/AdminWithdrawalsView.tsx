'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatCents, formatDate } from '@/lib/money';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import type { AdminWithdrawal } from '@/lib/admin-withdrawals';

const TABS = ['All', 'Pending', 'Approved', 'Rejected'] as const;
type Tab = (typeof TABS)[number];

const COLUMNS = [
  { key: 'user', label: 'User' },
  { key: 'amount', label: 'Amount' },
  { key: 'destination', label: 'Destination' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

function statusTone(status: string): 'success' | 'danger' | 'pending' {
  if (status === 'APPROVED') return 'success';
  if (status === 'REJECTED') return 'danger';
  return 'pending';
}

function statusText(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

export default function AdminWithdrawalsView({
  withdrawals,
}: {
  withdrawals: AdminWithdrawal[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = withdrawals.filter((w) => {
    if (tab === 'All') return true;
    return w.status === tab.toUpperCase();
  });

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/${action}`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? 'Action failed. Please try again.');
        return;
      }

      toast.success(
        action === 'approve'
          ? 'Withdrawal approved.'
          : 'Withdrawal rejected and funds returned.',
      );
      router.refresh();
    } catch {
      toast.error('Could not reach the server. Check your connection.');
    } finally {
      setLoadingId(null);
    }
  }

  function renderCell(row: AdminWithdrawal, key: string) {
    switch (key) {
      case 'user':
        return (
          <div>
            <p className='font-medium'>{row.user.fullName}</p>
            <p className='text-[12px] text-muted truncate'>{row.user.email}</p>
          </div>
        );

      case 'amount':
        return (
          <div>
            <p className='font-mono font-semibold'>{formatCents(row.amount)}</p>
            <p className='text-[12px] text-muted'>{row.coin}</p>
          </div>
        );

      case 'destination':
        return (
          <div>
            <p className='font-mono text-[12px]'>
              {truncateAddress(row.address)}
            </p>
            <p className='text-[12px] text-muted'>{row.coin}</p>
          </div>
        );

      case 'date':
        return <span className='text-muted'>{formatDate(row.createdAt)}</span>;

      case 'status':
        return (
          <Badge tone={statusTone(row.status)}>{statusText(row.status)}</Badge>
        );

      case 'actions': {
        if (row.status !== 'PENDING') return null;
        const busy = loadingId === row.id;
        return (
          <div className='flex items-center gap-2'>
            <button
              type='button'
              aria-label='Approve withdrawal'
              onClick={() => handleAction(row.id, 'approve')}
              disabled={!!loadingId}
              className={`grid size-8 place-items-center rounded-full bg-up/12 text-up transition hover:bg-up/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${busy ? 'animate-pulse' : ''}`}
            >
              <Check size={15} strokeWidth={2.5} />
            </button>
            <button
              type='button'
              aria-label='Reject withdrawal'
              onClick={() => handleAction(row.id, 'reject')}
              disabled={!!loadingId}
              className='grid size-8 place-items-center rounded-full bg-down/12 text-down transition hover:bg-down/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50'
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>
        );
      }

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
          `${row.user.fullName} ${row.user.email} ${row.coin} ${row.address} ${row.status}`
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
              <Badge tone={statusTone(row.status)}>
                {statusText(row.status)}
              </Badge>
            </div>

            <div className='grid grid-cols-2 gap-3 border-y border-line py-3 text-sm'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                  Amount
                </p>
                <p className='mt-1 font-mono font-semibold'>
                  {formatCents(row.amount)}
                </p>
                <p className='text-[12px] text-muted'>{row.coin}</p>
              </div>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                  Date
                </p>
                <p className='mt-1 text-muted'>{formatDate(row.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                Destination
              </p>
              <p className='mt-1 font-mono text-[12px]'>
                {truncateAddress(row.address)}
              </p>
              <p className='text-[12px] text-muted'>{row.coin}</p>
            </div>

            {row.status === 'PENDING' && (
              <div className='flex justify-end'>
                {renderCell(row, 'actions')}
              </div>
            )}
          </div>
        )}
        emptyMessage={
          tab === 'Pending'
            ? 'No pending withdrawals. All clear.'
            : 'No withdrawals found.'
        }
      />
    </div>
  );
}
