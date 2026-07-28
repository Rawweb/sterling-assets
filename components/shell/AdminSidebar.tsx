import Link from 'next/link';
import { adminNav } from '@/lib/dashboard-data';
import NavLink from '@/components/shell/NavLink';
import AdminProfileCard from '@/components/shell/AdminProfileCard';
import { prisma } from '@/lib/db';

async function getPendingCounts() {
  const [deposits, withdrawals, kyc] = await Promise.all([
    prisma.deposit.count({ where: { status: 'PENDING' } }),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.kycSubmission.count({ where: { status: 'PENDING' } }),
  ]);
  return { deposits, withdrawals, kyc };
}

export default async function AdminSidebar({ fullName }: { fullName: string }) {
  const pending = await getPendingCounts();

  // Map each nav href to its pending count.
  // Only deposit, withdrawal, and KYC have pending queues.
  const badges: Record<string, number> = {
    '/admin/deposits': pending.deposits,
    '/admin/withdrawals': pending.withdrawals,
    '/admin/kyc': pending.kyc,
  };

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto px-3.5 py-4'>
      <div className='mb-2 rounded-2xl bg-navy-900'>
        <AdminProfileCard fullName={fullName} />
      </div>

      <nav className='grid flex-1 grid-cols-2 content-start gap-3 py-4'>
        {adminNav.map(({ label, href, icon: Icon, exact }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            exact={exact}
            icon={<Icon size={20} />}
            badge={badges[href]}
          />
        ))}
      </nav>

      {/* Help card — matches user sidebar style */}
      <div className='rounded-xl bg-navy-900 text-surface flex flex-col gap-2 p-4'>
        <h3 className='text-sm font-semibold'>Admin Panel</h3>
        <p className='text-[12px] text-surface/60'>
          Every action you take is logged to the audit trail.
        </p>
        <Link
          href='/admin/audit-log'
          className='mt-1 rounded-full bg-surface px-4 py-2 text-center text-sm text-navy-900 transition-colors hover:bg-primary hover:text-surface active:scale-[0.97] active:bg-primary-press'
        >
          View audit log
        </Link>
      </div>
    </div>
  );
}
