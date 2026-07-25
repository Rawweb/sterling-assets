import PageShell from '@/components/dashboard/PageShell';
import ProfileView from '@/components/dashboard/ProfileView';
import { getViewer } from '@/lib/viewer';

export default async function ProfilePage() {
  const viewer = await getViewer();

  return (
    <PageShell title='Your profile'>
      <ProfileView viewer={viewer} />
    </PageShell>
  );
}
