import PageShell from '@/components/dashboard/PageShell';
import DepositView from '@/components/dashboard/DepositView';

export default function DepositPage() {
  return (
    <PageShell title='Fund your account'>
      <DepositView />
    </PageShell>
  );
}
