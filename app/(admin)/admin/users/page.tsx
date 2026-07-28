import PageShell from '@/components/dashboard/PageShell';
import AdminUsersView from '@/components/admin/AdminUsersView';
import { getAdminUsers } from '@/lib/admin-users';

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <PageShell title='Users'>
      <AdminUsersView users={users} />
    </PageShell>
  );
}
