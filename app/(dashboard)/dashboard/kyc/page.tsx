import PageShell from '@/components/dashboard/PageShell';
import KycView from '@/components/dashboard/KycView';
import { getViewer } from '@/lib/viewer';
import { redirect } from 'next/navigation';

export default async function KycPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  return (
    <PageShell title='Identity verification'>
      <KycView
        status={viewer.kycStatus}
        initialPhone={viewer.phone}
        initialCountry={viewer.country}
      />
    </PageShell>
  );
}
