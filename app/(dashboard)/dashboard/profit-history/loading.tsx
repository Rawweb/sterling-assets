import PageShell from '@/components/dashboard/PageShell';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <PageShell title='Your ROI history'>
      <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
        <Skeleton className='mb-4 h-[52px]' />
        <Skeleton className='h-[360px]' />
      </div>
    </PageShell>
  );
}
