import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import ProfitHistoryView from '@/components/dashboard/ProfitHistoryView';
import { getViewer } from '@/lib/viewer';
import { getProfitHistory } from '@/lib/profit-history';

export default async function ProfitHistoryPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const rows = await getProfitHistory(viewer.id);

  return (
    <PageShell title='Your ROI history'>
      <ProfitHistoryView rows={rows} />
    </PageShell>
  );
}
