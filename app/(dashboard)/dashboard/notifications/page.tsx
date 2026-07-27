import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import NotificationsView from '@/components/dashboard/NotificationsView';
import { getViewer } from '@/lib/viewer';
import { getNotifications } from '@/lib/notifications';

export default async function NotificationsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const notifications = await getNotifications(viewer.id);

  return (
    <PageShell title='Notifications'>
      <NotificationsView notifications={notifications} />
    </PageShell>
  );
}
