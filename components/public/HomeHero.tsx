'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <section
      style={{
        backgroundImage: `linear-gradient(rgba(15,27,45,.55), rgba(15,27,45,.70)), url("/images/hero-bg-10.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className='px-5 pt-[120px] pb-[70px] lg:px-6 lg:pt-[150px] lg:pb-[90px] text-center'
    >
      <div className='max-w-[640px] mx-auto'>
        {/* Badge */}
        <div className='inline-flex items-center gap-1.5 bg-gold/15 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-[0.3px]'>
          <ShieldCheck size={13} />
          Secure crypto investments
        </div>

        {/* Heading */}
        <h1 className='text-on-navy text-xs sm:text-[34px] lg:text-[44px] font-bold leading-[1.15] mb-4'>
          Invest smarter.
          <br />
          <span className='text-gold'>Earn daily returns.</span>
        </h1>

        {/* Subheading */}
        <p className='text-on-navy/70 text-xs sm:text-[14px] lg:text-[16px] leading-relaxed max-w-[480px] mx-auto mb-7'>
          Sterling Assets Holdings makes digital asset investing accessible,
          transparent, and profitable. Start with as little as $100.
        </p>

        {/* CTAs */}
        <div className='flex items-center justify-center gap-3 flex-wrap'>
          <Link
            href='/plans'
            className='inline-flex items-center gap-2 bg-primary hover:bg-primary-press text-on-navy font-semibold text-sm px-[22px] py-[11px] rounded-[10px] transition-colors duration-150 no-underline active:scale-[0.97]'
          >
            Start investing <ArrowRight size={16} />
          </Link>
          <Link
            href='/plans'
            className='inline-flex items-center text-on-navy text-sm font-semibold px-[22px] py-[11px] rounded-[10px] border border-on-navy/25 hover:bg-on-navy/[0.08] transition-all duration-150 no-underline'
          >
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}
