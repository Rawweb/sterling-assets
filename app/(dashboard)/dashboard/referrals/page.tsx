import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import ReferralsView from '@/components/dashboard/ReferralsView';
import { getViewer } from '@/lib/viewer';
import { getReferralData } from '@/lib/referrals';

export default async function ReferralsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const data = await getReferralData(viewer.id);

  return (
    <PageShell title='Referrals'>
      <ReferralsView data={data} />
    </PageShell>
  );
}
