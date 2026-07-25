import { userNav } from '@/lib/dashboard-data';
import NavLink from '@/components/shell/NavLink';
import Link from 'next/link';
import ProfileCard from '@/components/shell/ProfileCard';

export default function Sidebar({ fullName, balanceCents }: { fullName: string; balanceCents: number }) {
  return (
    <div className='flex h-full w-full flex-col overflow-y-auto px-3.5 py-4'>
      {/* profile card placeholder */}
      <div className='mb-2 rounded-2xl bg-navy-900'>
        <ProfileCard fullName={fullName} balanceCents={balanceCents} />
      </div>

      <nav className='grid flex-1 grid-cols-2 content-start gap-3 py-4'>
        {userNav.map(({ label, href, icon: Icon, exact }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            exact={exact}
            icon={<Icon size={20} />}
          />
        ))}
      </nav>

      {/* help card */}
      <div className='rounded-xl bg-navy-900 text-surface flex flex-col gap-3 p-4'>
        <h3>Need Help!</h3>
        <p className='text-on-navy-muted text-sm'>
          Contact our 24/7 customer support center
        </p>
        <Link
          href='/dashboard/support'
          className='bg-surface px-4 py-2 rounded-full text-navy-900 text-center text-sm hover:bg-primary hover:text-surface transition-colors active:scale-[0.97] active:bg-primary-press'
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
