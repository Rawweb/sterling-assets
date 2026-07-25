'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';

import Tabs from '@/components/ui/Tabs';
import FormField from '@/components/ui/FormField';
import PasswordField from '@/components/auth/PasswordField';
import type { Viewer } from '@/lib/viewer';

const TABS = ['Personal', 'Password', 'Notifications'] as const;
type Tab = (typeof TABS)[number];

const inputClass =
  'w-full rounded-xl border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary';

export default function ProfileView({ viewer }: { viewer: Viewer }) {
  const [tab, setTab] = useState<Tab>('Personal');

  return (
    <div className='mx-auto max-w-2xl'>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Personal' && <PersonalTab viewer={viewer} />}
      {tab === 'Password' && <PasswordTab />}
      {tab === 'Notifications' && <NotificationsTab />}
    </div>
  );
}

function PersonalTab({ viewer }: { viewer: Viewer }) {
  const initial = viewer.fullName.trim().charAt(0).toUpperCase();

  return (
    <div className='rounded-[14px] border border-line p-5 sm:p-6'>
      <div className='mb-6 flex items-center gap-3.5'>
        <div className='grid size-[52px] shrink-0 place-items-center rounded-full bg-bg text-lg font-semibold text-muted'>
          {viewer.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={viewer.avatarUrl}
              alt='Profile'
              className='size-[52px] rounded-full object-cover'
            />
          ) : (
            initial || <Camera size={20} />
          )}
        </div>
        <div>
          <p className='text-sm font-semibold'>Profile photo</p>
          <label className='cursor-pointer text-[13px] font-semibold text-primary hover:underline'>
            Upload a new photo
            <input
              type='file'
              accept='image/png,image/jpeg,image/webp'
              className='sr-only'
            />
          </label>
        </div>
      </div>

      <div className='mb-5 grid gap-4 sm:grid-cols-2'>
        <FormField label='Full name' htmlFor='fullName'>
          <input
            id='fullName'
            name='fullName'
            defaultValue={viewer.fullName}
            className={inputClass}
          />
        </FormField>
        <FormField label='Email address' htmlFor='email'>
          <input
            id='email'
            defaultValue={viewer.email}
            readOnly
            className={`${inputClass} bg-bg text-muted`}
          />
        </FormField>
        <FormField label='Phone number' htmlFor='phone'>
          <input
            id='phone'
            name='phone'
            type='tel'
            inputMode='tel'
            defaultValue={viewer.phone}
            className={inputClass}
          />
        </FormField>
        <FormField label='Date of birth' htmlFor='dob'>
          <input id='dob' name='dob' type='date' className={inputClass} />
        </FormField>
        <FormField label='Country' htmlFor='country'>
          <input
            id='country'
            defaultValue={viewer.country}
            readOnly
            className={`${inputClass} bg-bg text-muted`}
          />
        </FormField>
        <FormField label='Address' htmlFor='address'>
          <input
            id='address'
            name='address'
            placeholder='Full address'
            className={inputClass}
          />
        </FormField>
      </div>

      <button
        type='button'
        className='rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
      >
        Update profile
      </button>
    </div>
  );
}

function PasswordTab() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const current = String(data.get('current') ?? '');
    const next = String(data.get('next') ?? '');
    const confirm = String(data.get('confirm') ?? '');

    setDone(false);
    if (!current || !next || !confirm)
      return setError('Fill in all three fields.');
    if (next.length < 8)
      return setError('New password must be at least 8 characters.');
    if (next !== confirm)
      return setError('New password and confirmation do not match.');

    setError(null);
    setDone(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      className='rounded-[14px] border border-line p-5 sm:p-6'
    >
      <div className='mb-5 grid gap-4 sm:grid-cols-2'>
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
      </div>

      {error && <p className='mb-4 text-[13px] text-down'>{error}</p>}
      {done && (
        <p className='mb-4 text-[13px] text-up'>
          Password check passed. (Not saved, static page.)
        </p>
      )}

      <button
        type='submit'
        className='rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
      >
        Update password
      </button>
    </form>
  );
}

function NotificationsTab() {
  return (
    <div className='rounded-[14px] border border-line p-5 sm:p-6'>
      <div className='grid gap-6 sm:grid-cols-2'>
        <YesNo
          name='notif-otp'
          label='Send confirmation OTP to my email when withdrawing my funds.'
          defaultValue='yes'
        />
        <YesNo
          name='notif-profit'
          label='Send me email when i get profit.'
          defaultValue='yes'
        />
        <YesNo
          name='notif-expire'
          label='Send me email when my investment plan expires.'
          defaultValue='yes'
        />
      </div>

      <button
        type='button'
        className='mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
      >
        Save preferences
      </button>
    </div>
  );
}

function YesNo({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: 'yes' | 'no';
}) {
  return (
    <fieldset>
      <legend className='mb-2 text-sm text-muted'>{label}</legend>
      <div className='flex gap-5'>
        {(['yes', 'no'] as const).map((v) => (
          <label
            key={v}
            className='flex cursor-pointer items-center gap-2 text-sm'
          >
            <input
              type='radio'
              name={name}
              value={v}
              defaultChecked={v === defaultValue}
              className='size-4 accent-primary'
            />
            <span className='capitalize'>{v}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
