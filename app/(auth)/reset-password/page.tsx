'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AuthSplit from '@/components/auth/AuthSplit';
import PasswordField from '@/components/auth/PasswordField';

// useSearchParams() must be inside a Suspense boundary in Next.js App Router.
// The outer component provides the boundary; ResetForm does the real work.

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') ?? '';

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // No token in the URL means the user navigated here directly or the link is broken.
  if (!token) {
    return (
      <AuthSplit>
        <div className='flex flex-col items-center gap-4 rounded-xl border border-primary/30 p-8 text-center shadow-lg md:border-0 md:p-0 md:shadow-none'>
          <p className='text-sm text-muted'>
            This reset link is missing or invalid. Please request a new one.
          </p>
          <Link
            href='/forgot-password'
            className='text-sm font-semibold text-primary hover:underline active:text-primary-press'
          >
            Request a new link
          </Link>
        </div>
      </AuthSplit>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const data = new FormData(e.currentTarget);
    const password = String(data.get('password') ?? '');
    const confirm = String(data.get('confirm') ?? '');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(resData.error ?? 'Something went wrong. Please try again.');
        return;
      }

      toast.success('Password updated. You can now sign in.');
      router.push('/login');
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplit>
      <div className='flex flex-col gap-4 rounded-xl border border-primary/30 p-8 shadow-lg md:border-0 md:p-0 md:shadow-none'>
        <Link
          href='/login'
          className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline active:text-primary-press'
        >
          <ArrowLeft size={15} /> Back to sign in
        </Link>

        <div className='mb-2 text-center'>
          <h1 className='text-3xl font-bold'>Set new password</h1>
          <p className='mt-1 text-sm text-muted'>
            Choose a strong password you have not used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-5'>
          <PasswordField
            id='password'
            name='password'
            label='New password'
            placeholder='At least 8 characters'
            required
          />
          <PasswordField
            id='confirm'
            name='confirm'
            label='Confirm password'
            placeholder='Repeat your password'
            required
          />

          {error && (
            <div className='rounded-lg border border-down/30 bg-down/10 px-3 py-2'>
              <p className='text-sm text-down'>{error}</p>
              {error.includes('expired') && (
                <Link
                  href='/forgot-password'
                  className='mt-1 block text-sm font-semibold text-primary hover:underline'
                >
                  Request a new link
                </Link>
              )}
            </div>
          )}

          <button
            type='submit'
            disabled={submitting}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99] active:bg-primary-press disabled:cursor-not-allowed disabled:opacity-60'
          >
            {submitting ? 'Updating...' : 'Update password'}
          </button>

          <p className='text-center text-[10px] text-muted'>
            &copy; {new Date().getFullYear()} Sterling Assets Holdings. All
            rights reserved.
          </p>
        </form>
      </div>
    </AuthSplit>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
