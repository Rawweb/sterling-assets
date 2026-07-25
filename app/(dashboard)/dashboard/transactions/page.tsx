import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import TransactionsView from '@/components/dashboard/TransactionsView';
import { getViewer } from '@/lib/viewer';
import { getUserDeposits } from '@/lib/deposits';

export default async function TransactionsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const deposits = await getUserDeposits(viewer.id);

  return (
    <PageShell title='Transaction records'>
      <TransactionsView deposits={deposits} />
    </PageShell>
  );
}
