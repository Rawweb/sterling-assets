import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px]'>
      <Skeleton className='mb-4 h-10 w-full max-w-md' />
      <Skeleton className='h-[400px]' />
    </div>
  );
}
