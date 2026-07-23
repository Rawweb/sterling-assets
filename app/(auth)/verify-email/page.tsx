// app/(auth)/verify-email/page.tsx
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import Logo from '@/components/Logo';
import ResendButton from '@/components/auth/ResendButton';
import { getPendingEmail } from '@/lib/session';
import { getResendCooldown } from '@/lib/token';

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const BANNERS = {
  invalid: {
    text: 'That verification link is not valid. Request a new one below.',
    tone: 'bad',
  },
  expired: {
    text: 'That verification link has expired. Request a new one below.',
    tone: 'bad',
  },
  default: {
    text: 'Registration successful. We sent a verification link to your email.',
    tone: 'good',
  },
} as const;

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  const email = await getPendingEmail();
  const cooldown = await getResendCooldown(email);

  const banner =
    status === 'invalid'
      ? BANNERS.invalid
      : status === 'expired'
        ? BANNERS.expired
        : BANNERS.default;

  const isBad = banner.tone === 'bad';

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 py-10'>
      <div className='mb-2'>
        <Logo size={40} withWordmark />
      </div>

      <div
        className={`flex max-w-lg items-center gap-2 rounded-xl border px-4 py-3 text-center text-sm ${
          isBad
            ? 'border-down/30 bg-down/10 text-down'
            : 'border-up/30 bg-up/10 text-up'
        }`}
      >
        {isBad ? (
          <AlertCircle size={18} className='shrink-0' />
        ) : (
          <CheckCircle2 size={18} className='shrink-0' />
        )}
        {banner.text}
      </div>

      <div className='w-full max-w-md rounded-2xl border border-line bg-surface p-9 text-center shadow-xl'>
        <div className='mx-auto mb-5 grid size-19 place-items-center rounded-full bg-primary/10 text-primary'>
          <Mail size={30} />
        </div>

        <h1 className='text-2xl font-bold'>Check your inbox</h1>
        <p className='mx-auto mt-2 mb-6 max-w-xs text-sm leading-relaxed text-muted'>
          Click the link in the email to activate your account. It may take a
          minute to arrive.
        </p>

        <ResendButton initialCooldown={cooldown} />

        <div className='mt-6 flex flex-col gap-1 border-t border-line pt-5 text-xs text-muted'>
          <p>
            Already verified?{' '}
            <Link
              href='/login'
              className='font-semibold text-primary hover:underline'
            >
              Log in
            </Link>
          </p>
          <p>
            Wrong email address?{' '}
            <Link
              href='/register'
              className='font-semibold text-primary hover:underline'
            >
              Sign up again
            </Link>
          </p>
        </div>
      </div>

      <p className='text-center text-[10px] text-muted'>
        &copy; {new Date().getFullYear()} Sterling Assets Holdings. All rights
        reserved.
      </p>
    </main>
  );
}
 