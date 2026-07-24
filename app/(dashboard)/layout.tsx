import Sidebar from '@/components/shell/Sidebar';
import Topbar from '@/components/shell/Topbar';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Top Bar */}
      <div className='fixed top-0 left-0 right-0 h-16 z-40 bg-navy-900 text-surface flex items-center px-4'>
        <Topbar />
      </div>

      {/* Sidebar */}
      <div className='fixed top-16 bottom-0 left-0 w-sidebar z-30 hidden lg:flex bg-bg'>
        <Sidebar />
      </div>

      <main className='pt-16 lg:ml-sidebar min-h-screen bg-bg'>{children}</main>
    </div>
  );
}
