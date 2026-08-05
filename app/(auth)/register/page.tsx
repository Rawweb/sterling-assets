'use client';

import { Suspense, useRef, useState } from 'react';
import { ArrowRight, Mail, Phone, Ticket, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';
import PasswordField from '@/components/auth/PasswordField';
import CountrySelect from '@/components/auth/CountrySelect';
import Logo from '@/components/Logo';

// Reads the ?ref= query param to prefill the referral field. Isolated in
// its own component with its own Suspense boundary (Next.js's recommended
// pattern for useSearchParams) so the rest of the form still prerenders
// statically instead of the whole page bailing out to client-only rendering.
function ReferralField({ error }: { error?: string }) {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') ?? '';

  return (
    <Field
      id='referral'
      label='Referral ID'
      icon={Ticket}
      placeholder='Optional referral id'
      defaultValue={ref}
      error={error}
    />
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [country, setCountry] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitting(true);
    setFormError('');
    setFieldErrors({});

    let recaptchaToken = '';
    try {
      if (recaptchaRef.current) {
        recaptchaToken = (await recaptchaRef.current.executeAsync()) ?? '';
        recaptchaRef.current.reset();
      }
    } catch {
      setFormError('Security check failed. Please refresh and try again.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('Account created! Check your email to verify.');
        router.replace('/verify-email');
        return;
      }

      if (res.status === 400) {
        setFieldErrors(data.fields ?? {});
        setFormError(data.error ?? 'Please check the form');
      } else {
        setFormError(data.error ?? 'Something went wrong');
      }
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
          <h1 className='text-3xl font-bold'>Create account</h1>
          <p className='mt-1 text-sm text-muted'>It only takes a minute</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5' noValidate>
          {formError && (
            <p className='rounded-lg border border-down/30 bg-down/10 px-3 py-2 text-sm text-down'>
              {formError}
            </p>
          )}

          <Field
            id='fullName'
            label='Full name'
            icon={User}
            placeholder='Enter full name'
            required
            error={fieldErrors.fullName?.[0]}
          />
          <Field
            id='email'
            label='Email address'
            icon={Mail}
            type='email'
            placeholder='name@example.com'
            required
            error={fieldErrors.email?.[0]}
          />
          <Field
            id='phone'
            label='Phone number'
            icon={Phone}
            type='tel'
            placeholder='Enter phone number'
            required
            error={fieldErrors.phone?.[0]}
          />
          <PasswordField
            id='password'
            label='Password'
            placeholder='Create a password'
            required
            error={fieldErrors.password?.[0]}
          />
          <PasswordField
            id='confirmPassword'
            label='Confirm password'
            placeholder='Repeat password'
            required
            error={fieldErrors.confirmPassword?.[0]}
          />

          <CountrySelect
            value={country}
            onChange={setCountry}
            error={fieldErrors.country?.[0]}
          />

          <Suspense
            fallback={
              <Field
                id='referral'
                label='Referral ID'
                icon={Ticket}
                placeholder='Optional referral id'
                error={fieldErrors.referral?.[0]}
              />
            }
          >
            <ReferralField error={fieldErrors.referral?.[0]} />
          </Suspense>

          {/* v2 Invisible — no visible UI unless a challenge is triggered */}
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
            {submitting ? 'Creating account...' : 'Create account'}
            {!submitting && <ArrowRight size={16} />}
          </button>

          <p className='flex justify-center gap-2 text-sm'>
            Already have an account?
            <Link
              href='/login'
              className='font-semibold text-primary hover:underline active:text-primary-press'
            >
              Log in
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
