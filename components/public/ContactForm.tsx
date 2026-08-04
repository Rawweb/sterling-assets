'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

type Fields = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY: Fields = {
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
};

const inputClass =
  'w-full px-[14px] py-3 border border-line rounded-[10px] text-sm bg-bg ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-surface ' +
  'transition-colors duration-150';

export default function ContactForm() {
  const [form, setForm] = useState<Fields>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function set(key: keyof Fields, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture values synchronously before any await (e.currentTarget becomes
    // null after the first await).
    const payload = { ...form };
    setSubmitting(true);

    let token = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken: token }),
      });

      if (res.ok) {
        setSent(true);
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

  // Success state
  if (sent) {
    return (
      <div className='flex flex-col items-center justify-center text-center py-14 gap-4'>
        <div className='w-16 h-16 rounded-full bg-up/15 text-up flex items-center justify-center'>
          <Send size={26} />
        </div>
        <h3 className='text-xl font-semibold text-navy'>Message sent</h3>
        <p className='text-muted text-sm max-w-sm leading-relaxed'>
          Thanks for reaching out. Our support team will get back to you
          shortly.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm(EMPTY);
          }}
          className='text-primary text-sm font-semibold hover:underline'
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='cf-name' className='text-sm font-semibold text-text'>
            Name
          </label>
          <input
            id='cf-name'
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder='Your full name'
            required
            className={inputClass}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='cf-phone' className='text-sm font-semibold text-text'>
            Phone
          </label>
          <input
            id='cf-phone'
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder='Your phone number'
            type='tel'
            className={inputClass}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='cf-email' className='text-sm font-semibold text-text'>
            Email
          </label>
          <input
            id='cf-email'
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder='you@example.com'
            type='email'
            required
            className={inputClass}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='cf-subject'
            className='text-sm font-semibold text-text'
          >
            Subject
          </label>
          <input
            id='cf-subject'
            value={form.subject}
            onChange={(e) => set('subject', e.target.value)}
            placeholder='How can we help?'
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label htmlFor='cf-message' className='text-sm font-semibold text-text'>
          Message
        </label>
        <textarea
          id='cf-message'
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={5}
          placeholder='Write your message here...'
          required
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type='submit'
        disabled={submitting}
        className='flex items-center justify-center gap-2 bg-primary hover:bg-primary-press
                   text-on-navy text-sm font-semibold w-full py-3.5 rounded-[10px]
                   transition-colors duration-150 active:scale-[0.97]
                   disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {submitting ? 'Sending...' : 'Submit now'}
        {!submitting && <Send size={15} />}
      </button>
    </form>
  );
}
