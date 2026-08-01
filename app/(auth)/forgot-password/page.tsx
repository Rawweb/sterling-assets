'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';

export default function ForgotPasswordPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   const formData = Object.fromEntries(new FormData(e.currentTarget));
   setSubmitting(true);

   if (!executeRecaptcha) {
     toast.error('Security check not ready. Please try again.');
     setSubmitting(false);
     return;
   }

   // Step 1: reCAPTCHA separately.
   let recaptchaToken = '';
   try {
     recaptchaToken = await executeRecaptcha('forgot_password');
   } catch {
     toast.error('Security check failed. Please refresh and try again.');
     setSubmitting(false);
     return;
   }

   // Step 2: fetch separately.
   try {
     const payload = { ...formData, recaptchaToken };

     await fetch('/api/auth/forgot-password', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(payload),
     });

     setSent(true);
   } catch {
     toast.error('Could not reach the server. Check your connection.');
   } finally {
     setSubmitting(false);
   }
 }

  if (sent) {
    return (
      <AuthSplit>
        <div className='flex flex-col items-center gap-4 rounded-xl border border-primary/30 p-8 text-center shadow-lg md:border-0 md:p-0 md:shadow-none'>
          <div className='grid size-14 place-items-center rounded-full bg-up/12'>
            <Check size={28} className='text-up' />
          </div>
          <h1 className='text-2xl font-bold'>Check your email</h1>
          <p className='max-w-sm text-sm text-muted'>
            If that email is registered, a reset link is on its way. Check your
            spam folder if it does not arrive within a few minutes.
          </p>
          <Link
            href='/login'
            className='mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline active:text-primary-press'
          >
            <ArrowLeft size={15} /> Back to sign in
          </Link>
        </div>
      </AuthSplit>
    );
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
          <h1 className='text-3xl font-bold'>Forgot password?</h1>
          <p className='mt-1 text-sm text-muted'>
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-5'>
          <Field
            id='email'
            label='Email address'
            icon={Mail}
            type='email'
            placeholder='name@example.com'
            required
          />

          <button
            type='submit'
            disabled={submitting}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99] active:bg-primary-press disabled:cursor-not-allowed disabled:opacity-60'
          >
            {submitting ? 'Sending...' : 'Send reset link'}
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
