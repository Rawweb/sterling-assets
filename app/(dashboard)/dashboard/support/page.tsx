import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, ExternalLink, HelpCircle, Mail } from 'lucide-react';
import { getViewer } from '@/lib/viewer';
import PageShell from '@/components/dashboard/PageShell';
import DashboardContactForm from '@/components/dashboard/SupportView';

export default async function SupportPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  return (
    <PageShell title='Support'>
      {/* ---- quick contact options ---- */}
      <section className='mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5'>
          {/* Email */}
          <div className='rounded-[14px] border border-line p-5 flex items-start gap-4'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0'>
              <Mail size={18} />
            </div>
            <div>
              <p className='font-semibold text-sm text-text mb-1'>
                Email support
              </p>
              <a
                href='mailto:support@sterlingassetsholdings.com'
                className='text-xs text-primary hover:underline no-underline break-all'
              >
                support@sterlingassetsholdings.com
              </a>
            </div>
          </div>

          {/* Response time */}
          <div className='rounded-[14px] border border-line p-5 flex items-start gap-4'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0'>
              <Clock size={18} />
            </div>
            <div>
              <p className='font-semibold text-sm text-text mb-1'>
                Response time
              </p>
              <p className='text-xs text-muted leading-relaxed'>
                We respond to all support requests within 24 hours.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <Link
            href='/faqs'
            target='_blank'
            className='rounded-[14px] border border-line p-5 flex items-start gap-4 no-underline hover:border-primary/30 hover:shadow-sm transition-all duration-150'
          >
            <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0'>
              <HelpCircle size={18} />
            </div>
            <div>
              <p className='font-semibold text-sm text-text mb-1'>
                FAQs
                <ExternalLink size={12} className='inline ml-1 text-muted' />
              </p>
              <p className='text-xs text-muted leading-relaxed'>
                Browse common questions about plans, deposits, and withdrawals.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ---- contact form ---- */}
      <section>
        <div className='rounded-[14px] border border-line p-5 sm:p-7'>
          <h2 className='text-base font-semibold mb-1'>Send us a message</h2>
          <p className='text-sm text-muted mb-6'>
            Describe your issue and we will get back to you as soon as possible.
          </p>
          <DashboardContactForm name={viewer.fullName} email={viewer.email} />
        </div>
      </section>
    </PageShell>
  );
}
