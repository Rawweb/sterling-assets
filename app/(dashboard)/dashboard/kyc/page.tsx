import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import KycView from '@/components/dashboard/KycView';
import { getViewer } from '@/lib/viewer';

export default async function KycPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  return (
    <PageShell title='Identity verification'>
      <KycView status={viewer.kycStatus} />
    </PageShell>
  );
}
