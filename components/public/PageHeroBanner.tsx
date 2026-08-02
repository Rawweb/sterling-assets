import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Props = {
  /** The large heading shown in the banner. */
  title: string;
  /** Breadcrumb label for this page (shown after "Home >"). */
  crumb: string;
};

/**
 * Dark-overlay hero banner used on every inner public page.
 * Replace BANNER_URL with a real CDN image before launch.
 *
 * The 140px top padding accounts for the fixed navbar height (64px) plus
 * breathing room. The 70px bottom padding gives visual weight below the text.
 */
const BANNER_URL = '/images/page-hero-banner.jpg';

export default function PageHeroBanner({ title, crumb }: Props) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(15,27,45,0.82), rgba(15,27,45,0.82)), url(${BANNER_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '140px 24px 70px',
        textAlign: 'center',
      }}
    >
      {/* Heading */}
      <h1
        style={{
          color: '#fff',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 700,
          marginBottom: 12,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>

      {/* Breadcrumb */}
      <div className='inline-flex items-center gap-2 text-white/60 text-[14px]'>
        <Link
          href='/'
          className='text-white/60 hover:text-white no-underline transition-colors duration-150'
        >
          Home
        </Link>
        <ChevronRight size={14} className='shrink-0' />
        <b className='text-gold font-semibold'>{crumb}</b>
      </div>
    </div>
  );
}
