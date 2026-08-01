import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';
import Logo from '@/components/Logo';

export default function NotFound() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center '>
      <div className='mb-8'>
        <Logo size={44} withWordmark />
      </div>

      <div className='mb-6 grid size-20 place-items-center rounded-full bg-primary/10 text-primary'>
        <SearchX size={34} />
      </div>

      <p className='font-mono text-sm tracking-widest text-muted'>ERROR 404</p>
      <h1 className='mt-3 text-3xl font-bold'>Page not found</h1>
      <p className='mt-2 max-w-sm text-sm text-muted'>
        The page you are looking for does not exist, or it may have been moved.
      </p>

      <Link
        href='/'
        className='mt-8 flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99]'
      >
        <Home size={16} />
        Back to home
      </Link>
    </main>
  );
}