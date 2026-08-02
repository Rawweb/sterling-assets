'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function UserMenu({
  fullName,
  profileHref,
  avatarUrl,
}: {
  fullName: string;
  profileHref?: string;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter()
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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    router.replace('/login');
  }

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
        className='flex items-center gap-2 rounded-full border border-on-navy/10 py-1.5 pl-1.5 pr-2.5 text-on-navy transition-colors hover:bg-on-navy/10 active:bg-surface/20 active:scale-[0.97]'
      >
        <span className='size-7 overflow-hidden rounded-full bg-surface text-navy-900'>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={fullName}
              className='size-7 rounded-full object-cover'
            />
          ) : (
            <span className='grid size-7 place-items-center'>
              <User size={16} />
            </span>
          )}
        </span>
        <span className='hidden text-[13px] font-semibold sm:block'>
          {fullName}
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
          {profileHref && (
            <>
              <Link
                role='menuitem'
                href={profileHref}
                onClick={() => setOpen(false)}
                className={itemClass}
              >
                <UserCircle size={16} className='text-muted' />
                Profile
              </Link>
              <div className='my-1.5 h-px bg-line' />
            </>
          )}

          <button
            role='menuitem'
            type='button'
            onClick={handleLogout}
            className='flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-down transition-colors hover:bg-down/10 active:bg-down/20'
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
