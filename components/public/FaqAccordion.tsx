'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import Container from '@/components/Container';

const FAQS = [
  {
    q: 'What does Sterling Assets Holdings specialise in?',
    a: 'Sterling Assets Holdings specialises in digital asset investments across steel, banking, real estate, and agriculture sectors, providing tailored solutions to help investors grow and protect their wealth with consistent daily returns.',
  },
  {
    q: 'When was Sterling Assets Holdings founded?',
    a: 'Sterling Assets Holdings was founded with a clear mission: to make digital asset investing accessible, transparent, and profitable for investors worldwide, regardless of their background or starting capital.',
  },
  {
    q: 'Where is Sterling Assets Holdings based?',
    a: 'We are headquartered in Luxembourg, operating globally to provide investment solutions and daily returns for investors across more than 40 countries.',
  },
  {
    q: 'How does Sterling Assets Holdings ensure sustainable investments?',
    a: 'We prioritise eco-friendly investment sectors, sustainable agriculture, responsible real estate development, and socially responsible practices, ensuring long-term environmental and economic sustainability in every investment decision.',
  },
  {
    q: 'Who can invest with Sterling Assets Holdings?',
    a: 'Sterling Assets Holdings is open to individual investors, entrepreneurs, and organisations seeking transparent investment solutions. Our plans start from as little as $100, making quality investment accessible to everyone.',
  },
  {
    q: 'What industries does Sterling Assets Holdings invest in?',
    a: 'Our key focus sectors include steel, banking, real estate, and agriculture, four high-growth industries selected for their stability, growth potential, and alignment with global economic trends.',
  },
  {
    q: 'What makes Sterling Assets Holdings different from other investment firms?',
    a: 'Our unique approach combines rigorous security standards, full portfolio transparency, daily profit crediting, and a diversified multi-sector strategy, delivering consistent returns with a user experience built around simplicity and trust.',
  },
  {
    q: 'How can I get started with Sterling Assets Holdings?',
    a: 'Getting started is straightforward. Create a free account, complete the KYC verification process, deposit steel to your personal wallet address, choose an investment plan, and start earning daily returns from day one.',
  },
  {
    q: 'Does Sterling Assets Holdings offer opportunities for small investors?',
    a: 'Yes. We provide investment plans starting from $100 and offer full access to our platform regardless of your starting capital. Our goal is to make professional-grade investing accessible to everyone.',
  },
  {
    q: 'How does Sterling Assets Holdings support local communities?',
    a: 'Sterling Assets Holdings actively contributes to community development through investments in sustainable agriculture, affordable housing projects, and job creation initiatives, fostering economic and social growth in the regions where we operate.',
  },
];

/**
 * Client component — manages the open/close accordion state.
 * Starts with the first item open (matching the prototype).
 * Clicking an open item closes it; clicking a different item opens it.
 */
export default function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <section className='py-[70px]'>
      <Container>
        <div className='max-w-[760px] mx-auto'>
          {/* ---- accordion ---- */}
          <div className='space-y-3'>
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`border rounded-xl overflow-hidden transition-colors duration-150 ${
                    isOpen ? 'border-primary' : 'border-line'
                  }`}
                >
                  {/* Question row */}
                  <button
                    type='button'
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`w-full flex items-center justify-between gap-4 px-5 py-[18px] text-[15px] font-semibold text-left transition-colors duration-150 ${
                      isOpen ? 'text-primary' : 'text-text'
                    }`}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <Minus size={18} className='flex-shrink-0' />
                    ) : (
                      <Plus size={18} className='flex-shrink-0' />
                    )}
                  </button>

                  {/* Answer — only rendered when open */}
                  {isOpen && (
                    <div className='px-5 pb-[18px] text-sm text-muted leading-[1.7]'>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ---- CTA card ---- */}
          <div className='bg-navy rounded-2xl p-8 text-center mt-8'>
            <p className='text-on-navy font-semibold text-[17px] mb-4'>
              Still have questions?
            </p>
            <Link
              href='/contact'
              className='inline-flex items-center gap-2 bg-primary hover:bg-primary-press text-on-navy text-sm font-semibold px-6 py-3 rounded-[10px] no-underline transition-colors duration-150 active:scale-[0.97]'
            >
              Contact our support <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
