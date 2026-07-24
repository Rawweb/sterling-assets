'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, ChevronDown, LogOut, UserCircle, Settings } from 'lucide-react';
import { demoUser } from '@/lib/dashboard-data';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const itemClass =
    'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-text transition-colors hover:bg-bg active:bg-line/50';

  return (
    <div ref={wrapRef} className='relative'>
      <button
        ref={triggerRef}
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup='menu'
        className='flex items-center gap-2 rounded-full border border-on-navy/10 py-1.5 pl-1.5 pr-2.5 text-on-navy transition-colors hover:bg-on-navy/10  active:bg-surface/20 active:scale-[0.97]'
      >
        <span className='grid size-7 place-items-center rounded-full bg-surface text-navy-900'>
          <User size={16} />
        </span>
        <span className='hidden text-[13px] font-semibold sm:block'>
          {demoUser.fullName}
        </span>
        <ChevronDown
          size={16}
          className={`opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role='menu'
          className='absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-xl'
        >
          <Link
            role='menuitem'
            href='/dashboard/profile'
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <UserCircle size={16} className='text-muted' />
            Profile
          </Link>

          <div className='my-1.5 h-px bg-line' />

          <form action='/api/auth/logout' method='post'>
            <button
              role='menuitem'
              type='submit'
              className='flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-down transition-colors hover:bg-down/10 active:bg-down/20'
            >
              <LogOut size={16} />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
