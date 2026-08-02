import { Globe, Layers, TrendingUp, Users } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

const STATS = [
  { icon: TrendingUp, num: '$12M+', label: 'Total invested' },
  { icon: Users, num: '5,200+', label: 'Active investors' },
  { icon: Globe, num: '40+', label: 'Countries served' },
  { icon: Layers, num: '6', label: 'Investment plans' },
];

/**
 * Server component.
 * border-t separates this visually from the dark IndustrySectors above it.
 */
export default function StatsSection() {
  return (
    <section className='bg-navy border-t border-white/10 py-14'>
      <Container>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-10 text-center'>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 90}>
              <div className='flex flex-col items-center gap-2'>
                <s.icon size={22} className='text-gold mb-1' />
                <span className='font-display text-3xl sm:text-4xl font-bold text-gold'>
                  {s.num}
                </span>
                <span className='text-on-navy-muted text-sm font-medium'>
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
