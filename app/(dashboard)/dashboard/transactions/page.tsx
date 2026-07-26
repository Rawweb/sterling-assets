import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import TransactionsView from '@/components/dashboard/TransactionsView';
import { getViewer } from '@/lib/viewer';
import { getUserDeposits } from '@/lib/deposits';
import { getUserWithdrawals } from '@/lib/withdrawals';
import { getOtherTransactions } from '@/lib/transactions';

export default async function TransactionsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const [deposits, withdrawals, others] = await Promise.all([
    getUserDeposits(viewer.id),
    getUserWithdrawals(viewer.id),
    getOtherTransactions(viewer.id),
  ]);
  return (
    <PageShell title='Transaction records'>
      <TransactionsView
        deposits={deposits}
        withdrawals={withdrawals}
        others={others}
      />
    </PageShell>
  );
}
