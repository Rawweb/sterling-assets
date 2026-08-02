import type { Metadata } from 'next';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import AboutCompanySection from '@/components/public/AboutCompanySection';
import VisionMissionSection from '@/components/public/VisionMissionSection';
import WhatSetsUsApartSection from '@/components/public/WhatSetsUsApartSection';

export const metadata: Metadata = {
  title: 'About Us',
};

/**
 * Section order:
 * 1. Hero banner (same dark-overlay banner as all inner pages)
 * 2. Company intro — image + text + credential downloads
 * 3. Vision & Mission — joined two-card block
 * 4. What Sets Us Apart — reused from home page
 */
export default function AboutPage() {
  return (
    <>
      <PageHeroBanner title='About Us' crumb='About' />
      <AboutCompanySection />
      <VisionMissionSection />
      <WhatSetsUsApartSection />
    </>
  );
}
