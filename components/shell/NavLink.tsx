'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
};

export default function NavLink({ href, label, icon, exact }: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex flex-col items-center justify-center gap-2 rounded-xl px-1.5 py-4',
        'text-xs font-medium leading-tight text-center transition',
        isActive
          ? 'bg-linear-to-br from-primary to-primary-press text-surface shadow-lg shadow-primary/40'
          : 'text-muted hover:text-text hover:-translate-y-px hover:shadow-md active:text-surface active:bg-linear-to-br active:from-primary active:to-primary-press',
      ].join(' ')}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
