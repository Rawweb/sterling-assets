import PageShell from '@/components/dashboard/PageShell';
import InvestView from '@/components/dashboard/InvestView';
import { getViewer } from '@/lib/viewer';
import { getSummary } from '@/lib/ledger';
import { getActivePlans } from '@/lib/plans';
import { redirect } from 'next/navigation';

export default async function PlansPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const [summary, plans] = await Promise.all([
    getSummary(viewer.id),
    getActivePlans(),
  ]);

  return (
    <PageShell title='Start an investment'>
      <InvestView balanceCents={summary.balanceCents} plans={plans} />
    </PageShell>
  );
}
