'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';

type Props = {
  name: string;
  email: string;
};

const inputClass =
  'w-full px-[14px] py-2.5 border border-line rounded-xl text-sm bg-bg ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 ' +
  'focus:bg-surface transition-colors duration-150';

export default function SupportView({ name, email }: Props) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture values before any await — e.currentTarget goes null after first await.
    const payload = { name, email, subject, message };
    setSubmitting(true);

    let token = '';
    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha('dashboard_support');
      } catch {
        // reCAPTCHA failure is non-fatal from within an authenticated session.
      }
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken: token }),
      });

      if (res.ok) {
        setSent(true);
        toast.success('Message sent. Our team will respond shortly.');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Could not reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className='flex flex-col items-center gap-3 py-10 text-center'>
        <div className='w-14 h-14 rounded-full bg-up/15 text-up flex items-center justify-center'>
          <Send size={22} />
        </div>
        <p className='font-semibold text-text'>Message sent</p>
        <p className='text-sm text-muted max-w-sm'>
          We have received your message and will respond to{' '}
          <span className='font-medium text-text'>{email}</span> within 24
          hours.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setSubject('');
            setMessage('');
          }}
          className='text-primary text-sm font-semibold hover:underline mt-1'
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-4'>
      {/* Read-only pre-filled fields */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-xs font-semibold text-muted uppercase tracking-wide'>
            Name
          </label>
          <input
            value={name}
            readOnly
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <label className='text-xs font-semibold text-muted uppercase tracking-wide'>
            Email
          </label>
          <input
            value={email}
            readOnly
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
        </div>
      </div>

      {/* Subject */}
      <div className='flex flex-col gap-1.5'>
        <label
          htmlFor='ds-subject'
          className='text-xs font-semibold text-muted uppercase tracking-wide'
        >
          Subject
        </label>
        <input
          id='ds-subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder='What do you need help with?'
          required
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div className='flex flex-col gap-1.5'>
        <label
          htmlFor='ds-message'
          className='text-xs font-semibold text-muted uppercase tracking-wide'
        >
          Message
        </label>
        <textarea
          id='ds-message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder='Describe your issue or question in detail...'
          required
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type='submit'
        disabled={submitting}
        className='flex items-center justify-center gap-2 bg-primary hover:bg-primary-press
                   text-surface text-sm font-semibold w-full py-3 rounded-xl
                   transition-colors duration-150 active:scale-[0.97]
                   disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {submitting ? 'Sending...' : 'Send message'}
        {!submitting && <Send size={15} />}
      </button>
    </form>
  );
}
