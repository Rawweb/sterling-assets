'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

import FormField from '@/components/ui/FormField';
import FileDrop from '@/components/ui/FileDrop';
import { docTypes, type DocType } from '@/lib/dashboard-data';

const inputClass =
  'w-full rounded-xl border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary';

export default function KycView({
  status,
}: {
  status: 'none' | 'pending' | 'approved' | 'rejected';
}) {
  const [docType, setDocType] = useState<DocType>('national_id');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (status === 'approved') {
    return (
      <Result
        icon={<CheckCircle2 size={38} className='text-up' />}
        title='Identity verified'
        body='You are fully verified. Withdrawals are unlocked.'
      />
    );
  }

  if (status === 'pending') {
    return (
      <Result
        icon={<Clock size={38} className='text-primary' />}
        title='Verification under review'
        body='We are reviewing your documents. This usually takes a few minutes to a few hours. We will notify you.'
      />
    );
  }

  function onDocTypeChange(next: DocType) {
    setDocType(next);
    // A type with no back must not carry a stale back file into the payload.
    if (next === 'passport') setBackFile(null);
  }

  const rejected = status === 'rejected';
  const needsBack = docType !== 'passport';
  const canSubmit =
    frontFile !== null && (!needsBack || backFile !== null) && confirmed;

  return (
    <div className='mx-auto max-w-2xl'>
      <h2 className='text-center mb-2 text-2xl md:text-4xl'>
        Begin your ID-Verification
      </h2>
      <p className='mb-6 text-center text-sm text-muted'>
        To comply with regulation each participant will have to go through
        indentity verification (KYC/AML) to prevent fraud causes.
      </p>

      {rejected && (
        <div className='mb-5 flex gap-2.5 rounded-xl border border-down/40 bg-down/10 p-3.5'>
          <XCircle size={18} className='mt-0.5 shrink-0 text-down' />
          <p className='text-[13px]'>
            Your last submission was rejected. Check that your document is
            clear, uncropped, and not expired, then try again.
          </p>
        </div>
      )}

      <div className='rounded-[14px] border border-line p-5 sm:p-6'>
        {/* personal */}
        <h2 className='text-base font-semibold mb-2'>Personal details</h2>
        <p className='text-muted text-sm mb-2'>
          Your simple personal information required for identification
        </p>
        <div className='border-t  border-line'>
          <p className='mb-4 mt-0.5 text-[13px] text-muted pt-2'>
            Please type carefully and fill out the form with your personal
            details. Your can’t edit these details once you submitted the form.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='First name' htmlFor='fn' required>
            <input id='fn' className={inputClass} />
          </FormField>
          <FormField label='Last name' htmlFor='ln' required>
            <input id='ln' className={inputClass} />
          </FormField>
          <FormField label='Email' htmlFor='em' required>
            <input id='em' type='email' className={inputClass} />
          </FormField>
          <FormField label='Phone number' htmlFor='ph' required>
            <input
              id='ph'
              type='tel'
              inputMode='tel'
              placeholder='+234...'
              className={inputClass}
            />
          </FormField>
          <FormField label='Date of birth' htmlFor='dob' required>
            <input id='dob' type='date' className={inputClass} />
          </FormField>
        </div>

        <div className='my-6 h-px bg-line' />

        {/* address */}
        <h2 className='text-base font-semibold'>Your address</h2>
        <p className='mb-4 mt-0.5 text-[13px] text-muted'>
          Your simple location information required for identification
        </p>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='Address line' htmlFor='al' required>
            <input id='al' className={inputClass} />
          </FormField>
          <FormField label='City' htmlFor='ct' required>
            <input id='ct' className={inputClass} />
          </FormField>
          <FormField label='State' htmlFor='st' required>
            <input id='st' className={inputClass} />
          </FormField>
          <FormField label='Country' htmlFor='co' required>
            <input id='co' className={inputClass} />
          </FormField>
        </div>

        <div className='my-6 h-px bg-line' />

        {/* document */}
        <h2 className='text-base font-semibold'>Document upload</h2>
        <p className='mb-4 mt-0.5 text-[13px] text-muted'>
          Your simple personal document required for identification
        </p>

        <div
          role='radiogroup'
          aria-label='Document type'
          className='mb-5 grid gap-2.5 sm:grid-cols-3'
        >
          {docTypes.map((d) => {
            const active = d.id === docType;
            return (
              <label
                key={d.id}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border p-3.5 text-sm font-medium transition active:scale-[0.98] ${
                  active
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-line hover:border-primary/50'
                }`}
              >
                <input
                  type='radio'
                  name='doc-type'
                  value={d.id}
                  checked={active}
                  onChange={() => onDocTypeChange(d.id)}
                  className='peer sr-only'
                />
                <span>{d.label}</span>
                <span
                  className={`grid size-[18px] shrink-0 place-items-center rounded-full border-2 ${active ? 'border-primary' : 'border-line'} peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40`}
                >
                  {active && (
                    <span className='size-2 rounded-full bg-primary' />
                  )}
                </span>
              </label>
            );
          })}
        </div>
        <div>
          <h3 className='mb-2'>
            To avoid delays when verifying account, Please make sure your
            document meets the criteria below:
          </h3>
          <ul className='mb-5 space-y-1.5 text-[13px] text-muted list-disc pl-5'>
            <li>Your document must not be expired.</li>
            <li>
              The whole document must be visible, in focus, with no glare.
            </li>
            <li>Make sure that there is no light glare on the card.</li>
          </ul>
        </div>

        <div className='space-y-5'>
          <FileDrop
            id='kyc-front'
            label='Upload front side'
            file={frontFile}
            onChange={setFrontFile}
            hint='Front of your document, clear and uncropped'
          />
          {needsBack && (
            <FileDrop
              id='kyc-back'
              label='Upload back side'
              file={backFile}
              onChange={setBackFile}
              hint='Back of your document, clear and uncropped'
            />
          )}
        </div>

        <label className='mt-6 flex cursor-pointer items-start gap-2.5'>
          <input
            type='checkbox'
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className='mt-0.5 size-4 accent-primary'
          />
          <span className='text-sm'>
            All the information I have entered is correct.
          </span>
        </label>

        <button
          type='button'
          disabled={!canSubmit}
          className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'
        >
          Submit application
        </button>

        <p className='mt-3 text-center text-xs text-muted'>
          Your documents are stored privately and seen only by our verification
          team.
        </p>
      </div>
    </div>
  );
}

function Result({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className='mx-auto max-w-md rounded-[14px] border border-line px-5 py-10 text-center flex flex-col items-center'>
      {icon}
      <h2 className='mt-3.5 text-lg font-semibold'>{title}</h2>
      <p className='mx-auto mt-1.5 max-w-sm text-sm text-muted'>{body}</p>
    </div>
  );
}
