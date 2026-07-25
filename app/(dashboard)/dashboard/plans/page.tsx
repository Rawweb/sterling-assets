import PageShell from '@/components/dashboard/PageShell';
import InvestView from '@/components/dashboard/InvestView';
import { getViewer } from '@/lib/viewer';
import { getSummary } from '@/lib/ledger';
import { redirect } from 'next/navigation';

export default async function PlansPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');
  const summary = await getSummary(viewer.id);

  return (
    <PageShell title='Start an investment'>
      <InvestView balanceCents={summary.balanceCents} />
    </PageShell>
  );
}
