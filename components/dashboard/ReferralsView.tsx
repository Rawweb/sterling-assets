'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import CopyField from '@/components/ui/CopyField';
import Stat from '@/components/ui/Stat';
import { formatCents, formatDate } from '@/lib/money';
import type { ReferralData, ReferredPerson } from '@/lib/referrals';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'joined', label: 'Joined' },
  { key: 'status', label: 'Status' },
];

export default function ReferralsView({ data }: { data: ReferralData }) {
  return (
    <>
      <div className='mb-5 grid gap-3.5 sm:grid-cols-3'>
        <Stat label='Total referrals' value={String(data.totalReferrals)} />
        <Stat label='Have invested' value={String(data.investedCount)} />
        <Stat
          label='Bonus earned'
          value={formatCents(data.totalBonusCents)}
          tone='up'
        />
      </div>

      <div className='mb-5 rounded-[14px] border border-line p-5'>
        <h2 className='text-base font-semibold'>Your referral link</h2>
        <p className='mb-4 mt-1 text-sm text-muted'>
          You earn 5% of a referred user&apos;s first investment, credited
          automatically.
        </p>

        <CopyField value={data.link} />

        <div className='mt-3.5 flex items-center gap-2.5 text-sm'>
          <span className='text-muted'>Referral code</span>
          <code className='rounded-lg bg-bg px-2.5 py-1 font-mono text-[13px] font-semibold'>
            {data.code}
          </code>
        </div>
      </div>

      <h2 className='mb-3.5 text-base font-semibold'>People you referred</h2>

      <DataTable<ReferredPerson>
        columns={columns}
        rows={data.referrals}
        getId={(r) => r.id}
        searchIn={(r) => r.name}
        emptyMessage='Nobody has signed up with your link yet.'
        renderCell={(r, key) => {
          if (key === 'name')
            return <span className='font-medium'>{r.name}</span>;
          if (key === 'joined')
            return <span className='text-muted'>{formatDate(r.joinedAt)}</span>;
          return (
            <Badge tone={r.hasInvested ? 'success' : 'neutral'}>
              {r.hasInvested ? 'Invested' : 'Signed up'}
            </Badge>
          );
        }}
      />
    </>
  );
}
