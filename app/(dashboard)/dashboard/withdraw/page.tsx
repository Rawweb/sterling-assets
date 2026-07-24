import PageShell from '@/components/dashboard/PageShell';
import WithdrawView from '@/components/dashboard/WithdrawView';

export default function WithdrawPage() {
  return (
    <PageShell title='Withdraw funds'>
      <WithdrawView />
    </PageShell>
  );
}
