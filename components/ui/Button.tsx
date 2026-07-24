import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-surface hover:bg-primary-press active:bg-primary-press shadow-[0_8px_18px_-8px_rgba(79,107,246,0.7)]',
  ghost:
    'border border-line bg-surface text-text hover:border-primary hover:text-primary active:bg-bg active:border-primary',
  danger:
    'border border-line text-down hover:bg-down/10 hover:border-down/40 active:bg-down/15',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
};

type Common = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
};

function classes({
  variant = 'primary',
  size = 'md',
  block,
  className = '',
}: Common) {
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
    'transition-[transform,background-color,border-color,color] duration-150',
    'active:scale-[0.97] motion-reduce:active:scale-100',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
    VARIANTS[variant],
    SIZES[size],
    block ? 'w-full' : '',
    className,
  ].join(' ');
}

export function Button({
  type = 'button',
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { variant, size, block, className, children, ...rest } = props;
  return (
    <button
      type={type}
      className={classes({ variant, size, block, className, children })}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({ href, ...props }: Common & { href: string }) {
  const { variant, size, block, className, children } = props;
  return (
    <Link
      href={href}
      className={classes({ variant, size, block, className, children })}
    >
      {children}
    </Link>
  );
}
