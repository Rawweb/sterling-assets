// app/(auth)/register/page.tsx
'use client';

import { ArrowRight, Mail, Phone, Ticket, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';
import PasswordField from '@/components/auth/PasswordField';
import CountrySelect from '@/components/auth/CountrySelect';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();

  const [country, setCountry] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setFormError('');
    setFieldErrors({});

    // Grab every input that has a `name`, turn it into a plain object.
    const payload = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('Account created! Check your email to verify.');
        router.push('/verify-email');
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

          <Field
            id='referral'
            label='Referral ID'
            icon={Ticket}
            placeholder='Optional referral id'
            error={fieldErrors.referral?.[0]}
          />

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
