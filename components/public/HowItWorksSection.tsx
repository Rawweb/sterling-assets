import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

const STEPS = [
  {
    n: 1,
    title: 'Create account',
    desc: 'Sign up and verify your identity in minutes.',
  },
  {
    n: 2,
    title: 'Deposit funds',
    desc: 'Send crypto to your personal wallet address.',
  },
  {
    n: 3,
    title: 'Earn daily',
    desc: 'Choose a plan and watch your balance grow every day.',
  },
];

/**
 * Server component — Reveal handles its own client hydration internally.
 * No 'use client' needed here.
 */
export default function HowItWorksSection() {
  return (
    <section className='py-[70px]'>
      <Container>
        {/* ---- section head ---- */}
        <div className='text-center max-w-[480px] mx-auto mb-12 space-y-3'>
          <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 w-fit mx-auto'>
            How it works
          </span>
          <p className='text-xl md:text-2xl text-navy font-bold'>
            Three steps to start earning
          </p>
          <p className='text-muted text-sm md:text-base leading-relaxed'>
            No complicated setup. Create your account, deposit funds, pick a
            plan, and earn daily.
          </p>
        </div>

        {/* ---- steps row ---- */}
        <div className='flex flex-col gap-6 md:flex-row'>
          {STEPS.map((step, idx) => (
            <Fragment key={step.n}>
              {/* Arrow between steps — desktop only, hidden on mobile */}
              {idx > 0 && (
                <div className='hidden md:flex items-center justify-center flex-shrink-0 self-start pt-12 text-primary'>
                  <ChevronRight size={22} />
                </div>
              )}

              {/* Card wrapped in Reveal for scroll animation */}
              <Reveal delay={idx * 120} className='flex-1 flex'>
                <div className='flex flex-col items-center text-center gap-3 bg-bg border border-line rounded-2xl p-8 w-full transition-all duration-200 hover:shadow-md hover:border-primary/20 active:shadow-md active:scale-[0.98] active:border-primary/20'>
                  {/* Number circle */}
                  <div className='bg-primary text-on-navy font-bold rounded-full w-14 h-14 text-xl flex items-center justify-center flex-shrink-0 shadow-[0_12px_26px_-10px_rgba(79,107,246,0.6)]'>
                    {step.n}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className='font-bold text-lg mb-1'>{step.title}</h3>
                    <p className='text-muted text-sm md:text-base leading-relaxed'>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
