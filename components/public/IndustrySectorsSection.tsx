import Link from 'next/link';
import {
  Bitcoin,
  Building2,
  ChevronRight,
  Home as HomeIcon,
  Sprout,
} from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

const SECTORS = [
  {
    slug: 'crypto',
    icon: Bitcoin,
    title: 'Cryptocurrency',
    desc: 'Blockchain and digital asset investments driving the future of finance.',
  },
  {
    slug: 'banking',
    icon: Building2,
    title: 'Banking',
    desc: 'Strategic partnerships with financial institutions for stable growth.',
  },
  {
    slug: 'real-estate',
    icon: HomeIcon,
    title: 'Real Estate',
    desc: 'High-value property investments in emerging and established markets.',
  },
  {
    slug: 'agriculture',
    icon: Sprout,
    title: 'Agriculture',
    desc: 'Sustainable farming and supply chain investments for long-term value.',
  },
];

/**
 * Server component — dark navy background, alternates visually against
 * the lighter sections above and below it.
 */
export default function IndustrySectorsSection() {
  return (
    <section className='bg-navy py-[70px]'>
      <Container>
        {/* ---- section head ---- */}
        <div className='text-center max-w-[480px] mx-auto mb-12 space-y-3'>
          <span className='bg-gold/15 text-gold text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 border-gold'>
            Our sectors
          </span>
          <p className='text-xl md:text-2xl text-on-navy font-bold'>
            Where your money works
          </p>
          <p className='text-on-navy-muted text-sm md:text-base leading-relaxed'>
            We invest across four high-growth sectors to diversify risk and
            maximise returns.
          </p>
        </div>

        {/* ---- grid ---- */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {SECTORS.map((sector, idx) => (
            <Reveal key={sector.slug} delay={idx * 100}>
              <Link
                href={`/industry/${sector.slug}`}
                className='flex flex-col items-center text-center gap-4 bg-on-navy/[0.06] border border-on-navy/10 rounded-2xl p-7 no-underline transition-all duration-200 hover:bg-on-navy/[0.11] hover:border-primary/40 hover:shadow-[0_8px_30px_-10px_rgba(79,107,246,0.35)] active:bg-on-navy/[0.11] active:border-primary/40 active:scale-[0.98]'
              >
                {/* Icon container */}
                <span className='w-14 h-14 rounded-[14px] bg-primary/20 text-primary flex items-center justify-center flex-shrink-0'>
                  <sector.icon size={22} />
                </span>

                {/* Text */}
                <div className='flex flex-col gap-2 flex-1'>
                  <h3 className='text-on-navy font-semibold text-base'>
                    {sector.title}
                  </h3>
                  <p className='text-on-navy-muted text-sm leading-relaxed flex-1'>
                    {sector.desc}
                  </p>
                </div>

                {/* Learn more — decorative, whole card is the link */}
                <span className='inline-flex items-center gap-1 text-primary text-sm font-semibold mt-1'>
                  Learn more <ChevronRight size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
