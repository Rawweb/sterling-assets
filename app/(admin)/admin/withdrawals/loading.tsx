import Skeleton from '@/components/ui/Skeleton';
import PageShell from '@/components/dashboard/PageShell';

export default function Loading() {
  return (
    <PageShell title='Withdrawals'>
      <div className='mb-6 flex gap-2 justify-between'>
        <Skeleton className='h-10 w-56 rounded-xl' />
        <Skeleton className='h-10 w-56 rounded-xl' />
        <Skeleton className='h-10 w-56 rounded-xl' />
        <Skeleton className='h-10 w-56 rounded-xl' />
      </div>

      <div className='space-y-3'>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className='h-14 w-full rounded-xl' />
        ))}
      </div>
    </PageShell>
  );
}
