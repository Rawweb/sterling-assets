import type { Metadata } from 'next';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import Container from '@/components/Container';
import LegalTabs from '@/components/public/LegalTabs';

export const metadata: Metadata = { title: 'Legal' };

export default function LegalPage() {
  return (
    <>
      <PageHeroBanner title='Legal' crumb='Legal' />
      <section className='py-[70px]'>
        <Container>
          <LegalTabs />
        </Container>
      </section>
    </>
  );
}
