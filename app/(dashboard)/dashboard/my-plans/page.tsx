import { redirect } from 'next/navigation';
import PageShell from '@/components/dashboard/PageShell';
import MyPlansView from '@/components/dashboard/MyPlansView';
import { getViewer } from '@/lib/viewer';
import { getUserPlans } from '@/lib/user-plans';

export default async function MyPlansPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');

  const plans = await getUserPlans(viewer.id);

  return (
    <PageShell title='My investment plans'>
      <MyPlansView plans={plans} />
    </PageShell>
  );
}
