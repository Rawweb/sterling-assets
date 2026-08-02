'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Container from '@/components/Container';

const TESTIMONIALS = [
  {
    name: 'Oliver Bennett',
    role: 'Investor since 2026',
    origin: 'London, UK',
    quote:
      'Sterling made crypto investing genuinely simple. Daily returns are consistent and the dashboard gives me full visibility over every transaction.',
  },
  {
    name: 'Priya Sharma',
    role: 'Investor since 2024',
    origin: 'Mumbai, India',
    quote:
      'The KYC process was smooth and the support team responded within minutes. This is exactly what a professional investment platform should look like.',
  },
  {
    name: 'Li Wei',
    role: 'Investor since 2026',
    origin: 'Singapore',
    quote:
      'I started with the entry plan and reinvested every profit. Eighteen months later my portfolio has grown far beyond my initial target.',
  },
  {
    name: 'Kwame Mensah',
    role: 'Investor since 2023',
    origin: 'Accra, Ghana',
    quote:
      'The referral system is excellent. I introduced four colleagues and we are all earning daily returns. Sterling has changed how I think about money.',
  },
  {
    name: 'Ananya Patel',
    role: 'Investor since 2025',
    origin: 'Bangalore, India',
    quote:
      'Withdrawals are processed quickly after verification. I trust Sterling with a significant portion of my investment portfolio without any hesitation.',
  },
  {
    name: 'Kenji Tanaka',
    role: 'Investor since 2020',
    origin: 'Tokyo, Japan',
    quote:
      'The security standards here are rigorous — KYC checks, two-step verification, and a full transaction audit trail gave me the confidence to invest substantially.',
  },
];

const COUNT = TESTIMONIALS.length; // 6

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(1); // 1 on mobile, 2 on desktop
  const [animate, setAnimate] = useState(true);

  // Refs keep interval callbacks from closing over stale state.
  const curRef = useRef(0);
  const pvRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const touchX = useRef(0);

  curRef.current = current;
  pvRef.current = perView;

  // ---- detect breakpoint ----
  useEffect(() => {
    const sync = () => {
      const pv = window.innerWidth >= 768 ? 2 : 1;
      pvRef.current = pv;
      setPerView(pv);
      // Clamp position if it is now out of range after resize.
      setCurrent((c) => {
        const max = COUNT - pv;
        const capped = Math.min(c, max);
        curRef.current = capped;
        return capped;
      });
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // ---- instant snap: no CSS transition (used for wrap-around) ----
  const snapTo = useCallback((pos: number) => {
    setAnimate(false);
    setCurrent(pos);
    curRef.current = pos;
    // Two nested rAFs guarantee the browser has committed the no-transition
    // render before we re-enable the transition.
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  }, []);

  // ---- animated slide ----
  const slideTo = useCallback((pos: number) => {
    setAnimate(true);
    setCurrent(pos);
    curRef.current = pos;
  }, []);

  // ---- advance / retreat ----
  const advance = useCallback(() => {
    const max = COUNT - pvRef.current;
    const next = curRef.current + 1;
    if (next > max) snapTo(0);
    else slideTo(next);
  }, [snapTo, slideTo]);

  const retreat = useCallback(() => {
    const max = COUNT - pvRef.current;
    const prev = curRef.current - 1;
    if (prev < 0) snapTo(max);
    else slideTo(prev);
  }, [snapTo, slideTo]);

  // ---- auto-scroll (restarts whenever a manual action fires) ----
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 5000);
  }, [advance]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleNext = () => {
    advance();
    startTimer();
  };
  const handlePrev = () => {
    retreat();
    startTimer();
  };

  // perView=1 → translate by 100% per step
  // perView=2 → translate by 50% per step
  const slidePercent = 100 / perView;

  // Number of meaningful positions changes with perView.
  const dotCount = COUNT - perView + 1;

  return (
    <section className='bg-bg py-[70px]'>
      <Container>
        {/* ---- section head ---- */}
        <div className='text-center max-w-[480px] mx-auto mb-12 space-y-3'>
          <div className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 w-fit mx-auto'>
            Client testimonials
          </div>
          <p className='text-xl md:text-2xl text-navy font-bold'>
            What our investors say
          </p>
          <p className='text-muted text-sm md:text-base leading-relaxed'>
            Real feedback from investors around the world.
          </p>
        </div>

        {/* ---- carousel track ---- */}
        {/*
          overflow-hidden clips everything outside the visible window.
          Each slide is min-w-full on mobile (1 card) and min-w-[50%] on
          desktop (2 cards visible simultaneously).
          translateX shifts the flex track; the % is relative to the track
          itself, so each step is always exactly one card width.
        */}
        <div
          className='overflow-hidden'
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const diff = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
          }}
        >
          <div
            className='flex'
            style={{
              transform: `translateX(-${current * slidePercent}%)`,
              transition: animate ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className='min-w-full md:min-w-[50%] px-2 md:px-3'
              >
                {/* Dark navy card */}
                <div className='relative bg-navy border border-white/10 rounded-2xl p-8 md:p-10 overflow-hidden min-h-[300px] flex flex-col'>
                  {/* Decorative large quote mark */}
                  <span
                    aria-hidden='true'
                    className='absolute top-3 right-6 font-display text-[100px] leading-none text-white/[0.04] select-none pointer-events-none'
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className='flex gap-1 mb-5'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className='text-gold'
                        style={{ fill: 'var(--color-gold)' }}
                      />
                    ))}
                  </div>

                  {/* Quote — flex-1 so short quotes still push author to the bottom */}
                  <p className='flex-1 text-on-navy/90 text-sm md:text-base leading-relaxed italic mb-6 relative z-10'>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className='border-t border-white/10 pt-5'>
                    <p className='text-gold font-semibold text-sm'>{t.name}</p>
                    <p className='text-on-navy-muted text-xs mt-1'>
                      {t.role}&nbsp;&middot;&nbsp;{t.origin}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- navigation ---- */}
        <div className='flex items-center justify-center gap-5 mt-8'>
          <button
            onClick={handlePrev}
            aria-label='Previous testimonial'
            className='w-10 h-10 rounded-full bg-navy/10 hover:bg-navy border border-line hover:border-navy text-navy hover:text-on-navy flex items-center justify-center transition-all duration-200 active:scale-95'
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dot per position — clicking jumps directly and resets the timer */}
          <div className='flex items-center gap-2'>
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  slideTo(i);
                  startTimer();
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-navy' : 'w-2 bg-line hover:bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label='Next testimonial'
            className='w-10 h-10 rounded-full bg-navy/10 hover:bg-navy border border-line hover:border-navy text-navy hover:text-on-navy flex items-center justify-center transition-all duration-200 active:scale-95'
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
}
