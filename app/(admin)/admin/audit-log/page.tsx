import PageShell from '@/components/dashboard/PageShell';
import AdminAuditView from '@/components/admin/AdminAuditView';
import { getAuditLogs } from '@/lib/admin-audit';

export default async function AdminAuditLogPage() {
  const logs = await getAuditLogs();

  return (
    <PageShell title='Audit log'>
      <AdminAuditView logs={logs} />
    </PageShell>
  );
}
