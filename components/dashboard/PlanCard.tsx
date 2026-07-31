import type { UserPlanView } from '@/lib/user-plans';
import { formatCents, formatDate } from '@/lib/money';
import Badge from '@/components/ui/Badge';

function statusBadge(status: string) {
  if (status === 'ACTIVE') return { tone: 'active' as const, label: 'Active' };
  if (status === 'CANCELLED')
    return { tone: 'danger' as const, label: 'Cancelled' };
  return { tone: 'neutral' as const, label: 'Completed' };
}

export default function PlanCard({ plan }: { plan: UserPlanView }) {
  const pct = Math.round((plan.daysPaid / plan.durationDays) * 100);
  const isActive = plan.status === 'ACTIVE';
  const isCancelled = plan.status === 'CANCELLED';
  const { tone, label } = statusBadge(plan.status);

  return (
    <div className='rounded-[14px] border border-line p-[18px]'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-semibold'>{plan.planName}</p>
          <p className='mt-0.5 font-mono text-[13px] text-muted'>
            {formatCents(plan.investedCents)} invested
          </p>
        </div>
        <Badge tone={tone}>{label}</Badge>
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
                : isCancelled
                  ? 'bg-down/40'
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
            {formatDate(plan.startedAt)}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted'>
            {isActive
              ? 'Earned so far'
              : isCancelled
                ? 'Profit discarded'
                : 'Total earned'}
          </span>
          <b className={`font-mono ${isCancelled ? 'text-muted' : 'text-up'}`}>
            {isCancelled ? '—' : `+${formatCents(plan.earnedCents)}`}
          </b>
        </div>
      </div>
    </div>
  );
}
