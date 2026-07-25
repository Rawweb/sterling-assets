'use client';

import { useState } from 'react';
import PasswordField from '@/components/auth/PasswordField';

export default function PasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const current = String(data.get('current') ?? '');
    const next = String(data.get('next') ?? '');
    const confirm = String(data.get('confirm') ?? '');

    setDone(false);

    if (!current || !next || !confirm) {
      setError('Fill in all three fields.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New password and confirmation do not match.');
      return;
    }

    setError(null);
    setDone(true);
    // real submit posts to the change-password endpoint here
  }

  return (
    <section className='rounded-[14px] border border-line p-5 sm:p-6'>
      <h2 className='text-base font-semibold'>Change password</h2>
      <p className='mb-4 mt-0.5 text-[13px] text-muted'>
        Use at least 8 characters. You will stay signed in on this device.
      </p>

      <form onSubmit={onSubmit} className='grid gap-4 sm:max-w-md'>
        <PasswordField
          id='current'
          name='current'
          label='Current password'
          required
        />
        <PasswordField id='next' name='next' label='New password' required />
        <PasswordField
          id='confirm'
          name='confirm'
          label='Confirm new password'
          required
        />

        {error && <p className='text-[13px] text-down'>{error}</p>}
        {done && (
          <p className='text-[13px] text-up'>
            Password check passed. (Not saved yet, static page.)
          </p>
        )}

        <div className='flex justify-end'>
          <button
            type='submit'
            className='rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
          >
            Update password
          </button>
        </div>
      </form>
    </section>
  );
}
