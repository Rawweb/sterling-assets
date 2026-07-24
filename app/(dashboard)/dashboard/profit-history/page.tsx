import PageShell from '@/components/dashboard/PageShell';
import ProfitHistoryView from '@/components/dashboard/ProfitHistoryView';

export default function ProfitHistoryPage() {
  return (
    <PageShell title='Your ROI history'>
      <ProfitHistoryView />
    </PageShell>
  );
}
