import Link from 'next/link';
import { Bell } from 'lucide-react';
import Logo from '@/components/Logo';
import UserMenu from '@/components/shell/UserMenu';
import MobileNav from '@/components/shell/MobileNav';
import Sidebar from '@/components/shell/Sidebar';
import { getViewer } from '@/lib/viewer';
import { getSummary } from '@/lib/ledger';
import { getUnreadCount } from '@/lib/notifications';
import LanguageSwitcher from '@/components/public/LanguageSwitcher';

export default async function Topbar() {
  const viewer = await getViewer();
  if (!viewer) return null;

  const [{ balanceCents }, unread] = await Promise.all([
    getSummary(viewer.id),
    getUnreadCount(viewer.id),
  ]);

  return (
    <header className='flex h-full w-full items-center'>
      <div className='flex w-sidebar shrink-0 items-center gap-3 pl-4 lg:pl-3.5'>
        <MobileNav>
          <Sidebar
            fullName={viewer.fullName}
            balanceCents={balanceCents}
            avatarUrl={viewer.avatarUrl}
          />
        </MobileNav>

        <Logo withWordmark onDark size={32} />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='mx-auto flex h-full w-full items-center justify-end px-4 sm:px-[22px]'>
          <div className='flex items-center gap-2.5'>
            <LanguageSwitcher variant='nav' />
            <Link
              href='/dashboard/notifications'
              aria-label='Notifications'
              className='relative grid size-10 place-items-center rounded-[10px] border border-on-navy/10 text-on-navy-muted transition-colors hover:text-surface active:bg-surface/10 active:scale-[0.95]'
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className='absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full bg-down px-1 text-[10px] font-bold text-surface'>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>

            <UserMenu
              fullName={viewer.fullName}
              profileHref='/dashboard/profile'
              avatarUrl={viewer.avatarUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
