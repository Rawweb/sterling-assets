'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Tabs from '@/components/ui/Tabs';
import FormField from '@/components/ui/FormField';
import PasswordField from '@/components/auth/PasswordField';
import ProfilePicture from '@/components/dashboard/ProfilePicture';
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
      {tab === 'Notifications' && <NotificationsTab viewer={viewer} />}
    </div>
  );
}

function PersonalTab({ viewer }: { viewer: Viewer }) {
  const router = useRouter();

  const [fullName, setFullName] = useState(viewer.fullName);
  const [phone, setPhone] = useState(viewer.phone);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({
          ok: false,
          text: data.error ?? 'Could not save your profile.',
        });
        return;
      }
      setMsg({ ok: true, text: 'Profile updated.' });
      router.refresh();
    } catch {
      setMsg({ ok: false, text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* name / phone form card */}
      <div className='rounded-[14px] border border-line p-5 sm:p-6'>
        {/* profile picture */}
        <ProfilePicture
          fullName={viewer.fullName}
          avatarUrl={viewer.avatarUrl}
        />
        <div className='mb-5 grid gap-4 sm:grid-cols-2'>
          <FormField label='Full name' htmlFor='fullName'>
            <input
              id='fullName'
              name='fullName'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label='Country' htmlFor='country'>
            <input
              id='country'
              defaultValue={viewer.country}
              readOnly
              className={`${inputClass} bg-bg text-muted`}
            />
          </FormField>
        </div>

        <button
          type='button'
          onClick={save}
          disabled={saving}
          className='rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50'
        >
          {saving ? 'Saving...' : 'Update profile'}
        </button>

        {msg && (
          <p className={`mt-3 text-[13px] ${msg.ok ? 'text-up' : 'text-down'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}

function PasswordTab() {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const current = String(data.get('current') ?? '');
    const next = String(data.get('next') ?? '');
    const confirm = String(data.get('confirm') ?? '');

    setError(null);

    if (!current || !next || !confirm)
      return setError('Fill in all three fields.');
    if (next.length < 8)
      return setError('New password must be at least 8 characters.');
    if (next !== confirm)
      return setError('New password and confirmation do not match.');

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, next }),
      });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error ?? 'Could not change password.');
        return;
      }
      form.reset();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
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
      <button
        type='submit'
        disabled={saving}
        className='rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:opacity-50'
      >
        {saving ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}

function NotificationsTab({ viewer }: { viewer: Viewer }) {
  const [notifyWithdrawal, setW] = useState(viewer.notifyWithdrawal);
  const [notifyProfit, setP] = useState(viewer.notifyProfit);
  const [notifyPlanExpiry, setE] = useState(viewer.notifyPlanExpiry);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notifyWithdrawal,
          notifyProfit,
          notifyPlanExpiry,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({
          ok: false,
          text: data.error ?? 'Could not save preferences.',
        });
        return;
      }
      setMsg({ ok: true, text: 'Preferences saved.' });
    } catch {
      setMsg({ ok: false, text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='rounded-[14px] border border-line p-5 sm:p-6'>
      <div className='grid gap-6 sm:grid-cols-2'>
        <YesNo
          label='Notify me by email when I withdraw funds.'
          value={notifyWithdrawal}
          onChange={setW}
        />
        <YesNo
          label='Notify me when I earn profit.'
          value={notifyProfit}
          onChange={setP}
        />
        <YesNo
          label='Notify me when my investment plan completes.'
          value={notifyPlanExpiry}
          onChange={setE}
        />
      </div>

      <button
        type='button'
        onClick={save}
        disabled={saving}
        className='mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:opacity-50'
      >
        {saving ? 'Saving...' : 'Save preferences'}
      </button>

      {msg && (
        <p className={`mt-3 text-[13px] ${msg.ok ? 'text-up' : 'text-down'}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <fieldset>
      <legend className='mb-2 text-sm text-muted'>{label}</legend>
      <div className='flex gap-5'>
        {([true, false] as const).map((v) => (
          <label
            key={String(v)}
            className='flex cursor-pointer items-center gap-2 text-sm'
          >
            <input
              type='radio'
              checked={value === v}
              onChange={() => onChange(v)}
              className='size-4 accent-primary'
            />
            <span>{v ? 'Yes' : 'No'}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
