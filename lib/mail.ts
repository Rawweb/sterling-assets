// lib/mail.ts
import { Resend } from 'resend';
import VerificationEmail from '@/emails/VerificationEmail';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

export async function sendVerificationEmail(
  to: string,
  token: string,
  fullName?: string,
) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const link = `${base}/api/auth/verify?token=${token}`;

  // Still print the link locally. Saves opening an inbox on every test run,
  // and shows you the exact URL if a send fails.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔗 Verification link for ${to}:\n${link}\n`);
  }

  const { data, error } = await getResend().emails.send({
    from: process.env.MAIL_FROM!,
    to,
    subject: 'Confirm your email',
    react: VerificationEmail({ link, fullName }),
  });

  if (error) {
    // Log the real reason, then rethrow so the caller decides what to do.
    console.error('Resend failed:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
}
