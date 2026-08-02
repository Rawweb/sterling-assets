import CtaSection from '@/components/public/CtaSection';
import HomeHero from '@/components/public/HomeHero';
import HowItWorks from '@/components/public/HowItWorksSection';
import IndustrySectorsSection from '@/components/public/IndustrySectorsSection';
import StatsSection from '@/components/public/StatsSection';
import TestimonialsSection from '@/components/public/TestimonialSection';
import TrustedBySection from '@/components/public/TrustedBySection';
import WhatSetsUsApartSection from '@/components/public/WhatSetsUsApartSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HomeHero />

      {/* 2. How It Works */}
      <HowItWorks />

      {/* 3. Industry Sectors */}
      <IndustrySectorsSection />

      {/* 4. What Sets Us Apart */}
      <WhatSetsUsApartSection />

      {/* 5. Stats strip (dark navy, NOT a section with max-width wrapper) */}
      <StatsSection />

      {/* 6. Trusted By marquee */}
      <TrustedBySection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. CTA strip (dark navy) */}
      <CtaSection />
    </>
  );
}
