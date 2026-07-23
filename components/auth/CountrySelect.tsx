'use client';
import { Listbox } from '@headlessui/react';
import { ChevronDown, Globe } from 'lucide-react';
import countries from 'world-countries';

const COUNTRY_NAMES = countries
  .map((c) => c.name.common)
  .sort((a, b) => a.localeCompare(b));

type CountrySelectProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function CountrySelect({
  value,
  error,
  onChange,
}: CountrySelectProps) {
  return (
    <div>
      <label className='mb-1.5 block text-sm font-semibold text-text'>
        Country <span className='text-down'>*</span>
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className='relative'>
          <Listbox.Button className='flex w-full items-center gap-2 rounded-lg border border-line bg-surface px-3 py-3 text-left text-sm data-[open]:border-primary data-[open]:ring-1 data-[open]:ring-primary/12'>
            <Globe size={16} className='shrink-0 text-muted' />
            <span className={`flex-1 ${value ? 'text-text' : 'text-muted'}`}>
              {value || 'Choose country'}
            </span>
            <ChevronDown size={16} className='shrink-0 text-muted' />
          </Listbox.Button>
          <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-surface py-1 text-sm shadow-lg focus:outline-none'>
            {COUNTRY_NAMES.map((c) => (
              <Listbox.Option
                key={c}
                value={c}
                aria-invalid={!!error}
                className='cursor-pointer px-3 py-2 data-[focus]:bg-primary/10 data-[selected]:font-semibold data-[selected]:text-primary'
              >
                {c}
              </Listbox.Option>
            ))}
          </Listbox.Options>
          {error && <p className='mt-1 text-xs text-down'>{error}</p>}
        </div>
      </Listbox>

      <input type='hidden' name='country' value={value} />
    </div>
  );
}
