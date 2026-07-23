import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import AuthSplit from '@/components/auth/AuthSplit';
import Field from '@/components/auth/Field';
import PasswordField from '@/components/auth/PasswordField';

export default function LoginPage() {
  return (
    <AuthSplit>
      <div className='flex flex-col gap-4 rounded-xl border border-primary/30 p-8 shadow-lg md:border-0 md:p-0 md:shadow-none'>
        <div className='mb-2 text-center'>
          <h1 className='text-3xl font-bold'>Sign in</h1>
          <p className='mt-1 text-sm text-muted'>
            Enter your details to continue
          </p>
        </div>

        <form className='space-y-6'>
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
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99] active:bg-primary-press active:shadow-lg'
          >
            Sign in <ArrowRight size={16} />
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
