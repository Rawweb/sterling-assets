import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

type FieldProps = {
  id: string;
  label: string;
  name?: string;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
};

export default function Field({
  id,
  label,
  name = id,
  icon: Icon,
  type = 'text',
  placeholder,
  required = false,
  error,
  children,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className='mb-1.5 block text-sm font-semibold text-text'
      >
        {label} {required && <span className='text-down'>*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-lg border bg-surface px-3 focus-within:ring-1 ${
          error
            ? 'border-down focus-within:border-down focus-within:ring-down/12'
            : 'border-line focus-within:border-primary focus-within:ring-primary/12'
        }`}
      >
        <Icon size={16} className='shrink-0 text-muted' />
        {children ?? (
          <input
            name={name}
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            className='min-w-0 flex-1 bg-transparent py-3 text-sm outline-none'
          />
        )}
      </div>

      {error && <p className='mt-1 text-xs text-down'>{error}</p>}
    </div>
  );
}
