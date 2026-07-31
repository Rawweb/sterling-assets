import PageShell from '@/components/dashboard/PageShell';
import DepositView from '@/components/dashboard/DepositView';
import { getDepositMethods } from '@/lib/wallet-addresses';

export default async function DepositPage() {
  const methods = await getDepositMethods()
  return (
    <PageShell title='Fund your account'>
      <DepositView methods={methods} />
    </PageShell>
  );
}
