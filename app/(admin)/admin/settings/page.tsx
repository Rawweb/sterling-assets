import PageShell from '@/components/dashboard/PageShell';
import AdminSettingsView from '@/components/admin/AdminSettingsView';
import { getWalletAddresses } from '@/lib/admin-settings';

export default async function AdminSettingsPage() {
  const wallets = await getWalletAddresses();

  return (
    <PageShell title='Settings'>
      <AdminSettingsView wallets={wallets} />
    </PageShell>
  );
}
