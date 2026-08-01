import PageShell from '@/components/dashboard/PageShell';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <PageShell title='My investment plans'>
      <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
        <div className='mb-5 grid gap-3.5 sm:grid-cols-3'>
          <Skeleton className='h-[76px]' />
          <Skeleton className='h-[76px]' />
          <Skeleton className='h-[76px]' />
        </div>
        <Skeleton className='mb-4 h-10 w-64' />
        <div className='grid gap-3.5 sm:grid-cols-2'>
          <Skeleton className='h-[200px]' />
          <Skeleton className='h-[200px]' />
        </div>
      </div>
    </PageShell>
  );
}
