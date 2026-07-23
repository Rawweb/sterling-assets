'use client';

import { ArrowRight, Mail, Phone, Ticket, User } from 'lucide-react';
import Link from 'next/link';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';
import PasswordField from '@/components/auth/PasswordField';
import { useState } from 'react';
import CountrySelect from '@/components/auth/CountrySelect';

export default function RegisterPage() {
  const [country, setCountry] = useState('');

  return (
    <AuthSplit>
      <div className='flex flex-col gap-4 rounded-xl border border-primary/30 p-8 shadow-lg md:border-0 md:p-0 md:shadow-none'>
        <div className='mb-2 text-center'>
          <h1 className='text-3xl font-bold'>Create account</h1>
          <p className='mt-1 text-sm text-muted'>It only takes a minute</p>
        </div>

        <form className='space-y-5'>
          <Field
            id='fullName'
            label='Full name'
            icon={User}
            placeholder='Enter full name'
            required
          />
          <Field
            id='email'
            label='Email address'
            icon={Mail}
            type='email'
            placeholder='name@example.com'
            required
          />
          <Field
            id='phone'
            label='Phone number'
            icon={Phone}
            type='tel'
            placeholder='Enter phone number'
            required
          />
          <PasswordField
            id='password'
            label='Password'
            placeholder='Create a password'
            required
          />
          <PasswordField
            id='confirmPassword'
            label='Confirm password'
            placeholder='Repeat password'
            required
          />

          <CountrySelect value={country} onChange={setCountry} />

          <Field
            id='referral'
            label='Referral ID'
            icon={Ticket}
            placeholder='Optional referral id'
          />

          <button
            type='submit'
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99] active:bg-primary-press active:shadow-lg'
          >
            Create account <ArrowRight size={16} />
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
