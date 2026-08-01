import { userNav } from '@/lib/dashboard-data';
import NavLink from '@/components/shell/NavLink';
import Link from 'next/link';
import ProfileCard from '@/components/shell/ProfileCard';

export default function Sidebar({
  fullName,
  balanceCents,
  avatarUrl,
}: {
  fullName: string;
  balanceCents: number;
  avatarUrl?: string | null;
}) {
  return (
    <div className='flex h-full w-full flex-col overflow-y-auto px-3.5 py-4'>
      <div className='mb-2 rounded-2xl bg-navy-900'>
        <ProfileCard
          fullName={fullName}
          balanceCents={balanceCents}
          avatarUrl={avatarUrl}
        />
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

      <div className='flex flex-col gap-3 rounded-xl bg-navy-900 p-4 text-surface'>
        <h3>Need Help!</h3>
        <p className='text-sm text-on-navy-muted'>
          Contact our 24/7 customer support center
        </p>
        <Link
          href='/dashboard/support'
          className='rounded-full bg-surface px-4 py-2 text-center text-sm text-navy-900 transition-colors hover:bg-primary hover:text-surface active:scale-[0.97] active:bg-primary-press'
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
