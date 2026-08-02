'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '@/lib/use-reveal';

type Props = {
  children: ReactNode;
  /** Stagger delay in milliseconds — use multiples of ~90–120ms for card grids. */
  delay?: number;
  className?: string;
};

/**
 * Wraps children in a div that fades up when it enters the viewport.
 * Uses IntersectionObserver; fires once and stays shown.
 * Server-renders as invisible so no layout shift occurs.
 */
export default function Reveal({ children, delay = 0, className = '' }: Props) {
  const [ref, shown] = useReveal();

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'none' : 'translateY(24px)',
    // Transition is always present so it fires the moment `shown` flips.
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
