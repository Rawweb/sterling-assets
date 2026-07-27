// lib/mail.ts
import { Resend } from 'resend';
import VerificationEmail from '@/emails/VerificationEmail';
import NotificationEmail from '@/emails/NotificationEmail';

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
    console.error('Resend failed:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
}

export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  fullName?: string,
) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n📧 Notification email for ${to}: ${title}\n`);
  }

  const { error } = await getResend().emails.send({
    from: process.env.MAIL_FROM!,
    to,
    subject: title,
    react: NotificationEmail({ title, message, fullName }),
  });

  if (error) {
    console.error('Notification email failed:', error);
    // do NOT throw — email is best-effort, the action already succeeded
  }
}
