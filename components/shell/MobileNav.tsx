'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

export default function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type='button'
        onClick={() => setOpen(true)}
        aria-label='Open menu'
        aria-expanded={open}
        className='grid size-8 place-items-center rounded-[10px] border border-surface/10 text-surface lg:hidden'
      >
        <Menu size={20} />
      </button>

      <div
        role='dialog'
        aria-modal='true'
        aria-label='Menu'
        className={[
          'fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg lg:hidden',
          'transition-transform duration-[300ms] ease-in-out motion-reduce:transition-none',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className='flex items-center justify-between bg-navy-900 px-4 py-3'>
          <Logo withWordmark onDark size={34} />
          <button
            type='button'
            onClick={() => setOpen(false)}
            aria-label='Close menu'
            className='grid size-8 place-items-center rounded-[10px] border border-surface/10 text-surface'
          >
            <X size={22} />
          </button>
        </div>

        <div className='flex-1'>{children}</div>
      </div>
    </>
  );
}
