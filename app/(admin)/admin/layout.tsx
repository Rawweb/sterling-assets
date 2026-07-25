import { redirect } from 'next/navigation';
import { getViewer } from '@/lib/viewer';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');
  if (viewer.role !== 'ADMIN') redirect('/dashboard');

  return <>{children}</>;
}
