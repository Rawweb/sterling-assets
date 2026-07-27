import PageShell from '@/components/dashboard/PageShell';
import ProfileView from '@/components/dashboard/ProfileView';
import { getViewer } from '@/lib/viewer';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  return (
    <PageShell title='Your profile'>
      <ProfileView viewer={viewer} />
    </PageShell>
  );
}
