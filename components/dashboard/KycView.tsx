'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Copy, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import FormField from '@/components/ui/FormField';
import FileDrop from '@/components/ui/FileDrop';
import { docTypes, type DocType } from '@/lib/dashboard-data';

const inputClass =
  'w-full rounded-xl border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary';

// Upload a single file to R2 via the presign endpoint.
// Returns the R2 key to store in the database.
async function uploadFile(file: File, uploadType: string): Promise<string> {
  const presignRes = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, uploadType }),
  });

  if (!presignRes.ok) {
    const d = await presignRes.json().catch(() => ({}));
    throw new Error(d.error ?? 'Failed to get upload URL.');
  }

  const { uploadUrl, key } = await presignRes.json();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('Failed to upload file to storage.');

  return key;
}

export default function KycView({
  status,
  initialPhone = '',
  initialCountry = '',
}: {
  status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  initialPhone?: string;
  initialCountry?: string;
}) {
  const router = useRouter();
  const [docType, setDocType] = useState<DocType>('national_id');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fields, setFields] = useState({
    phone: initialPhone,
    dateOfBirth: '',
    addressLine: '',
    city: '',
    state: '',
    country: initialCountry,
  });

  function setField(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  if (status === 'APPROVED') {
    return (
      <Result
        icon={<CheckCircle2 size={38} className='text-up' />}
        title='Identity verified'
        body='You are fully verified. Withdrawals are unlocked.'
      />
    );
  }

  if (status === 'PENDING') {
    return (
      <Result
        icon={<Clock size={38} className='text-primary' />}
        title='Verification under review'
        body='We are reviewing your documents. This usually takes a few minutes to a few hours. We will notify you.'
      />
    );
  }

  if (status === 'NONE' && !showForm) {
    return (
      <div className='mx-auto flex max-w-md flex-col items-center rounded-[14px] border border-line px-5 py-10 text-center'>
        <div className='grid size-16 place-items-center rounded-full bg-bg'>
          <Copy size={30} className='text-muted' />
        </div>
        <p className='mt-4 max-w-sm text-sm text-muted'>
          You have not submitted your documents to verify your identity. To use
          the investment system, please verify your identity.
        </p>
        <button
          type='button'
          onClick={() => setShowForm(true)}
          className='mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
        >
          Click here to complete your KYC
        </button>
      </div>
    );
  }

  function onDocTypeChange(next: DocType) {
    setDocType(next);
    if (next === 'passport') setBackFile(null);
  }

  const rejected = status === 'REJECTED';
  const needsBack = docType !== 'passport';

  const fieldsComplete = Object.values(fields).every(
    (v) => v.trim().length > 0,
  );
  const canSubmit =
    frontFile !== null &&
    (!needsBack || backFile !== null) &&
    confirmed &&
    fieldsComplete &&
    !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      // Upload documents to R2 first. Both uploads happen before
      // we touch the database so a failed upload doesn't leave a
      // partial KYC record.
      const frontKey = await uploadFile(frontFile!, 'kyc-front');

      let backKey: string | null = null;
      if (needsBack && backFile) {
        backKey = await uploadFile(backFile, 'kyc-back');
      }

      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          documentFrontUrl: frontKey,
          documentBackUrl: backKey,
          phone: fields.phone.trim(),
          dateOfBirth: fields.dateOfBirth.trim(),
          addressLine: fields.addressLine.trim(),
          city: fields.city.trim(),
          state: fields.state.trim(),
          country: fields.country.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      toast.success('Application submitted! We will review it shortly.');
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Network error. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <h2 className='mb-2 text-center text-2xl md:text-4xl'>
        Begin your ID-Verification
      </h2>
      <p className='mb-6 text-center text-sm text-muted'>
        To comply with regulation each participant will have to go through
        identity verification (KYC/AML) to prevent fraud.
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
        {/* Personal details */}
        <h2 className='mb-2 text-base font-semibold'>Personal details</h2>
        <p className='mb-4 mt-0.5 text-[13px] text-muted'>
          Please fill in your personal details exactly as they appear on your
          document. You cannot edit these after submission.
        </p>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='Phone number' htmlFor='ph' required>
            <input
              id='ph'
              type='tel'
              inputMode='tel'
              placeholder='+234...'
              value={fields.phone}
              onChange={setField('phone')}
              className={inputClass}
            />
          </FormField>
          <FormField label='Date of birth' htmlFor='dob' required>
            <input
              id='dob'
              type='date'
              value={fields.dateOfBirth}
              onChange={setField('dateOfBirth')}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className='my-6 h-px bg-line' />

        {/* Address */}
        <h2 className='text-base font-semibold'>Your address</h2>
        <p className='mb-4 mt-0.5 text-[13px] text-muted'>
          Enter the address that appears on your government-issued document.
        </p>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='Address line' htmlFor='al' required>
            <input
              id='al'
              value={fields.addressLine}
              onChange={setField('addressLine')}
              className={inputClass}
            />
          </FormField>
          <FormField label='City' htmlFor='ct' required>
            <input
              id='ct'
              value={fields.city}
              onChange={setField('city')}
              className={inputClass}
            />
          </FormField>
          <FormField label='State' htmlFor='st' required>
            <input
              id='st'
              value={fields.state}
              onChange={setField('state')}
              className={inputClass}
            />
          </FormField>
          <FormField label='Country' htmlFor='co' required>
            <input
              id='co'
              value={fields.country}
              onChange={setField('country')}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className='my-6 h-px bg-line' />

        {/* Document upload */}
        <h2 className='text-base font-semibold'>Document upload</h2>
        <p className='mb-4 mt-0.5 text-[13px] text-muted'>
          Upload clear photos of your government-issued identity document.
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

        <ul className='mb-5 list-disc space-y-1.5 pl-5 text-[13px] text-muted'>
          <li>Your document must not be expired.</li>
          <li>The whole document must be visible, in focus, with no glare.</li>
          <li>Make sure there is no light glare on the card.</li>
        </ul>

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
          onClick={handleSubmit}
          disabled={!canSubmit}
          className='mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'
        >
          {submitting ? 'Uploading and submitting...' : 'Submit application'}
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
    <div className='mx-auto flex max-w-md flex-col items-center rounded-[14px] border border-line px-5 py-10 text-center'>
      {icon}
      <h2 className='mt-3.5 text-lg font-semibold'>{title}</h2>
      <p className='mx-auto mt-1.5 max-w-sm text-sm text-muted'>{body}</p>
    </div>
  );
}
