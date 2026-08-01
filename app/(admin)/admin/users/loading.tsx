import PageShell from '@/components/dashboard/PageShell';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <PageShell title='Users'>
      <div className='mb-6 flex gap-2 justify-between'>
        <Skeleton className='h-10 w-72 rounded-xl' />
        <Skeleton className='h-10 w-72 rounded-xl' />
        <Skeleton className='h-10 w-72 rounded-xl' />
      </div>
      <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
        <Skeleton className='h-[400px]' />
      </div>
    </PageShell>
  );
}
