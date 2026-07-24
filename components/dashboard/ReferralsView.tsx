'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import CopyField from '@/components/ui/CopyField';
import Stat from '@/components/ui/Stat';
import { formatCents, formatDate } from '@/lib/money';
import {
  referral,
  referrals,
  referralEarnedCents,
  type ReferralRow,
} from '@/lib/dashboard-data';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'joined', label: 'Joined' },
  { key: 'status', label: 'Status' },
  { key: 'bonus', label: 'Bonus earned', align: 'right' },
];

export default function ReferralsView() {
  const invested = referrals.filter((r) => r.hasInvested).length;

  return (
    <>
      <div className='mb-5 grid gap-3.5 sm:grid-cols-3'>
        <Stat label='Total referrals' value={String(referrals.length)} />
        <Stat label='Have invested' value={String(invested)} />
        <Stat
          label='Bonus earned'
          value={formatCents(referralEarnedCents)}
          tone='up'
        />
      </div>

      <div className='mb-5 rounded-[14px] border border-line p-5'>
        <h2 className='text-base font-semibold'>Your referral link</h2>
        <p className='mb-4 mt-1 text-sm text-muted'>
          You earn 5% of a referred user&apos;s first investment, credited
          automatically.
        </p>

        <CopyField value={referral.link} />

        <div className='mt-3.5 flex items-center gap-2.5 text-sm'>
          <span className='text-muted'>Referral code</span>
          <code className='rounded-lg bg-bg px-2.5 py-1 font-mono text-[13px] font-semibold'>
            {referral.code}
          </code>
        </div>
      </div>

      <h2 className='mb-3.5 text-base font-semibold'>People you referred</h2>

      <DataTable<ReferralRow>
        columns={columns}
        rows={referrals}
        getId={(r) => r.id}
        searchIn={(r) => `${r.name} ${r.joinedAt}`}
        emptyMessage='Nobody has signed up with your link yet.'
        renderCell={(r, key) => {
          if (key === 'name')
            return <span className='font-medium'>{r.name}</span>;
          if (key === 'joined')
            return <span className='text-muted'>{formatDate(r.joinedAt)}</span>;
          if (key === 'status')
            return (
              <Badge tone={r.hasInvested ? 'success' : 'neutral'}>
                {r.hasInvested ? 'Invested' : 'Signed up'}
              </Badge>
            );
          return (
            <span
              className={`font-mono font-semibold ${r.bonusCents > 0 ? 'text-up' : 'text-muted'}`}
            >
              {r.bonusCents > 0
                ? `+${formatCents(r.bonusCents)}`
                : formatCents(0)}
            </span>
          );
        }}
      />
    </>
  );
}
