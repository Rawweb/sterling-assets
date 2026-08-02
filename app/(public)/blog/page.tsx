import type { Metadata } from 'next';
import { Calendar, ExternalLink } from 'lucide-react';
import Parser from 'rss-parser';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import Container from '@/components/Container';

export const metadata: Metadata = { title: 'Blog' };

/**
 * Revalidate every hour so the feed refreshes without a full redeploy.
 * Next.js caches the rendered HTML and regenerates it in the background
 * after 3600s. This keeps the blog fast while staying current.
 */
export const revalidate = 3600;

// ---- types ----

type CustomItem = {
  mediaContent?: { $: { url: string } };
};

// ---- constants ----

/**
 * CoinTelegraph's RSS is the most reliable free crypto/finance feed.
 * Alternatives if this one goes down:
 *   https://coindesk.com/arc/outboundfeeds/rss/
 *   https://decrypt.co/feed
 *   https://cryptonews.com/news/feed/
 */
const FEED_URL = 'https://cointelegraph.com/rss';
const ARTICLE_MAX = 10;
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=80';

// ---- helpers ----

const parser = new Parser<Record<string, never>, CustomItem>({
  customFields: {
    item: [['media:content', 'mediaContent']],
  },
});

async function getArticles() {
  try {
    const feed = await parser.parseURL(FEED_URL);
    return feed.items.slice(0, ARTICLE_MAX).map((item) => ({
      title: item.title ?? 'Untitled',
      link: item.link ?? '#',
      pubDate: item.pubDate ?? '',
      snippet: (item.contentSnippet ?? '').slice(0, 200),
      img: item.mediaContent?.$.url ?? item.enclosure?.url ?? FALLBACK_IMG,
    }));
  } catch (err) {
    // Feed fetch failed — return empty so the page still renders.
    console.error('[Blog] RSS fetch failed:', err);
    return [];
  }
}

function formatDate(dateStr: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en-GB', { month: 'long' }),
  };
}

// ---- page ----

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHeroBanner title='Latest News' crumb='Blog' />

      <section className='py-[70px]'>
        <Container>
          {/* Section head */}
          <div className='text-center mb-10'>
            <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 inline-block mb-4'>
              Our Blog
            </span>
            <h2 className='text-2xl md:text-3xl font-bold text-navy'>
              Latest Market News
            </h2>
            <p className='text-muted text-sm mt-3'>
              Curated financial and investment news, updated hourly.
            </p>
          </div>

          {/* Empty state */}
          {articles.length === 0 && (
            <div className='text-center py-24 text-muted'>
              <p className='text-base'>
                News feed temporarily unavailable. Please check back shortly.
              </p>
            </div>
          )}

          {/* Article list */}
          {articles.length > 0 && (
            <div className='border-t border-line'>
              {articles.map((article) => {
                const date = formatDate(article.pubDate);
                return (
                  <article
                    key={article.link}
                    className='group border-b border-line py-10'
                  >
                    <div className='flex flex-col md:flex-row md:items-start'>
                      {/* Image — links to source */}
                      <a
                        href={article.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='relative block overflow-hidden rounded-xl flex-shrink-0
                                   w-full md:w-[280px] mb-5 md:mb-0'
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.img}
                          alt={article.title}
                          className='w-full aspect-[4/3] object-cover'
                        />
                        {/* Hover overlay */}
                        <div
                          className='absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100
                                     transition-opacity duration-300 flex items-center justify-center
                                     rounded-xl'
                        >
                          <span className='text-on-navy text-sm font-semibold tracking-wide'>
                            Read More
                          </span>
                        </div>
                      </a>

                      {/* Vertical separator */}
                      <div className='hidden md:block w-px bg-line self-stretch mx-7 flex-shrink-0' />

                      {/* Date column */}
                      <div
                        className='flex md:flex-col items-center gap-2 md:gap-0
                                   md:w-[72px] md:flex-shrink-0 md:pt-1 mb-4 md:mb-0'
                      >
                        <Calendar
                          size={20}
                          className='text-gold flex-shrink-0'
                        />
                        <div className='flex md:flex-col items-baseline md:items-center gap-1.5 md:gap-0'>
                          <span className='text-[26px] font-bold text-navy leading-none md:mt-1'>
                            {date.day}
                          </span>
                          <span className='text-sm text-muted md:mt-1'>
                            {date.month}
                          </span>
                        </div>
                      </div>

                      {/* Vertical separator */}
                      <div className='hidden md:block w-px bg-line self-stretch mx-7 flex-shrink-0' />

                      {/* Content */}
                      <div className='flex-1'>
                        <a
                          href={article.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='no-underline block'
                        >
                          <h3
                            className='font-bold text-navy group-hover:text-gold
                                       transition-colors duration-200
                                       text-base md:text-lg leading-snug mb-3'
                          >
                            {article.title}
                          </h3>
                        </a>

                        {article.snippet && (
                          <p className='text-muted text-sm leading-relaxed mb-4'>
                            {article.snippet}
                            {article.snippet.length === 200 ? '...' : ''}
                          </p>
                        )}

                        <a
                          href={article.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1.5 text-primary text-xs font-semibold
                                     no-underline hover:text-primary-press transition-colors duration-150'
                        >
                          Read full article <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
