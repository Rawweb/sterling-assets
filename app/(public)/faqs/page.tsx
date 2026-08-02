import type { Metadata } from 'next';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import FaqAccordion from '@/components/public/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQs',
};

export default function FaqsPage() {
  return (
    <>
      <PageHeroBanner title='Frequently Asked Questions' crumb='FAQs' />
      <FaqAccordion />
    </>
  );
}
