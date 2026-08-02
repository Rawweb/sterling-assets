import Link from 'next/link';
import {
  Factory,
  Building2,
  ChevronRight,
  Home as HomeIcon,
  Phone,
  Sprout,
} from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';
import IndustryExtendedSection from '@/components/public/IndustryExtendedSection';
import type { IndustryData } from '@/lib/industry-data';

/**
 * All four industry pages share this template.
 * Layout:
 *   1. Top grid — main image + intro text (left) | sticky sidebar (right)
 *   2. IndustryExtendedSection — full-width approach + reason cards below
 */

const SECTORS = [
  { slug: 'steel', icon: Factory, title: 'Steel' },
  { slug: 'banking', icon: Building2, title: 'Banking' },
  { slug: 'real-estate', icon: HomeIcon, title: 'Real Estate' },
  { slug: 'agriculture', icon: Sprout, title: 'Agriculture' },
] as const;

const HELP_BG = [
  'linear-gradient(rgba(15,27,45,.86), rgba(15,27,45,.88))',
  'url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80)',
].join(', ');

type Props = { data: IndustryData };

export default function IndustryPageContent({ data }: Props) {
  const others = SECTORS.filter((s) => s.slug !== data.slug);

  return (
    <>
      {/* ---- top grid: image + text | sticky sidebar ---- */}
      <section className='py-[70px]'>
        <Container>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-9 items-start'>
            {/* Main content */}
            <div>
              <Reveal>
                <div
                  className='rounded-2xl overflow-hidden w-full mb-6'
                  style={{ aspectRatio: '16 / 10' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.img}
                    alt={data.title}
                    className='w-full h-full object-cover'
                  />
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h2 className='text-2xl md:text-[26px] font-bold text-navy mb-4'>
                  {data.heading}
                </h2>
                {data.body.map((para, i) => (
                  <p
                    key={i}
                    className='text-muted text-sm md:text-base leading-[1.8] mb-4 last:mb-0'
                  >
                    {para}
                  </p>
                ))}
              </Reveal>
            </div>

            {/* Sticky sidebar */}
            <aside className='flex flex-col gap-5 lg:sticky lg:top-[90px] lg:self-start'>
              <Reveal>
                <div className='bg-surface border border-line rounded-2xl p-[22px]'>
                  <h3 className='text-[17px] font-semibold text-text pb-[14px] mb-4 border-b border-line'>
                    Other Industries
                  </h3>
                  <div className='flex flex-col gap-2'>
                    {others.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link
                          key={s.slug}
                          href={`/industry/${s.slug}`}
                          className='flex items-center justify-between gap-3 bg-bg hover:bg-primary hover:text-on-navy text-text px-[14px] py-3 rounded-[9px] text-sm font-medium no-underline transition-all duration-150 active:bg-primary active:text-on-navy active:scale-[0.98]'
                        >
                          <span className='flex items-center gap-2.5'>
                            <Icon
                              size={15}
                              className='flex-shrink-0 opacity-60'
                            />
                            {s.title}
                          </span>
                          <ChevronRight
                            size={14}
                            className='flex-shrink-0 opacity-40'
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div
                  className='rounded-2xl px-[22px] py-[26px] text-center'
                  style={{
                    backgroundImage: HELP_BG,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className='w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-on-navy'>
                    <Phone size={20} />
                  </div>
                  <h3 className='text-[19px] font-semibold text-on-navy mb-2'>
                    Need any help?
                  </h3>
                  <p className='text-on-navy-muted text-sm leading-relaxed mb-5'>
                    We are here to help our customers any time.
                  </p>
                  <Link
                    href='/contact'
                    className='flex items-center justify-center bg-primary hover:bg-primary-press text-on-navy text-sm font-semibold py-3 rounded-[10px] no-underline transition-colors duration-150 active:scale-[0.97]'
                  >
                    Contact us
                  </Link>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>

      {/* ---- extended approach + reason sections ---- */}
      <IndustryExtendedSection data={data} />
    </>
  );
}
