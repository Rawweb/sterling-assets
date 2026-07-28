import { ShieldCheck } from 'lucide-react';

export default function AdminProfileCard({ fullName }: { fullName: string }) {
  return (
    <div className='flex flex-col items-center rounded-2xl bg-navy-900 px-3 py-4 text-center'>
      <div className='grid size-16 place-items-center rounded-full bg-surface text-navy-900'>
        <ShieldCheck size={30} />
      </div>

      <p className='mt-2.5 text-sm font-semibold text-surface'>{fullName}</p>

      <span className='mt-0.5 flex items-center gap-1.5 text-[11px] text-surface/60'>
        <span className='size-1.5 rounded-full bg-up' />
        Admin
      </span>

      <span className='mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 text-[12px] font-semibold text-surface'>
        Admin Console
      </span>
    </div>
  );
}
