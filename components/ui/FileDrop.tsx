'use client';

import { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';

type Props = {
  id: string;
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  hint?: string;
};

export default function FileDrop({
  id,
  label,
  file,
  onChange,
  hint = 'PNG or JPG, up to 5MB',
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (!picked) return;

    if (!['image/png', 'image/jpeg'].includes(picked.type)) {
      setError('Only PNG or JPG files are allowed.');
      onChange(null);
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      setError('That file is larger than 5MB.');
      onChange(null);
      return;
    }
    setError(null);
    onChange(picked);
  }

  return (
    <div>
      <p className='mb-1.5 text-sm font-medium'>{label}</p>

      {file && preview ? (
        <div className='rounded-xl border border-line p-3.5'>
          <div className='flex items-start gap-3.5'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`${label} preview`}
              className='size-20 shrink-0 rounded-lg border border-line object-cover'
            />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{file.name}</p>
              <p className='mt-0.5 text-xs text-muted'>
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type='button'
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              className='grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:text-down active:scale-95'
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <label className='flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line px-4 py-8 text-center transition hover:border-primary active:scale-[0.99]'>
          <Upload size={22} className='text-muted' />
          <span className='text-sm font-medium'>Choose a file</span>
          <span className='text-xs text-muted'>{hint}</span>
          <input
            id={id}
            type='file'
            accept='image/png,image/jpeg'
            onChange={onPick}
            className='sr-only'
          />
        </label>
      )}

      {error && <p className='mt-1.5 text-[13px] text-down'>{error}</p>}
    </div>
  );
}
