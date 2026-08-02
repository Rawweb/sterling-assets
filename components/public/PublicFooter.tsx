import Link from 'next/link';
import {  Icon, Mail } from 'lucide-react';

import Logo from '@/components/Logo';

const QUICK_LINKS = [
  { label: 'About Company', href: '/about' },
  { label: 'Investment Plans', href: '/plans' },
  { label: 'Terms & Conditions', href: '/legal' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
];

const SOCIALS = [
  { label: 'f', title: 'Facebook', href: '#' },
  { label: 'in', title: 'LinkedIn', href: '#' },
  { label: 'X', title: 'Twitter / X', href: '#' },
  { label: 'ig', title: 'Instagram', href: '#' },
] as const;

/**
 * Public-site footer — server component (no interactivity needed).
 * Update SOCIALS hrefs when real accounts are created.
 */
export default function PublicFooter() {
  return (
    <footer className='bg-navy'>
      <div className='max-w-shell mx-auto px-6 pt-14 pb-6'>
        {/* ---- three-column grid — stacks on mobile ---- */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mb-9'>
          {/* Col 1: Brand */}
          <div>
            <Logo withWordmark onDark size={36} />
            <p className='mt-3.5 text-[13px] leading-[1.7] text-white/45'>
              A trusted crypto investment platform making digital asset
              investing accessible, transparent, and profitable.
            </p>
            <div className='flex gap-2 mt-4'>
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='w-[34px] h-[34px] rounded-[8px] bg-white/[0.07] hover:bg-primary grid place-items-center text-white/60 hover:text-white transition-colors duration-150'
                >
                    <span className='text-[14px] font-semibold'>{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className='text-white text-[14px] font-semibold mb-4'>
              Quick Links
            </h4>
            <ul className='space-y-0'>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='block text-white/45 hover:text-white text-[13px] py-[5px] no-underline transition-colors duration-150'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Official Info */}
          <div>
            <h4 className='text-white text-[14px] font-semibold mb-4'>
              Official Info
            </h4>
            <p className='text-white/45 text-[13px] leading-[1.8]'>
              14 Av. du Rock&apos;n&apos;Roll 4361
              <br />
              Esch-Belval Esch-sur-Alzette,
              <br />
              Luxembourg
            </p>
            <div className='inline-flex items-center gap-2 bg-primary/[0.14] text-white text-[12.5px] px-[14px] py-[9px] rounded-[9px] mt-3.5'>
              <Mail size={14} className='text-primary shrink-0' />
              <span>support@sterlingassetsholdings.com</span>
            </div>
          </div>
        </div>

        {/* ---- bottom bar ---- */}
        <div className='border-t border-white/[0.07] pt-[22px] text-center text-[12px] text-white/35'>
          &copy; {new Date().getFullYear()} Sterling Assets Holdings. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
