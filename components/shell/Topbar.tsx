import { Bell, Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import UserMenu from '@/components/shell/UserMenu';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';

export default function Topbar() {
  return (
    <header className='flex h-full w-full items-center justify-between px-4'>
      <div className='flex items-center gap-3'>
        {/* placeholder until MobileNav lands */}
        <MobileNav>
          <Sidebar />
        </MobileNav>

        <Logo withWordmark onDark size={32} />
      </div>

      <div className='flex items-center gap-2.5'>
        <button
          type='button'
          aria-label='Notifications'
          className='grid size-10 place-items-center rounded-[10px] border border-on-navy/10 text-on-navy-muted transition-colors hover:text-on-navy'
        >
          <Bell size={18} />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
