import { Award, Download, Eye, FileText } from 'lucide-react';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';
import Image from 'next/image';

const CERTS = [
  {
    icon: Award,
    label: 'Guarantee Certificate',
    action: Eye,
    href: '/documents/guarantee-certificate.jpg',
  },
  {
    icon: FileText,
    label: 'Certificate of Registration',
    action: Eye,
    href: '/documents/certificate-of-registration.jpg',
  },
  {
    icon: Download,
    label: 'Company Corporate Profile',
    action: Download,
    href: '/documents/sterling-assets-company-profile.pdf',
  },
];

export default function AboutCompanySection() {
  return (
    <section className='py-[70px] bg-surface'>
      <Container>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center'>
          {/* ---- left: image ---- */}
          <Reveal className='space-y-5'>
            <div className='relative rounded-2xl overflow-hidden aspect-[4/3] w-full'>
              <Image
                src='/images/company.jpg'
                alt='Sterling Assets Holdings'
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 60vw'
              />
            </div>
            <p className='text-muted text-sm md:text-base leading-relaxed hidden md:block'>
              <span className='block mb-3'>
                Sterling Assets Holdings began its journey in 2015, founded on
                the principles of innovation, sustainability, and a passion for
                creating value.
              </span>
              We started as a focused digital asset firm, we built partnerships
              across key sectors aligned with our vision for transformative
              growth. By consistently adapting to global market trends and
              prioritising security, we have grown into a trusted name in the
              investment world, delivering measurable impact and daily returns
              for investors around the globe.
            </p>
          </Reveal>

          {/* ---- right: text + credentials ---- */}
          <Reveal delay={120}>
            <div className='flex flex-col gap-5'>
              {/* Badge */}
              <span className='bg-primary/10 text-primary text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border-l-3 self-start'>
                Who we are
              </span>

              {/* Heading */}
              <h2 className='text-2xl md:text-3xl font-bold text-navy'>
                Sterling Assets Holdings
              </h2>

              {/* Body */}
              <p className='text-muted text-sm md:text-base leading-relaxed'>
                Sterling Assets Holdings is a Luxembourg-based investment
                powerhouse founded in 2015 with the mission to transform
                industries and create sustainable value. With a strategic focus
                on banking, steel, agriculture, and real estate, we
                provide innovative investment solutions that drive growth,
                foster innovation, and positively impact communities. Our
                commitment lies in empowering businesses and individuals by
                aligning financial success with a broader vision of
                sustainability and long-term development.
              </p>

              <p className='text-muted text-sm md:text-base leading-relaxed md:hidden'>
                <span className='block mb-3'>
                  Sterling Assets Holdings began its journey in 2015, founded on
                  the principles of innovation, sustainability, and a passion
                  for creating value.
                </span>
                We started as a focused digital asset firm, we built
                partnerships across key sectors aligned with our vision for
                transformative growth. By consistently adapting to global market
                trends and prioritising security, we have grown into a trusted
                name in the investment world, delivering measurable impact and
                daily returns for investors around the globe.
              </p>

              {/* Credentials */}
              <div className='border-t border-line pt-6 mt-1 flex flex-col gap-3'>
                <p className='text-[11px] font-semibold text-muted uppercase tracking-widest'>
                  Verified credentials
                </p>
                {CERTS.map((cert) => {
                  const Icon = cert.icon;
                  const Action = cert.action;
                  return (
                    <a
                      key={cert.label}
                      href={cert.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-3 bg-primary hover:bg-primary-press text-on-navy px-5 py-4 rounded-xl transition-all duration-150 active:scale-[0.98] no-underline'
                    >
                      <Icon size={17} className='flex-shrink-0' />
                      <span className='flex-1 text-sm font-semibold'>
                        {cert.label}
                      </span>
                      <Action size={15} className='flex-shrink-0 opacity-75' />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
