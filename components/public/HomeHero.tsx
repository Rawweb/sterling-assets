'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const IMAGES = [
  '/images/hero-bg-1.jpg',
  '/images/hero-bg-4.jpg',
  '/images/hero-bg-7.jpg',
];

// Three angles of the value proposition, cycling on the second heading line.
const PHRASES = [
  'Earn daily returns.',
  'Build lasting wealth.',
  'Grow with confidence.',
];

// Lighter gradient so the image reads through more clearly.
const OVERLAY = 'linear-gradient(rgba(15,27,45,.65), rgba(15,27,45,.70))';

export default function HomeHero() {
  // ---- image cycling ----
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setImgIdx((i) => (i + 1) % IMAGES.length),
      6000, // 6 seconds per image
    );
    return () => clearInterval(id);
  }, []);

  // ---- typewriter ----
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const full = PHRASES[phraseIdx];

    // Pause at the end of a completed phrase, then start erasing.
    if (!isDeleting && displayed === full) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    }

    // When fully erased, advance to the next phrase.
    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
      return;
    }

    // Type forward at 80ms per character, erase at 40ms.
    const speed = isDeleting ? 40 : 80;
    const id = setTimeout(() => {
      setDisplayed((prev) =>
        isDeleting ? prev.slice(0, -1) : full.slice(0, prev.length + 1),
      );
    }, speed);

    return () => clearTimeout(id);
  }, [displayed, isDeleting, phraseIdx]);

  return (
    <section className='relative overflow-hidden text-center'>
      {/* ---- crossfading background images ---- */}
      {IMAGES.map((src, i) => (
        <div
          key={src}
          aria-hidden='true'
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `${OVERLAY}, url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateX(${(i - imgIdx) * 100}%)`,
            transition: 'transform 0.8s ease-in-out',
          }}
        />
      ))}

      {/* ---- content ---- */}
      <div className='relative z-10 px-5 pt-[120px] pb-[70px] lg:pt-[150px] lg:pb-[90px]'>
        <div className='max-w-[640px] mx-auto'>
          {/* Badge */}
          <div className='inline-flex items-center gap-1.5 bg-gold/15 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-[0.3px]'>
            <ShieldCheck size={13} />
            Secure investments
          </div>

          {/* Heading */}
          <h1 className='text-on-navy text-[28px] sm:text-[34px] lg:text-[44px] font-bold leading-[1.15] mb-4'>
            Invest smarter.
            <br />
            {/* translate="no" — this text rewrites itself dozens of times per
                second (typewriter effect). Google Translate watches the DOM
                for text changes and rewrites nodes it translates; the two
                fighting over the same node is what corrupts the text and
                gets Translate stuck re-triggering indefinitely. */}
            <span className='text-gold notranslate' translate='no'>
              {displayed}
              {/* Blinking cursor — always visible so the line never collapses. */}
              <span
                aria-hidden='true'
                className='animate-pulse text-on-navy/60'
              >
                |
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className='text-on-navy/70 text-sm lg:text-base leading-relaxed max-w-[480px] mx-auto mb-7'>
            Sterling Assets Holdings makes digital asset investing accessible,
            transparent, and profitable. Start with as little as $100.
          </p>

          {/* CTAs */}
          <div className='flex items-center justify-center gap-3 flex-wrap'>
            <Link
              href='/register'
              className='inline-flex items-center gap-2 bg-primary hover:bg-primary-press text-on-navy text-sm font-semibold px-[22px] py-[11px] rounded-[10px] transition-colors duration-150 no-underline active:scale-[0.97]'
            >
              Join us
            </Link>
            <Link
              href='/plans'
              className='inline-flex items-center gap-2 text-on-navy text-sm font-semibold px-[22px] py-[11px] rounded-[10px] border border-on-navy/25 hover:bg-on-navy/[0.08] transition-all duration-150 no-underline'
            >
              Start investing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
