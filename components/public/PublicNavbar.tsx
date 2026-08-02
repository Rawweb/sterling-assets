'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

// ---------- static data ----------

const SECTORS = [
  { label: 'Cryptocurrency', slug: 'crypto' },
  { label: 'Banking', slug: 'banking' },
  { label: 'Real Estate', slug: 'real-estate' },
  { label: 'Agriculture', slug: 'agriculture' },
] as const;

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  // Industries is handled separately (dropdown).
  { label: 'Investment Plans', href: '/plans' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

// ---------- types ----------

type Props = {
  /** True when a verified session exists — used to swap Login/Register for Dashboard. */
  isAuthenticated: boolean;
  userRole?: 'USER' | 'ADMIN';
};

// ---------- component ----------

export default function PublicNavbar({ isAuthenticated, userRole }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropOpen, setDesktopDropOpen] = useState(false);
  const [mobileIndustryOpen, setMobileIndustryOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Transparent only when on the home page AND at the very top.
  const isHome = pathname === '/';
  const onHero = isHome && !scrolled;

  const dashHref = userRole === 'ADMIN' ? '/admin' : '/dashboard';

  // ---- scroll listener ----
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ---- close mobile nav on route change ----
  useEffect(() => {
    setMobileOpen(false);
    setMobileIndustryOpen(false);
  }, [pathname]);

  // ---- lock body scroll while drawer is open ----
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // ---- helpers ----
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isIndustryActive = SECTORS.some(
    (s) => pathname === `/industry/${s.slug}`,
  );

  // ---- shared link styles ----
  const linkBase =
    'text-[13px] font-medium px-[10px] py-2 rounded-lg transition-colors duration-150 no-underline';
  const linkIdle = 'text-white/70 hover:text-white';
  const linkOn = 'text-white';

  return (
    <>
      {/* ============ HEADER ============ */}
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          onHero
            ? 'bg-transparent'
            : 'bg-navy shadow-[0_2px_20px_-8px_rgba(0,0,0,0.4)]',
        ].join(' ')}
      >
        <div className='max-w-shell mx-auto px-6 py-[14px] flex items-center justify-between gap-5'>
          {/* Logo */}
          <Link href='/' className='inline-flex shrink-0'>
            <Logo withWordmark onDark size={36} />
          </Link>

          {/* ---- desktop nav ---- */}
          <nav className='hidden lg:flex items-center gap-1'>
            {/* Home */}
            <Link
              href='/'
              className={`${linkBase} ${isActive('/') ? linkOn : linkIdle}`}
            >
              Home
            </Link>

            {/* About */}
            <Link
              href='/about'
              className={`${linkBase} ${isActive('/about') ? linkOn : linkIdle}`}
            >
              About
            </Link>

            {/* Industries dropdown */}
            <div
              ref={dropRef}
              className='relative'
              onMouseEnter={() => setDesktopDropOpen(true)}
              onMouseLeave={() => setDesktopDropOpen(false)}
            >
              <button
                className={`${linkBase} ${isIndustryActive ? linkOn : linkIdle} inline-flex items-center gap-[3px]`}
                aria-expanded={desktopDropOpen}
                aria-haspopup='true'
              >
                Industries
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${desktopDropOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {desktopDropOpen && (
                <div className='absolute top-full left-0 mt-1 bg-white rounded-xl shadow-[0_12px_34px_-10px_rgba(0,0,0,0.25)] p-2 min-w-[180px] flex flex-col gap-0.5 z-50'>
                  {SECTORS.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/industry/${s.slug}`}
                      className='px-3 py-[9px] rounded-lg text-[13px] text-text no-underline hover:bg-bg hover:text-primary transition-colors duration-150'
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining links */}
            {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkBase} ${isActive(link.href) ? linkOn : linkIdle}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ---- right side ---- */}
          <div className='flex items-center gap-2.5'>
            {isAuthenticated ? (
              <Link
                href={dashHref}
                className='hidden lg:inline-flex items-center gap-2 bg-primary hover:bg-primary-press text-white text-[13px] font-semibold px-[18px] py-[9px] rounded-[10px] transition-colors duration-150 no-underline'
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href='/login'
                  className='hidden lg:block text-white/80 hover:text-white text-[13px] font-semibold px-3 py-2 transition-colors duration-150 no-underline'
                >
                  Login
                </Link>
                <Link
                  href='/register'
                  className='hidden lg:inline-flex items-center bg-primary hover:bg-primary-press text-white text-[13px] font-semibold px-[18px] py-[9px] rounded-[10px] transition-colors duration-150 no-underline'
                >
                  Get started
                </Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className='lg:hidden p-1 text-white'
              onClick={() => setMobileOpen(true)}
              aria-label='Open navigation'
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE DRAWER OVERLAY ============ */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-[100] bg-navy/50'
          onClick={() => setMobileOpen(false)}
        >
          {/* Drawer panel */}
          <div
            className='absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white flex flex-col'
            style={{ animation: 'slideInRight 0.25s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className='bg-navy px-5 py-[18px] flex items-center justify-between shrink-0'>
              <Logo withWordmark onDark size={32} />
              <button
                className='w-8 h-8 rounded-full bg-white/10 grid place-items-center text-white'
                onClick={() => setMobileOpen(false)}
                aria-label='Close navigation'
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer links */}
            <nav className='flex-1 overflow-y-auto'>
              {/* Home */}
              <Link
                href='/'
                className='flex items-center justify-between w-full px-5 py-[14px] text-[14px] font-medium text-text border-b border-line no-underline hover:bg-bg'
              >
                Home
              </Link>

              {/* About */}
              <Link
                href='/about'
                className='flex items-center justify-between w-full px-5 py-[14px] text-[14px] font-medium text-text border-b border-line no-underline hover:bg-bg'
              >
                About
              </Link>

              {/* Industries — expandable */}
              <div>
                <button
                  className='flex items-center justify-between w-full px-5 py-[14px] text-[14px] font-semibold text-text border-b border-line hover:bg-bg'
                  onClick={() => setMobileIndustryOpen((o) => !o)}
                  aria-expanded={mobileIndustryOpen}
                >
                  Industries
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileIndustryOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileIndustryOpen &&
                  SECTORS.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/industry/${s.slug}`}
                      className='flex items-center gap-2 pl-9 pr-5 py-[13px] text-[13px] text-muted font-normal border-b border-line no-underline hover:bg-bg'
                    >
                      <ChevronRight size={13} className='shrink-0 text-muted' />
                      {s.label}
                    </Link>
                  ))}
              </div>

              {/* Remaining links */}
              {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='flex items-center justify-between w-full px-5 py-[14px] text-[14px] font-medium text-text border-b border-line no-underline hover:bg-bg'
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Drawer auth buttons */}
            <div className='p-5 flex flex-col gap-2.5 shrink-0 border-t border-line'>
              {isAuthenticated ? (
                <Link
                  href={dashHref}
                  className='flex items-center justify-center bg-primary hover:bg-primary-press text-white font-semibold text-[14px] py-3 rounded-[10px] no-underline transition-colors'
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href='/login'
                    className='flex items-center justify-center bg-bg hover:bg-line text-text font-semibold text-[14px] py-3 rounded-[10px] no-underline transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className='flex items-center justify-center bg-primary hover:bg-primary-press text-white font-semibold text-[14px] py-3 rounded-[10px] no-underline transition-colors'
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-in keyframe — scoped to avoid globals. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: none; }
        }
      `,
        }}
      />
    </>
  );
}
