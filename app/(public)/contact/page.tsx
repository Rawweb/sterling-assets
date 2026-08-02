import type { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';
import PageHeroBanner from '@/components/public/PageHeroBanner';
import Container from '@/components/Container';
import ContactForm from '@/components/public/ContactForm';

export const metadata: Metadata = { title: 'Contact Us' };

const ADDRESS =
  "14 Av. du Rock'n'Roll 4361, Esch-Belval, Esch-sur-Alzette, Luxembourg";

/**
 * Left column: contact info + embedded Google Map (correct Luxembourg address).
 * Right column: ContactForm client component (reCAPTCHA + Resend).
 */
export default function ContactPage() {
  return (
    <>
      <PageHeroBanner title='Contact Us' crumb='Contact' />

      <section className='py-[70px]'>
        <Container>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start'>
            {/* ---- left: info + map ---- */}
            <div className='flex flex-col gap-7'>
              <div>
                <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3'>
                  Get in touch
                </span>
                <h2 className='text-2xl md:text-3xl font-bold text-navy mt-4 mb-3'>
                  We are here to help
                </h2>
                <p className='text-muted text-sm md:text-base leading-relaxed'>
                  Reach out to us today and let us work together to grow your
                  portfolio. Our support team is available around the clock.
                </p>
              </div>

              {/* Email */}
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 text-on-navy'>
                  <Mail size={18} />
                </div>
                <div>
                  <p className='font-semibold text-sm text-text mb-1'>Email</p>
                  <a
                    href='mailto:support@sterlingassetsholdings.com'
                    className='text-sm text-muted hover:text-primary transition-colors no-underline'
                  >
                    support@sterlingassetsholdings.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 text-on-navy'>
                  <MapPin size={18} />
                </div>
                <div>
                  <p className='font-semibold text-sm text-text mb-1'>
                    Address
                  </p>
                  <p className='text-sm text-muted leading-relaxed'>
                    {ADDRESS}
                  </p>
                </div>
              </div>

              {/* Google Map — correct Luxembourg location */}
              <div className='rounded-2xl overflow-hidden border border-line'>
                <iframe
                  src='https://maps.google.com/maps?q=Rockhal+14+Avenue+du+Rock+n+Roll+Esch-sur-Alzette+Luxembourg&output=embed&z=15'
                  width='100%'
                  height='240'
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Sterling Assets Holdings — Luxembourg office location'
                />
              </div>
            </div>

            {/* ---- right: form card ---- */}
            <div className='bg-surface border border-line rounded-2xl p-7 md:p-10'>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
