import type { UserPlan } from '@/lib/dashboard-data';
import { formatCents, formatDate } from '@/lib/money';
import Badge from '@/components/ui/Badge';

export default function PlanCard({ plan }: { plan: UserPlan }) {
  const pct = Math.round((plan.daysPaid / plan.durationDays) * 100);
  const isActive = plan.status === 'active';

  return (
    <div className='rounded-[14px] border border-line p-[18px]'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-semibold'>{plan.name}</p>
          <p className='mt-0.5 font-mono text-[13px] text-muted'>
            {formatCents(plan.investedCents)} invested
          </p>
        </div>
        <Badge tone={isActive ? 'active' : 'neutral'}>
          {isActive ? 'Active' : 'Expired'}
        </Badge>
      </div>

      <div className='mt-4'>
        <div className='mb-1.5 flex justify-between text-[11px] text-muted'>
          <span>
            Day {plan.daysPaid} of {plan.durationDays}
          </span>
          <span>{pct}%</span>
        </div>
        <div className='h-1.5 overflow-hidden rounded-full bg-line'>
          <div
            className={`h-full rounded-full ${
              isActive
                ? 'bg-linear-to-r from-primary to-primary-press'
                : 'bg-muted/40'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className='mt-4 space-y-2 border-t border-line pt-3.5 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-muted'>Started</span>
          <span className='font-mono text-[13px] text-muted'>
            {formatDate(plan.startDate)}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted'>
            {isActive ? 'Earned so far' : 'Total earned'}
          </span>
          <b className='font-mono text-up'>+{formatCents(plan.earnedCents)}</b>
        </div>
      </div>
    </div>
  );
}
