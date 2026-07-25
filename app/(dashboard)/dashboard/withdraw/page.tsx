import PageShell from '@/components/dashboard/PageShell';
import WithdrawView from '@/components/dashboard/WithdrawView';
import { getViewer } from '@/lib/viewer';
import { getSummary } from '@/lib/ledger';
import { redirect } from 'next/navigation';

export default async function WithdrawPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');
  const summary = await getSummary(viewer.id);

  return (
    <PageShell title='Withdraw funds'>
      <WithdrawView
        balanceCents={summary.balanceCents}
        kycStatus={viewer.kycStatus}
      />
    </PageShell>
  );
}
