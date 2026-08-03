'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, Layers, TrendingUp, Users } from 'lucide-react';
import Container from '@/components/Container';

const STATS = [
  {
    icon: TrendingUp,
    value: 12,
    prefix: '$',
    suffix: 'M+',
    label: 'Total invested',
  },
  {
    icon: Users,
    value: 5200,
    prefix: '',
    suffix: '+',
    label: 'Active investors',
  },
  {
    icon: Globe,
    value: 40,
    prefix: '',
    suffix: '+',
    label: 'Countries served',
  },
  { icon: Layers, value: 5, prefix: '', suffix: '', label: 'Investment plans' },
];

// ---- count-up sub-component ----
// Lives in the same file — no need for a separate export.
function StatCounter({
  value,
  active,
  prefix = '',
  suffix = '',
}: {
  value: number;
  active: boolean;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Respect prefers-reduced-motion — show final value instantly.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }

    const DURATION = 2000; // ms
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION, 1);
      // Ease-out cubic: fast start, gentle finish.
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  // 5200 → "5,200", 12 → "12"
  const formatted = count >= 1000 ? count.toLocaleString() : String(count);

  return (
    <span className='font-display text-3xl sm:text-4xl font-bold text-gold'>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ---- main section ----
export default function StatsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Fire the count-up once when the grid scrolls 30% into view.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className='bg-navy border-t border-white/10 py-14'>
      <Container>
        <div
          ref={gridRef}
          className='grid grid-cols-2 lg:grid-cols-4 gap-10 text-center'
        >
          {STATS.map((s) => (
            <div key={s.label} className='flex flex-col items-center gap-2'>
              <s.icon size={22} className='text-gold mb-1' />
              <StatCounter
                value={s.value}
                active={active}
                prefix={s.prefix}
                suffix={s.suffix}
              />
              <span className='text-on-navy-muted text-sm font-medium'>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
