import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import IndustryPageContent from '@/components/public/IndustryPageContent';
import {
  INDUSTRY_DATA,
  VALID_SLUGS,
  type IndustryData,
  type IndustrySlug,
} from '@/lib/industry-data';

type Params = { params: Promise<{ slug: string }> };

/**
 * Pre-renders all four industry pages at build time.
 * Any slug not in VALID_SLUGS returns a 404.
 */
export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = INDUSTRY_DATA[slug as IndustrySlug] as IndustryData | undefined;
  if (!data) return {};
  return { title: data.title };
}

export default async function IndustryPage({ params }: Params) {
  const { slug } = await params;
  const data = INDUSTRY_DATA[slug as IndustrySlug] as IndustryData | undefined;

  if (!data) notFound();

  return (
    <>
      <PageHeroBanner title={data.title} crumb={data.title} />
      <IndustryPageContent data={data} />
    </>
  );
}
