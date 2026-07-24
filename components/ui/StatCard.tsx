import type { ReactNode } from 'react';

type Tone = 'primary' | 'up' | 'down' | 'amber';

const TONES: Record<Tone, string> = {
  primary: 'bg-primary/12 text-primary',
  up: 'bg-up/12 text-up',
  down: 'bg-down/12 text-down',
  amber: 'bg-gold/14 text-gold',
};

export default function StatCard({
  label,
  value,
  icon,
  tone = 'primary',
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className='flex items-center justify-between rounded-2xl border border-line bg-surface p-[18px] transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]'>
      <div>
        <p className='mb-1.5 text-[12.5px] text-muted'>{label}</p>
        <p className='font-mono text-[22px] font-semibold tracking-tight'>
          {value}
        </p>
      </div>
      <span
        className={`grid size-11 place-items-center rounded-xl ${TONES[tone]}`}
      >
        {icon}
      </span>
    </div>
  );
}
