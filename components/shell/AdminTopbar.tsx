import Link from 'next/link';
import { Bell } from 'lucide-react';
import Logo from '@/components/Logo';
import UserMenu from '@/components/shell/UserMenu';
import MobileNav from '@/components/shell/MobileNav';
import AdminSidebar from '@/components/shell/AdminSidebar';
import { getAdminUser } from '@/lib/session';
import { getUnreadCount } from '@/lib/notifications';

export default async function AdminTopbar() {
  const admin = await getAdminUser();
  if (!admin) return null;

  const unread = await getUnreadCount(admin.id);

  return (
    <header className='flex h-full w-full items-center'>
      <div className='flex w-sidebar shrink-0 items-center gap-3 pl-4 lg:pl-3.5'>
        <MobileNav>
          <AdminSidebar fullName={admin.fullName} />
        </MobileNav>

        <Logo withWordmark onDark size={32} />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='mx-auto flex h-full w-full items-center justify-end px-4 sm:px-[22px]'>
          <div className='flex items-center gap-2.5'>
            <Link
              href='/admin/notifications'
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

            <UserMenu fullName={admin.fullName} />
          </div>
        </div>
      </div>
    </header>
  );
}
