'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/money';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import type { AdminUser } from '@/lib/admin-users';

const TABS = ['All', 'Verified', 'Unverified'] as const;
type Tab = (typeof TABS)[number];

const COLUMNS = [
  { key: 'user', label: 'User' },
  { key: 'country', label: 'Country' },
  { key: 'kyc', label: 'KYC' },
  { key: 'verified', label: 'Email' },
  { key: 'joined', label: 'Joined' },
];

function kycTone(status: string): 'success' | 'danger' | 'pending' | 'neutral' {
  if (status === 'APPROVED') return 'success';
  if (status === 'REJECTED') return 'danger';
  if (status === 'PENDING') return 'pending';
  return 'neutral';
}

function kycText(status: string) {
  if (status === 'NONE') return 'None';
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function AdminUsersView({ users }: { users: AdminUser[] }) {
  const [tab, setTab] = useState<Tab>('All');

  const filtered = users.filter((u) => {
    if (tab === 'All') return true;
    if (tab === 'Verified') return !!u.emailVerified;
    return !u.emailVerified;
  });

  function renderCell(row: AdminUser, key: string) {
    switch (key) {
      case 'user':
        return (
          <div>
            <p className='font-medium'>{row.fullName}</p>
            <p className='text-[12px] text-muted truncate'>{row.email}</p>
          </div>
        );

      case 'country':
        return <span className='text-muted'>{row.country ?? 'Not set'}</span>;

      case 'kyc':
        return (
          <Badge tone={kycTone(row.kycStatus)}>{kycText(row.kycStatus)}</Badge>
        );

      case 'verified':
        return row.emailVerified ? (
          <Badge tone='success'>Verified</Badge>
        ) : (
          <Badge tone='danger'>Unverified</Badge>
        );

      case 'joined':
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
          `${row.fullName} ${row.email} ${row.country ?? ''} ${row.kycStatus}`
        }
        renderCell={renderCell}
        mobileCard={(row) => (
          <div className='space-y-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='truncate font-medium'>{row.fullName}</p>
                <p className='truncate text-[12px] text-muted'>{row.email}</p>
              </div>
              <Badge tone={kycTone(row.kycStatus)}>
                {kycText(row.kycStatus)}
              </Badge>
            </div>

            <div className='grid grid-cols-2 gap-3 border-y border-line py-3 text-sm'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                  Country
                </p>
                <p className='mt-1 text-muted'>{row.country ?? 'Not set'}</p>
              </div>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                  Joined
                </p>
                <p className='mt-1 text-muted'>{formatDate(row.createdAt)}</p>
              </div>
            </div>

            <div className='flex items-center justify-between text-sm'>
              <span className='text-[12px] text-muted'>Email</span>
              {row.emailVerified ? (
                <Badge tone='success'>Verified</Badge>
              ) : (
                <Badge tone='danger'>Unverified</Badge>
              )}
            </div>
          </div>
        )}
        emptyMessage='No users found.'
      />
    </div>
  );
}
