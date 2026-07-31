import PageShell from '@/components/dashboard/PageShell';
import NotificationsView from '@/components/dashboard/NotificationsView';
import { getAdminUser } from '@/lib/session';
import { getNotifications } from '@/lib/notifications';
import { redirect } from 'next/navigation';

export default async function AdminNotificationsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/login');

  const notifications = await getNotifications(admin.id);

  return (
    <PageShell title='Notifications'>
      <NotificationsView notifications={notifications} />
    </PageShell>
  );
}
