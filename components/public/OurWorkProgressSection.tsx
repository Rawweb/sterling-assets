import Image from 'next/image';
import Container from '@/components/Container';
import Reveal from '@/components/public/Reveal';

/**
 * Server component. Light surface background.
 * Three process steps, each with a circular photo inside a slowly rotating dashed ring.
 * The ring uses animate-spin-slow (defined in globals.css @theme + @keyframes).
 * Images must exist at: public/images/work-process-1.jpg, work-process-2.jpg, work-process-3.jpg
 */

const STEPS = [
  {
    number: '01',
    title: 'Unlocking Growth Opportunities',
    description:
      'Sterling Assets Holdings identifies high-potential sectors, providing tailored investments that enhance operational efficiency, foster innovation, and expand market reach.',
    image: '/images/work-process-1.jpeg',
  },
  {
    number: '02',
    title: 'Industry Expertise & Strategic Guidance',
    description:
      'We deliver expert insights and customized strategies across key industries, optimizing business performance and aligning goals with market trends.',
    image: '/images/work-process-2.jpeg',
  },
  {
    number: '03',
    title: 'Sustainability-Driven Partnerships',
    description:
      'Sterling Assets Holdings promotes eco-friendly practices and sustainable investments, helping businesses adapt to evolving demands while driving growth and resilience.',
    image: '/images/work-process-3.jpeg',
  },
];

export default function OurWorkProcessSection() {
  return (
    <section className='bg-surface py-20'>
      <Container>
        {/* Section header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2.5 mb-5'>
            {/* Bar chart indicator — matches the || icon in the reference */}
            <span className='flex items-end gap-[3px]' aria-hidden='true'>
              <span className='w-[3px] h-3 bg-primary rounded-full' />
              <span className='w-[3px] h-5 bg-primary rounded-full' />
              <span className='w-[3px] h-4 bg-primary rounded-full' />
            </span>
            <p className='text-sm font-bold tracking-[0.2em] uppercase text-primary'>
              Our Work Process
            </p>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-text max-w-[700px] mx-auto leading-tight'>
            Empowering Business Growth Through Strategic Investments
          </h2>
        </div>

        {/* Three steps grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8'>
          {STEPS.map((step, idx) => (
            <Reveal key={step.number} delay={idx * 150}>
              <div className='flex flex-col items-center text-center gap-8'>
                {/*
                  Rotating dashed ring + static circular image + number badge.
                  The ring (absolute, inset-0) rotates via animate-spin-slow.
                  The image container (absolute, inset-[10px]) is a sibling — it does NOT rotate.
                  The badge sits at the bottom of the outer container.
                */}
                <div className='relative w-[250px] h-[250px] mx-auto'>
                  {/* Rotating dashed ring */}
                  <div className='absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow' />

                  {/* Static image — inset so the dashed ring is visible around it */}
                  <div className='absolute inset-[10px] rounded-full overflow-hidden'>
                    {/* Inner relative wrapper required for next/image fill */}
                    <div className='relative w-full h-full'>
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes='210px'
                        className='object-cover'
                      />
                    </div>
                  </div>

                  {/* Number badge — sits at the bottom, above the ring */}
                  <div className='absolute -bottom-4 left-1/2 -translate-x-1/2 z-10'>
                    <span className='bg-primary text-on-navy text-sm font-bold px-6 py-2 rounded-full shadow-lg block whitespace-nowrap'>
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Text — extra top padding to clear the badge overflow */}
                <div className='flex flex-col gap-3 pt-2 w-full max-w-[300px] mx-auto'>
                  <h3 className='text-xl font-bold text-text'>{step.title}</h3>
                  <p className='text-muted text-sm md:text-base leading-relaxed'>
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
