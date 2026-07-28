import PageShell from '@/components/dashboard/PageShell';
import AdminDepositsView from '@/components/admin/AdminDepositsView';
import { getAdminDeposits } from '@/lib/admin-deposits';

export default async function AdminDepositsPage() {
  const deposits = await getAdminDeposits();

  return (
    <PageShell title='Deposits'>
      <AdminDepositsView deposits={deposits} />
    </PageShell>
  );
}
