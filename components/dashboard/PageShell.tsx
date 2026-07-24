import type { ReactNode } from 'react';

export default function PageShell({
  title,
  heroSlot,
  children,
}: {
  title: string;
  heroSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className='mx-auto w-full max-w-shell px-4 pb-14 pt-5 sm:px-[22px] sm:pt-[26px]'>
      <section className='bg-navy-900 px-5 pb-[42px] pt-[22px] sm:px-[22px]'>
        <h1 className='text-xl font-bold text-surface sm:text-2xl'>{title}</h1>
        {heroSlot && <div className='mt-3.5'>{heroSlot}</div>}
      </section>

      <div className='relative z-10 -mt-[26px] rounded-3xl border border-line bg-surface p-4 shadow-[0_24px_50px_-26px_rgba(15,23,42,0.35)] sm:p-[22px]'>
        {children}
      </div>
    </div>
  );
}
