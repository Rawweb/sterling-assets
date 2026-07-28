import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className='mx-auto max-w-shell px-4 py-6 sm:px-[22px] space-y-2.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className='h-[88px]' />
      ))}
    </div>
  );
}
