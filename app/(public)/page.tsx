import HomeHero from '@/components/public/HomeHero';
import HowItWorks from '@/components/public/HowItWorksSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HomeHero />

      {/* 2. How It Works */}
      <HowItWorks />

      {/* 3. Industry Sectors */}
      <section>...</section>

      {/* 4. Stats strip (dark navy, NOT a section with max-width wrapper) */}
      <div>...</div>

      {/* 5. What Sets Us Apart */}
      <section>...</section>

      {/* 6. Trusted By marquee */}
      <div>...</div>

      {/* 7. Testimonials */}
      <section>...</section>

      {/* 8. CTA strip (dark navy) */}
      <section>...</section>
    </>
  );
}
