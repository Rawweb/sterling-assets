import { Eye, TrendingUp } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

/**
 * Server component.
 * The two cards are joined by wrapping them in overflow-hidden rounded-2xl.
 * The container clips both cards to the same border-radius so they read
 * as one unit. The natural color boundary (surface → navy) acts as the
 * visual divider — no extra border element needed.
 * On mobile the cards stack vertically (flex-col).
 */
export default function VisionMissionSection() {
  return (
    <section className='py-[70px] bg-bg'>
      <Container>
        {/* ---- section head ---- */}
        <div className='text-center max-w-[480px] mx-auto mb-12 space-y-3'>
          <div className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 w-fit mx-auto'>
            Our principles
          </div>
          <p className='text-xl md:text-2xl text-navy font-bold'>
            Vision &amp; Mission
          </p>
        </div>

        {/* ---- joined cards ---- */}
        <Reveal>
          <div className='rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm'>
            {/* Vision — white card */}
            <div className='flex-1 bg-surface px-10 py-12 flex flex-col gap-6 border-b border-line md:border-b-0'>
              {/* Icon */}
              <div className='w-14 h-14 rounded-xl bg-primary/[0.09] text-primary flex items-center justify-center flex-shrink-0'>
                <Eye size={24} />
              </div>

              {/* Badge */}
              <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 self-start'>
                Our Vision
              </span>

              {/* Heading */}
              <h3 className='text-xl font-bold text-navy -mt-3'>
                A future built on access and innovation
              </h3>

              {/* Body */}
              <p className='text-muted text-sm md:text-base leading-relaxed'>
                To shape a prosperous financial future by making digital asset
                investing accessible to everyone, fostering innovation, and
                creating enduring value for investors and communities worldwide.
              </p>
            </div>

            {/* Mission — navy card */}
            <div className='flex-1 bg-navy px-10 py-12 flex flex-col gap-6'>
              {/* Icon */}
              <div className='w-14 h-14 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0'>
                <TrendingUp size={24} />
              </div>

              {/* Badge */}
              <span className='bg-gold/15 text-gold text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 border-gold self-start'>
                Our Mission
              </span>

              {/* Heading */}
              <h3 className='text-xl font-bold text-on-navy -mt-3'>
                Transparent solutions for real-world growth
              </h3>

              {/* Body */}
              <p className='text-on-navy-muted text-sm md:text-base leading-relaxed'>
                To deliver impactful, transparent investment solutions that
                drive growth across key sectors, while championing security and
                aligning financial achievement with long-term positive change.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
