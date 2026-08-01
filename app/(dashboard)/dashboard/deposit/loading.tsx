import PageShell from '@/components/dashboard/PageShell';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <PageShell title='Fund your account'>
      <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
        {/* stat cards */}
        <Skeleton className='mb-3.5 h-5 w-40' />
        <div className='mb-[26px] grid grid-cols-1 gap-3.5 sm:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-[104px]' />
          ))}
        </div>

        {/* amount */}
        <Skeleton className='mb-3.5 h-5 w-32' />
        <Skeleton className='mb-[26px] h-16 w-full' />

        {/* recent transaction */}
        <Skeleton className='mb-3.5 h-5 w-44' />
        <Skeleton className='h-[220px]' />
      </div>
    </PageShell>
  );
}
