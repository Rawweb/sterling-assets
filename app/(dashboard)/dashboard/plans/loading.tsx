import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
      <div className='mb-5 grid gap-3.5 sm:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-[220px]' />
        ))}
      </div>
      <Skeleton className='h-[220px]' />
    </div>
  );
}
