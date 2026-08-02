import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getViewer } from '@/lib/viewer';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

export const metadata: Metadata = { title: 'Investment Plans' };

function formatUSD(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US');
}

/**
 * Server component — fetches live plans from the database.
 * Also reads the session so the "Invest now" button links to the right
 * destination: dashboard for authenticated users, register for guests.
 * Both fetches run in parallel via Promise.all.
 */
export default async function PlansPage() {
  const [plans, viewer] = await Promise.all([
    prisma.plan.findMany({
      where: { active: true },
      orderBy: { minCents: 'asc' },
    }),
    getViewer(),
  ]);

  // Authenticated users land on their dashboard plans page.
  // Guests are sent to register first.
  const investHref = viewer ? '/dashboard/plans' : '/register';

  // Feature the middle plan. With 5 seeded plans that is index 2.
  const featuredIdx = Math.floor(plans.length / 2);

  return (
    <>
      <PageHeroBanner title='Investment Plans' crumb='Investment Plans' />

      <section className='py-[70px] bg-bg'>
        <Container>
          {/* Section head */}
          <div className='text-center max-w-[560px] mx-auto mb-12 space-y-3'>
            <span className='bg-primary/10 block w-fit mx-auto text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3'>
              Choose your plan
            </span>
            <p className='text-xl md:text-2xl text-navy font-bold'>
              Plans built for every investor
            </p>
            <p className='text-muted text-sm md:text-base leading-relaxed'>
              Transparent rates, clear durations, no hidden fees. Start from as
              little as $100.
            </p>
          </div>

          {/* Empty state */}
          {plans.length === 0 && (
            <p className='text-center text-muted py-20'>
              No active plans available at this time. Please check back soon.
            </p>
          )}

          {/* Plan cards */}
          {plans.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {plans.map((plan, idx) => {
                const featured = idx === featuredIdx;
                return (
                  <Reveal key={plan.id} delay={idx * 90}>
                    <div
                      className={`relative flex flex-col bg-surface rounded-2xl p-7 h-full
                        transition-all duration-200 hover:shadow-md ${
                          featured
                            ? 'border-2 border-primary'
                            : 'border border-line hover:border-primary/20'
                        }`}
                    >
                      {/* Featured badge */}
                      {featured && (
                        <div className='absolute -top-[11px] left-1/2 -translate-x-1/2 bg-primary text-on-navy text-[11px] font-semibold px-4 py-1 rounded-full whitespace-nowrap'>
                          Most popular
                        </div>
                      )}

                      {/* Plan name */}
                      <h3 className='text-[19px] font-semibold text-text mb-2'>
                        {plan.name}
                      </h3>

                      {/* Daily rate */}
                      <div className='mb-6'>
                        <span className='font-display text-[34px] font-bold text-primary leading-none'>
                          {plan.dailyRatePct}%
                        </span>
                        <span className='text-sm text-muted ml-1'>/ day</span>
                      </div>

                      {/* Details list */}
                      <ul className='flex-1 mb-6 space-y-0'>
                        {[
                          {
                            label: 'Duration',
                            value: `${plan.durationDays} days`,
                          },
                          { label: 'Minimum', value: formatUSD(plan.minCents) },
                          {
                            label: 'Maximum',
                            value: plan.maxCents
                              ? formatUSD(plan.maxCents)
                              : 'Unlimited',
                          },
                          {
                            label: 'Referral bonus',
                            value: `${plan.referralPct ?? 5}%`,
                          },
                        ].map((row) => (
                          <li
                            key={row.label}
                            className='flex items-center justify-between py-[10px] text-[13.5px] border-b border-line last:border-b-0'
                          >
                            <span className='text-muted'>{row.label}</span>
                            <b className='font-semibold text-text'>
                              {row.value}
                            </b>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        href={investHref}
                        className='flex items-center justify-center bg-primary hover:bg-primary-press text-on-navy text-sm font-semibold py-3 rounded-[10px] no-underline transition-colors duration-150 active:scale-[0.97]'
                      >
                        Invest now
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
