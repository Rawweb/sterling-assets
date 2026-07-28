'use client';

import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';
import PasswordField from '@/components/auth/PasswordField';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setFormError('');

    const payload = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('Welcome back!');
        // Do not leave the sign-in page in the history stack. This keeps Back
        // navigation on authenticated pages from returning users to /login.
        router.replace(data.role === 'ADMIN' ? '/admin' : '/dashboard');
        return;
      }

      if (res.status === 403 && data.code === 'UNVERIFIED') {
        router.push('/verify-email');
        return;
      }

      setFormError(data.error ?? 'Something went wrong');
    } catch {
      setFormError('Could not reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplit>
      <div className='flex flex-col gap-4 rounded-xl border border-primary/30 p-8 shadow-lg md:border-0 md:p-0 md:shadow-none'>
        <div className='mb-2 text-center'>
          <h1 className='text-3xl font-bold'>Sign in</h1>
          <p className='mt-1 text-sm text-muted'>
            Enter your details to continue
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate className='space-y-6'>
          {formError && (
            <p className='rounded-lg border border-down/30 bg-down/10 px-3 py-2 text-sm text-down'>
              {formError}
            </p>
          )}

          <Field
            id='email'
            label='Email'
            icon={Mail}
            type='email'
            placeholder='name@example.com'
            required
          />
          <PasswordField
            id='password'
            label='Password'
            placeholder='Enter your password'
            required
          />

          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 text-muted'>
              <input
                name='remember'
                type='checkbox'
                className='size-4 accent-primary'
              />
              Remember me
            </label>
            <Link
              href='/forgot-password'
              className='text-primary hover:underline active:text-primary-press'
            >
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99] active:bg-primary-press active:shadow-lg disabled:cursor-not-allowed disabled:opacity-60'
          >
            {submitting ? 'Signing in...' : 'Sign in'}
            {!submitting && <ArrowRight size={16} />}
          </button>

          <p className='flex justify-center gap-2 text-sm'>
            Don&apos;t have an account?
            <Link
              href='/register'
              className='font-semibold text-primary hover:underline active:text-primary-press'
            >
              Sign up
            </Link>
          </p>

          <p className='text-center text-[10px] text-muted'>
            &copy; {new Date().getFullYear()} Sterling Assets Holdings. All
            rights reserved.
          </p>
        </form>
      </div>
    </AuthSplit>
  );
}
