import { User, Wallet } from 'lucide-react';
import { formatCents } from '@/lib/money';

export default function ProfileCard({
  fullName,
  balanceCents,
  avatarUrl,
}: {
  fullName: string;
  balanceCents: number;
  avatarUrl?: string | null;
}) {
  return (
    <div className='flex flex-col items-center rounded-2xl bg-navy-900 px-3 py-4 text-center'>
      <div className='size-16 overflow-hidden rounded-full border border-on-navy/20'>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={fullName}
            className='size-16 rounded-full object-cover'
          />
        ) : (
          <div className='grid size-16 place-items-center rounded-full bg-surface text-navy-900'>
            <User size={30} />
          </div>
        )}
      </div>

      <p className='mt-2.5 text-sm font-semibold text-surface'>{fullName}</p>

      <span className='mt-0.5 flex items-center gap-1.5 text-[11px] text-surface/60'>
        <span className='size-1.5 rounded-full bg-up' />
        online
      </span>

      <span className='mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 font-mono text-[13px] text-surface'>
        <Wallet size={14} />
        {formatCents(balanceCents)}
      </span>
    </div>
  );
}
