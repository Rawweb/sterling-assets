import AdminTopbar from '@/components/shell/AdminTopbar';
import AdminSidebar from '@/components/shell/AdminSidebar';
import { getAdminUser, getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  if (!admin) {
    const user = await getCurrentUser();
    redirect(user ? '/dashboard' : '/login');
  }

  return (
    <div className='min-h-screen bg-bg'>
      <header className='fixed inset-x-0 top-0 z-40 h-16 bg-navy-900'>
        <div className='mx-auto h-full max-w-shell'>
          <AdminTopbar />
        </div>
      </header>

      <div className='mx-auto flex max-w-shell pt-16'>
        <aside className='sticky top-16 hidden h-[calc(100dvh-4rem)] w-sidebar shrink-0 lg:block'>
          <AdminSidebar fullName={admin.fullName} />
        </aside>

        <main className='min-w-0 flex-1'>{children}</main>
      </div>
    </div>
  );
}
