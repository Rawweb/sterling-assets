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
          <div className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 w-fit mx-auto'>
            Our advantage
          </div>
          <p className='text-xl md:text-2xl text-navy font-bold'>
            What sets Sterling apart
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
