import type { ActivePlan } from '@/lib/dashboard-data';
import { formatCents } from '@/lib/money';
import Badge from '@/components/ui/Badge';

export default function PlanCard({ plan }: { plan: ActivePlan }) {
  const pct = Math.round((plan.daysPaid / plan.durationDays) * 100);

  return (
    <div className='rounded-[14px] border border-line p-[18px]'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-semibold'>{plan.name}</p>
          <p className='mt-0.5 font-mono text-[13px] text-muted'>
            {formatCents(plan.investedCents)} invested
          </p>
        </div>
        <Badge tone='active'>Active</Badge>
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
            className='h-full rounded-full bg-linear-to-r from-primary to-primary-press'
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between border-t border-line pt-3.5 text-sm'>
        <span className='text-muted'>Earned so far</span>
        <b className='font-mono text-up'>+{formatCents(plan.earnedCents)}</b>
      </div>
    </div>
  );
}
