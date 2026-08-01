import Skeleton from '@/components/ui/Skeleton';
import PageShell from '@/components/dashboard/PageShell';

export default function Loading() {
  return (
    <PageShell title='Audit log'>
      <div className='space-y-3'>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className='h-14 w-full rounded-xl' />
        ))}
      </div>
    </PageShell>
  );
}
