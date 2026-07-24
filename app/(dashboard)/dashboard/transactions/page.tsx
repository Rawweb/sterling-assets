import PageShell from '@/components/dashboard/PageShell';
import TransactionsView from '@/components/dashboard/TransactionsView';

export default function TransactionsPage() {
  return (
    <PageShell title='Transaction records'>
      <TransactionsView />
    </PageShell>
  );
}
