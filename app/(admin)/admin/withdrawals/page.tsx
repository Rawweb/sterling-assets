import PageShell from '@/components/dashboard/PageShell';
import AdminWithdrawalsView from '@/components/admin/AdminWithdrawalsView';
import { getAdminWithdrawals } from '@/lib/admin-withdrawals';

export default async function AdminWithdrawalsPage() {
  const withdrawals = await getAdminWithdrawals();

  return (
    <PageShell title='Withdrawals'>
      <AdminWithdrawalsView withdrawals={withdrawals} />
    </PageShell>
  );
}
