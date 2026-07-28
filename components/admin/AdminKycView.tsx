'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/money';
import { docTypes } from '@/lib/dashboard-data';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import type { AdminKycSubmission } from '@/lib/admin-kyc';

const TABS = ['All', 'Pending', 'Approved', 'Rejected'] as const;
type Tab = (typeof TABS)[number];

const COLUMNS = [
  { key: 'user', label: 'User' },
  { key: 'document', label: 'Document' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Submitted' },
  { key: 'docs', label: 'Files' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

function statusTone(
  status: string,
): 'success' | 'danger' | 'pending' | 'neutral' {
  if (status === 'APPROVED') return 'success';
  if (status === 'REJECTED') return 'danger';
  if (status === 'PENDING') return 'pending';
  return 'neutral';
}

function statusText(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function docLabel(type: string) {
  return docTypes.find((d) => d.id === type)?.label ?? type;
}

function DocLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline active:text-primary-press'
    >
      {label} <ExternalLink size={11} />
    </a>
  );
}

export default function AdminKycView({
  submissions,
}: {
  submissions: AdminKycSubmission[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (tab === 'All') return true;
    return s.status === tab.toUpperCase();
  });

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/kyc/${id}/${action}`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? 'Action failed. Please try again.');
        return;
      }

      toast.success(
        action === 'approve'
          ? 'KYC approved. Withdrawals unlocked for this user.'
          : 'KYC rejected. User can resubmit.',
      );
      router.refresh();
    } catch {
      toast.error('Could not reach the server. Check your connection.');
    } finally {
      setLoadingId(null);
    }
  }

  function renderCell(row: AdminKycSubmission, key: string) {
    switch (key) {
      case 'user':
        return (
          <div>
            <p className='font-medium'>{row.user.fullName}</p>
            <p className='text-[12px] text-muted truncate'>{row.user.email}</p>
          </div>
        );

      case 'document':
        return (
          <div>
            <p className='text-sm font-medium'>{docLabel(row.documentType)}</p>
            <p className='text-[12px] text-muted'>DOB: {row.dateOfBirth}</p>
          </div>
        );

      case 'location':
        return (
          <div>
            <p className='text-sm'>{row.city}</p>
            <p className='text-[12px] text-muted'>{row.country}</p>
          </div>
        );

      case 'date':
        return <span className='text-muted'>{formatDate(row.createdAt)}</span>;

      case 'docs':
        return (
          <div className='flex flex-col gap-1'>
            <DocLink url={row.documentFrontUrl} label='Front' />
            {row.documentBackUrl && (
              <DocLink url={row.documentBackUrl} label='Back' />
            )}
          </div>
        );

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
              aria-label='Approve KYC submission'
              onClick={() => handleAction(row.id, 'approve')}
              disabled={!!loadingId}
              className={`grid size-8 place-items-center rounded-full bg-up/12 text-up transition hover:bg-up/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${busy ? 'animate-pulse' : ''}`}
            >
              <Check size={15} strokeWidth={2.5} />
            </button>
            <button
              type='button'
              aria-label='Reject KYC submission'
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
          `${row.user.fullName} ${row.user.email} ${docLabel(row.documentType)} ${row.city} ${row.country} ${row.status}`
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
                  Document
                </p>
                <p className='mt-1 font-medium'>{docLabel(row.documentType)}</p>
                <p className='text-[12px] text-muted'>DOB: {row.dateOfBirth}</p>
              </div>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                  Location
                </p>
                <p className='mt-1'>{row.city}</p>
                <p className='text-[12px] text-muted'>{row.country}</p>
              </div>
            </div>

            <div className='flex items-center justify-between gap-3'>
              <div className='flex flex-col gap-1'>
                <DocLink url={row.documentFrontUrl} label='Front' />
                {row.documentBackUrl && (
                  <DocLink url={row.documentBackUrl} label='Back' />
                )}
              </div>
              {row.status === 'PENDING' && renderCell(row, 'actions')}
            </div>
          </div>
        )}
        emptyMessage={
          tab === 'Pending'
            ? 'No pending KYC submissions. All clear.'
            : 'No submissions found.'
        }
      />
    </div>
  );
}
