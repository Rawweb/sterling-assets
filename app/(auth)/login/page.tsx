'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';
import PasswordField from '@/components/auth/PasswordField';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture form data synchronously before any await.
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitting(true);
    setFormError('');

    // Execute v2 Invisible captcha.
    // executeAsync() resolves immediately when Google is confident,
    // or shows a challenge popup first if needed.
    let recaptchaToken = '';
    try {
      if (recaptchaRef.current) {
        recaptchaToken = (await recaptchaRef.current.executeAsync()) ?? '';
        recaptchaRef.current.reset(); // must reset so next submit gets a fresh token
      }
    } catch {
      setFormError('Security check failed. Please refresh and try again.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('Welcome back!');
        router.refresh();
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
          <div className='flex justify-center mb-3 md:hidden'>
            <Link href='/'>
              <Logo withWordmark size={36} />
            </Link>
          </div>
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

          {/* v2 Invisible — renders no visible UI unless a challenge is needed */}
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <ReCAPTCHA
              ref={recaptchaRef}
              size='invisible'
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          )}

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
