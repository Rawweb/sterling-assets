import Logo from '@/components/Logo';
import { CheckCircle2 } from 'lucide-react';

const POINTS = [
  'Bank-level encryption on every login',
  'Two-step confirmation on withdrawals',
  'A clear record of every move on your money',
];

export default function AuthSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid min-h-screen grid-cols-1 md:grid-cols-2'>
      <aside className='bg-auth-visual relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex lg:p-12'>
        {/* orb */}
        <div className='pointer-events-none absolute -top-20 -right-24 h-80 w-80 rounded-full bg-primary opacity-50 blur-[60px]' />
        <div className='pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[#7C4DFF] opacity-35 blur-[60px]' />
        <div className='relative'>
          <Logo withWordmark onDark />
        </div>
        <div className='relative max-w-sm textce'>
          <h2 className='text-3xl leading-tight'>
            Grow and manage your portfolio with confidence.
          </h2>
          <p className='mt-3 text-white/70'>
            Fund your balance, track profit, and manage plans from one secure
            dashboard.
          </p>

          <ul className='mt-8 space-y-3'>
            {POINTS.map((point) => (
              <li
                key={point}
                className='flex items-center gap-3 text-sm text-white/85'
              >
                <CheckCircle2 size={16} className='shrink-0 text-gold' />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className='relative text-xs text-white/50'>
          &copy; {new Date().getFullYear()} Sterling Assets Holdings.
        </p>
      </aside>

      {/* RIGHT: the form slot */}
      <main className='flex items-center justify-center bg-bg p-6 sm:p-10'>
        <div className='w-full max-w-md'>{children}</div>
      </main>
    </div>
  );
}
