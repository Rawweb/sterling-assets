import { Eye, Headset, Lock, TrendingUp, UserCheck } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

const FEATURES = [
  {
    icon: Lock,
    title: 'Bank-grade security',
    desc: 'Encrypted transactions, KYC verification, and cold storage protection.',
  },
  {
    icon: Eye,
    title: 'Full transparency',
    desc: 'Track every deposit, withdrawal, and profit in real time on your dashboard.',
  },
  {
    icon: TrendingUp,
    title: 'Daily returns',
    desc: 'Earn profit every day, credited directly to your account balance.',
  },
  {
    icon: Headset,
    title: '24/7 support',
    desc: 'Live chat and email support around the clock.',
  },
  {
    icon: UserCheck,
    title: 'KYC verified',
    desc: 'Every user verified for a safe, compliant investment environment.',
  },
];

/**
 * Server component.
 * bg-bg (light gray) provides visual relief after two consecutive dark sections.
 */
export default function WhatSetsUsApartSection() {
  return (
    <section className='bg-bg py-[70px]'>
      <Container>
        {/* ---- section head ---- */}
        <div className='text-center max-w-[480px] mx-auto mb-12 space-y-3'>
          <div className='inline-flex items-center gap-2.5 mb-5'>
            {/* Bar chart indicator — matches the || icon in the reference */}
            <span className='flex items-end gap-[3px]' aria-hidden='true'>
              <span className='w-[3px] h-3 bg-primary rounded-full' />
              <span className='w-[3px] h-5 bg-primary rounded-full' />
              <span className='w-[3px] h-4 bg-primary rounded-full' />
            </span>
            <p className='text-sm font-bold tracking-[0.2em] uppercase text-primary'>
              Our advantage
            </p>
          </div>
          <p className='text-xl md:text-2xl text-navy font-bold'>
            What sets Sterling Assets apart
          </p>
          <p className='text-muted text-sm md:text-base leading-relaxed'>
            Built for security, transparency, and consistent returns.
          </p>
        </div>

        {/* ---- feature cards ---- */}
        {/*
          5 cards in a 3-col grid: row 1 fills all 3, row 2 has 2 cards left-aligned.
          This is the standard grid behaviour — no special centering needed.
        */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {FEATURES.map((f, idx) => (
            <Reveal key={f.title} delay={idx * 90}>
              <div className='flex flex-col items-center text-center gap-4 bg-surface border border-line rounded-2xl p-7 h-full transition-all duration-200 hover:shadow-md hover:border-primary/20 active:shadow-md active:border-primary/20 active:scale-[0.98]'>
                {/* Icon */}
                <span className='w-[50px] h-[50px] rounded-xl bg-primary/[0.09] text-primary flex items-center justify-center flex-shrink-0'>
                  <f.icon size={20} />
                </span>

                {/* Text */}
                <div>
                  <h3 className='font-semibold text-base mb-1.5'>{f.title}</h3>
                  <p className='text-muted text-sm leading-relaxed'>{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
