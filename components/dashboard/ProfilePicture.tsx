'use client';

import { useEffect, useState } from 'react';
import { Camera, User } from 'lucide-react';

export default function ProfilePicture({
  fullName,
  avatarUrl,
}: {
  fullName: string;
  avatarUrl: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
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

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(picked.type)) {
      setError('Use a PNG, JPG, or WebP image.');
      return;
    }
    if (picked.size > 3 * 1024 * 1024) {
      setError('That image is larger than 3MB.');
      return;
    }
    setError(null);
    setFile(picked);
  }

  const shown = preview ?? avatarUrl;
  const initial = fullName.trim().charAt(0).toUpperCase();

  return (
    <section className='rounded-[14px] border border-line p-5 sm:p-6'>
      <h2 className='text-base font-semibold'>Profile picture</h2>
      <p className='mb-4 mt-0.5 text-[13px] text-muted'>
        Shown on your dashboard. Square images look best.
      </p>

      <div className='flex items-center gap-5'>
        <div className='relative size-20 shrink-0'>
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shown}
              alt='Profile'
              className='size-20 rounded-full border border-line object-cover'
            />
          ) : (
            <div className='grid size-20 place-items-center rounded-full bg-primary/12 text-2xl font-semibold text-primary'>
              {initial || <User size={28} />}
            </div>
          )}

          <label className='absolute -bottom-1 -right-1 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-surface bg-primary text-surface transition hover:bg-primary-press active:scale-95'>
            <Camera size={15} />
            <input
              type='file'
              accept='image/png,image/jpeg,image/webp'
              onChange={onPick}
              className='sr-only'
            />
          </label>
        </div>

        <div className='min-w-0'>
          {file ? (
            <>
              <p className='truncate text-sm font-medium'>{file.name}</p>
              <div className='mt-2 flex gap-2'>
                <button
                  type='button'
                  className='rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
                >
                  Save picture
                </button>
                <button
                  type='button'
                  onClick={() => setFile(null)}
                  className='rounded-lg border border-line px-3.5 py-2 text-[13px] font-semibold transition hover:border-primary hover:text-primary active:scale-[0.97]'
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className='text-[13px] text-muted'>
              PNG, JPG, or WebP. Up to 3MB.
            </p>
          )}
          {error && <p className='mt-1.5 text-[13px] text-down'>{error}</p>}
        </div>
      </div>
    </section>
  );
}
