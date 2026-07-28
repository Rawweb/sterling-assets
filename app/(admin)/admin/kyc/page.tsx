import PageShell from '@/components/dashboard/PageShell';
import AdminKycView from '@/components/admin/AdminKycView';
import { getAdminKyc } from '@/lib/admin-kyc';

export default async function AdminKycPage() {
  const submissions = await getAdminKyc();

  return (
    <PageShell title='KYC'>
      <AdminKycView submissions={submissions} />
    </PageShell>
  );
}
