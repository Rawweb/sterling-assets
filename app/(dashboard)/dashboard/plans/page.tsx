import PageShell from '@/components/dashboard/PageShell';
import InvestView from '@/components/dashboard/InvestView';

export default function PlansPage() {
  return (
    <PageShell title='Start an investment'>
      <InvestView />
    </PageShell>
  );
}
