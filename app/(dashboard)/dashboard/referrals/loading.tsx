import PageShell from '@/components/dashboard/PageShell';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <PageShell title='Identity verification'>
      <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
        <div className='mb-5 grid gap-3.5 sm:grid-cols-3'>
          <Skeleton className='h-[76px]' />
          <Skeleton className='h-[76px]' />
          <Skeleton className='h-[76px]' />
        </div>
        <Skeleton className='mb-5 h-[140px]' />
        <Skeleton className='h-[300px]' />
      </div>
    </PageShell>
  );
}
