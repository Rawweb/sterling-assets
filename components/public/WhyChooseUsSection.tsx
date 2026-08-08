import Image from 'next/image';
import Container from '@/components/Container';

/**
 * Server component. Dark navy background.
 * Layout on desktop: large image (left) | single tall card (center) | two stacked cards (right).
 * Below lg: all items stack vertically.
 */
export default function WhyChooseUsSection() {
  return (
    <section className='bg-navy py-20 relative overflow-hidden'>
      {/* Decorative swirl — top right, purely visual */}
      <div className='absolute top-4 right-0 opacity-20 pointer-events-none select-none animate-float'>
        <svg
          width='220'
          height='220'
          viewBox='0 0 220 220'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M185 28 C205 62, 210 128, 152 165 C98 200, 32 178, 24 128 C16 78, 62 40, 118 65 C158 85, 162 143, 118 162'
            stroke='white'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
          />
        </svg>
      </div>

      <Container>
        {/* Section header — top left */}
        <div className='mb-12'>
          <div className='inline-flex items-center gap-2.5 mb-5'>
            {/* Bar chart indicator — matches the || icon in the reference */}
            <span className='flex items-end gap-[3px]' aria-hidden='true'>
              <span className='w-[3px] h-3 bg-gold rounded-full' />
              <span className='w-[3px] h-5 bg-gold rounded-full' />
              <span className='w-[3px] h-4 bg-gold rounded-full' />
            </span>
            <p className='text-sm font-bold tracking-[0.2em] uppercase text-gold'>
              why choose us
            </p>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-on-navy max-w-[640px] leading-[1.15]'>
            Our Commitment to Value and Community
          </h2>
        </div>

        {/*
          Desktop grid: image (2fr) | card-1 (1fr) | card-2+card-3 stacked (1fr)
          Mobile: single column stack
        */}
        <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-5'>
          {/* Large image — left column */}
          <div className='relative min-h-[300px] lg:min-h-[480px] rounded-2xl overflow-hidden'>
            <Image
              src='/images/why-choose-us.jpeg'
              alt='Sterling Assets Holdings team on site'
              fill
              sizes='(max-width: 1024px) 100vw, 50vw'
              className='object-cover'
              priority
            />
          </div>

          {/* Card 1 — center column, vertically centered content */}
          <div className='bg-auth-visual border border-on-navy/10 rounded-2xl p-8 flex items-center min-h-[200px]'>
            <p className='text-on-navy text-sm leading-[1.9] text-center'>
              At Sterling Assets Holdings, we are dedicated to creating value
              that extends beyond financial returns. Through sustainable
              investments and innovative strategies, we deliver impactful
              results for our clients while supporting the development of
              industries and economies.
            </p>
          </div>

          {/* Cards 2 and 3 — right column, stacked with equal flex heights */}
          <div className='flex flex-col gap-5'>
            <div className='flex-1 bg-auth-visual border border-on-navy/10 rounded-2xl p-8 flex items-center'>
              <p className='text-on-navy text-sm leading-[1.9] text-center'>
                We empower communities by fostering job creation, improving
                living standards, and promoting responsible practices in key
                sectors such as agriculture, real estate, and renewable energy.
                Our focus on sustainability ensures we address today&apos;s
                needs while preserving resources for future generations.
              </p>
            </div>
            <div className='flex-1 bg-auth-visual border border-on-navy/10 rounded-2xl p-8 flex items-center'>
              <p className='text-on-navy text-sm leading-[1.9] text-center'>
                By aligning profitability with purpose, Sterling Assets Holdings
                is committed to building a legacy of growth, resilience, and
                meaningful impact.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
