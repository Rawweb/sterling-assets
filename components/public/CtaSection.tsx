import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

/**
 * Server component.
 * Closes the home page. Dark navy matches the hero and sectors, bookending
 * the page with the same colour.
 */
export default function CtaSection() {
  return (
    <section className='bg-navy py-[70px] text-center border-b border-white/[0.07] '>
      <Container>
        <Reveal>
          <div className='max-w-[560px] mx-auto space-y-5'>
            <h2 className='text-on-navy text-2xl md:text-3xl font-bold'>
              Ready to grow your portfolio?
            </h2>

            <p className='text-on-navy-muted text-sm md:text-base leading-relaxed'>
              Join thousands of investors earning daily returns with Sterling
              Assets Holdings.
            </p>

            <Link
              href='/register'
              className='inline-flex items-center gap-2 bg-primary hover:bg-primary-press text-on-navy text-sm font-semibold px-6 py-3 rounded-[10px] no-underline transition-colors duration-150 active:scale-[0.97]'
            >
              Create free account <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
