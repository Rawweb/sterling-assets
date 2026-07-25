import PageShell from '@/components/dashboard/PageShell';
import KycView from '@/components/dashboard/KycView';
import { getViewer } from '@/lib/viewer';

export default async function KycPage() {
  const viewer = await getViewer();

  return (
    <PageShell title='Identity verification'>
      <KycView status={viewer.kycStatus} />
    </PageShell>
  );
}
