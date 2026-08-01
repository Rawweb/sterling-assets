import Skeleton from '@/components/ui/Skeleton';
import PageShell from '@/components/dashboard/PageShell';

export default function ProfileLoading() {
  return (
    <PageShell title='Your profile'>
      {/* Tabs */}
      <div className='mb-6 flex gap-2'>
        <Skeleton className='h-10 w-28 rounded-xl' />
        <Skeleton className='h-10 w-28 rounded-xl' />
        <Skeleton className='h-10 w-28 rounded-xl' />
      </div>

      {/* Profile picture section */}
      <div className='mb-6 border-b border-line pb-6'>
        <Skeleton className='mb-1 h-5 w-32' />
        <Skeleton className='mb-4 h-4 w-64' />

        <div className='flex items-center gap-5'>
          {/* Avatar circle */}
          <Skeleton className='size-20 shrink-0 rounded-full' />
          {/* Text beside avatar */}
          <Skeleton className='h-4 w-40' />
        </div>
      </div>

      {/* Form fields */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='space-y-1.5'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-11 w-full rounded-xl' />
          </div>
        ))}
      </div>

      {/* Button */}
      <Skeleton className='mt-5 h-11 w-36 rounded-xl' />
    </PageShell>
  );
}
