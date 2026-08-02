import { Star } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

const TESTIMONIALS = [
  {
    name: 'Jean Muller',
    role: 'Investor since 2024',
    quote:
      'Sterling made crypto investing simple. Daily returns are consistent and the dashboard is incredibly clear.',
  },
  {
    name: 'Emma Collins',
    role: 'Investor since 2025',
    quote:
      'The KYC process was fast and the support team responds within minutes. Professional operation.',
  },
  {
    name: 'David Osei',
    role: 'Investor since 2024',
    quote:
      'I started with the Starter plan and reinvested my profits. The transparency is what keeps me here.',
  },
];

/**
 * Server component.
 * bg-surface (white) alternates cleanly after the bg-bg WhatSetsUsApart section.
 */
export default function TestimonialsSection() {
  return (
    <section className='bg-surface py-[70px]'>
      <Container>
        {/* ---- section head ---- */}
        <div className='text-center max-w-[480px] mx-auto mb-12 space-y-3'>
          <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3'>
            Client testimonials
          </span>
          <p className='text-xl md:text-2xl text-navy font-bold'>
            What people say about us
          </p>
          <p className='text-muted text-sm md:text-base leading-relaxed'>
            Real feedback from investors around the world.
          </p>
        </div>

        {/* ---- cards ---- */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 100}>
              <div className='flex flex-col gap-4 bg-bg border border-line rounded-2xl p-7 h-full'>
                {/* Stars */}
                <div className='flex gap-1'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className='text-gold fill-gold' />
                  ))}
                </div>

                {/* Quote */}
                <p className='text-muted text-sm leading-relaxed italic flex-1'>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className='border-t border-line pt-4'>
                  <p className='font-semibold text-sm text-text'>{t.name}</p>
                  <p className='text-muted text-xs mt-0.5'>{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
