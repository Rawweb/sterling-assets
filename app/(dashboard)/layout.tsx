import Topbar from '@/components/shell/Topbar';
import Sidebar from '@/components/shell/Sidebar';
import { getViewer } from '@/lib/viewer';
import { redirect } from 'next/navigation';
import { getSummary } from '@/lib/ledger';

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');
  const summary = await getSummary(viewer.id);

  return (
    <div className='min-h-screen bg-bg'>
      {/* full-bleed bar, capped contents */}
      <header className='fixed inset-x-0 top-0 z-40 h-16 bg-navy-900'>
        <div className='mx-auto h-full max-w-shell'>
          <Topbar />
        </div>
      </header>

      {/* capped shell */}
      <div className='mx-auto flex max-w-shell pt-16'>
        <aside className='sticky top-16 hidden h-[calc(100dvh-4rem)] w-sidebar shrink-0 lg:block'>
          <Sidebar fullName={viewer.fullName} balanceCents={summary.balanceCents} />
        </aside>

        <main className='min-w-0 flex-1'>{children}</main>
      </div>
    </div>
  );
}
