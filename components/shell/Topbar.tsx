import { Bell, Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import UserMenu from '@/components/shell/UserMenu';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';

export default function Topbar() {
  return (
    <header className='flex h-full w-full items-center'>
      <div className='flex w-sidebar shrink-0 items-center gap-3 pl-4 lg:pl-3.5'>
        <MobileNav>
          <Sidebar />
        </MobileNav>

        <Logo withWordmark onDark size={32} />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='mx-auto flex h-full w-full items-center justify-end px-4 sm:px-[22px]'>
          <div className='flex items-center gap-2.5'>
            <button
              type='button'
              aria-label='Notifications'
              className='grid size-10 place-items-center rounded-[10px] border border-on-navy/10 text-on-navy-muted transition-colors hover:text-surface active:bg-surface/10 active:scale-[0.95]'
            >
              <Bell size={18} />
            </button>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
