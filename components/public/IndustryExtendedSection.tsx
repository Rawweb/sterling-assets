import { Check } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';
import type { IndustryData } from '@/lib/industry-data';

type Props = { data: IndustryData };

/**
 * Server component.
 * Renders two full-width sections below the main image + sidebar grid:
 *   1. Investment approaches — numbered cards in a 2-col grid
 *   2. Strategic reasons — check-accented cards in a 3-col grid
 * Full width so the content has room to breathe after the constrained sidebar layout.
 */
export default function IndustryExtendedSection({ data }: Props) {
  return (
    <>
      {/* ---- investment approaches ---- */}
      <section className='bg-bg py-[70px]'>
        <Container>
          {/* Section head */}
          <div className='mb-12 space-y-3'>
            <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3'>
              How we invest
            </span>
            <h2 className='text-xl md:text-2xl font-bold text-navy mt-3'>
              {data.approachTitle}
            </h2>
          </div>

          {/* Approach cards — 2 col on desktop */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {data.approaches.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 80}>
                <div className='flex gap-4 bg-surface border border-line rounded-2xl p-6 h-full hover:shadow-sm hover:border-primary/20 transition-all duration-200'>
                  {/* Number badge */}
                  <div className='w-8 h-8 rounded-lg bg-navy text-on-navy text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5'>
                    {idx + 1}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className='font-semibold text-text text-sm md:text-base mb-2'>
                      {item.title}
                    </h3>
                    <p className='text-muted text-sm leading-relaxed'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- strategic reasons ---- */}
      <section className='bg-surface py-[70px]'>
        <Container>
          {/* Section head */}
          <div className='mb-12 space-y-3'>
            <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3'>
              Strategic focus
            </span>
            <h2 className='text-xl md:text-2xl font-bold text-navy mt-3'>
              {data.reasonsTitle}
            </h2>
          </div>

          {/* Reason cards — 3 col on desktop, 2 on tablet */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {data.reasons.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 70}>
                <div className='flex flex-col gap-3 bg-bg border border-line rounded-2xl p-6 h-full hover:shadow-sm hover:border-primary/20 transition-all duration-200'>
                  {/* Check icon */}
                  <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
                    <Check size={16} className='text-primary' />
                  </div>

                  {/* Text */}
                  <h3 className='font-semibold text-text text-sm md:text-base'>
                    {item.title}
                  </h3>
                  <p className='text-muted text-sm leading-relaxed flex-1'>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Optional closing paragraph */}
          {data.closing && (
            <Reveal>
              <p className='text-muted text-sm md:text-base leading-relaxed mt-10 max-w-3xl'>
                {data.closing}
              </p>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
