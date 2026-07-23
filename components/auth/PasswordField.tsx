'use client';

import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type PasswordFieldProps = {
  id: string;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
};

export default function PasswordField({
  id,
  label,
  name =id,
  placeholder,
  required = false,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className='mb-1.5 block text-sm font-semibold text-text'
      >
        {label} {required && <span className='text-down'>*</span>}
      </label>

      <div className='flex items-center gap-2 rounded-lg border border-line bg-surface px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/12'>
        <Lock size={16} className='shrink-0 text-muted' />
        <input
          name={name}
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          className='min-w-0 flex-1 bg-transparent py-3 text-sm outline-none'
        />
        <button
          type='button'
          onClick={() => setShow((p) => !p)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className='shrink-0 text-muted'
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
