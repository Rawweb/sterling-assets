import PageShell from '@/components/dashboard/PageShell';
import AdminPlansView from '@/components/admin/AdminPlansView';
import { getAdminPlans, getActiveUserPlans } from '@/lib/admin-plans';

export default async function AdminPlansPage() {
  const [plans, activeUserPlans] = await Promise.all([
    getAdminPlans(),
    getActiveUserPlans(),
  ]);

  return (
    <PageShell title='Plans'>
      <AdminPlansView plans={plans} activeUserPlans={activeUserPlans} />
    </PageShell>
  );
}
