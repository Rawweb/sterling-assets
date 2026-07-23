// components/auth/ResendButton.tsx
'use client';

import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

const COOLDOWN = 60;

export default function ResendButton({
  initialCooldown = 0,
}: {
  initialCooldown?: number;
}) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initialCooldown);

  // Ticks the countdown down once a second.
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);


    return () => clearInterval(timer);
  }, [secondsLeft]);

  async function handleResend() {
    setSending(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message ?? 'Verification link sent.');
        setSecondsLeft(COOLDOWN);
      } else {
        setMessage(data.error ?? 'Something went wrong');
        setIsError(true);
        // Server is the authority on the cooldown. If it says wait, obey it.
        if (typeof data.retryAfter === 'number') {
          setSecondsLeft(data.retryAfter);
        }
      }
    } catch {
      setMessage('Could not reach the server. Check your connection.');
      setIsError(true);
    } finally {
      setSending(false);
    }
  }

  const waiting = secondsLeft > 0;
  const disabled = sending || waiting;

  return (
    <>
      <button
        type='button'
        onClick={handleResend}
        disabled={disabled}
        className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-surface transition hover:bg-primary-press active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
      >
        <RefreshCw size={16} className={sending ? 'animate-spin' : ''} />
        {sending
          ? 'Sending...'
          : waiting
            ? `Resend available in ${secondsLeft}s`
            : 'Resend verification email'}
      </button>

      {message && (
        <p
          className={`mt-3 text-sm ${isError ? 'text-down' : 'text-up'}`}
          role='status'
        >
          {message}
        </p>
      )}
    </>
  );
}
