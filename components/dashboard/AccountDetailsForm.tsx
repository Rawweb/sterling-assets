'use client';

import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import CountrySelect from '@/components/auth/CountrySelect';
import type { Viewer } from '@/lib/viewer';

const inputClass =
  'w-full rounded-xl border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary';

export default function AccountDetailsForm({ viewer }: { viewer: Viewer }) {
  const [country, setCountry] = useState(viewer.country);

  return (
    <section className='rounded-[14px] border border-line p-5 sm:p-6'>
      <h2 className='text-base font-semibold'>Account details</h2>
      <p className='mb-4 mt-0.5 text-[13px] text-muted'>
        Keep your contact information up to date.
      </p>

      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField label='Full name' htmlFor='fullName' required>
          <input
            id='fullName'
            name='fullName'
            defaultValue={viewer.fullName}
            className={inputClass}
          />
        </FormField>

        <FormField label='Email' htmlFor='email'>
          <input
            id='email'
            defaultValue={viewer.email}
            readOnly
            className={`${inputClass} bg-bg text-muted`}
          />
        </FormField>

        <FormField label='Phone number' htmlFor='phone' required>
          <input
            id='phone'
            name='phone'
            type='tel'
            inputMode='tel'
            defaultValue={viewer.phone}
            className={inputClass}
          />
        </FormField>

        <CountrySelect value={country} onChange={setCountry} />
      </div>

      <div className='mt-5 flex justify-end'>
        <button
          type='button'
          className='rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
        >
          Save changes
        </button>
      </div>
    </section>
  );
}
