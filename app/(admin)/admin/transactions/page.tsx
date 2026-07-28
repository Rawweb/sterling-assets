import PageShell from '@/components/dashboard/PageShell';
import AdminTransactionsView from '@/components/admin/AdminTransactionsView';
import { getAdminTransactions } from '@/lib/admin-transactions';

export default async function AdminTransactionsPage() {
  const transactions = await getAdminTransactions();

  return (
    <PageShell title='Transactions'>
      <AdminTransactionsView transactions={transactions} />
    </PageShell>
  );
}
