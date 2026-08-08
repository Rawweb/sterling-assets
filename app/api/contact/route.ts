import { NextRequest } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { checkLimit, getIP, tooManyRequests } from '@/lib/rate-limit';


function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is too short'),
  message: z.string().min(10, 'Message is too short'),
  recaptchaToken: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
  // Per-IP limit: 5 submissions per hour.
  // The email this route sends goes through the same Resend account that
  // sends verification and password-reset mail — scripted abuse here risks
  // burning the send quota or tripping spam-complaint throttling on that
  // account, which would take down real auth flows too, not just flood support.
  const ip = getIP(req);
  const ipCheck = checkLimit(`contact:ip:${ip}`, 5, 60 * 60_000);
  if (ipCheck.limited) return tooManyRequests(ipCheck.retryAfterMs);
  const body = await req.json().catch(() => null);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Please fill in all required fields.' },
      { status: 400 },
    );
  }

  const { name, email, phone, subject, message, recaptchaToken } = parsed.data;

  // Verify reCAPTCHA before doing anything else.
  if (recaptchaToken) {
    const captchaOk = await verifyRecaptcha(recaptchaToken);
    if (!captchaOk) {
      return Response.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403 },
      );
    }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.MAIL_FROM ?? 'noreply@sterlingassetsholdings.com',
      to: 'support@sterlingassetsholdings.com',
      replyTo: email,
      subject: `Contact form: ${subject}`,
      html: `
        <h2 style="font-family:sans-serif;color:#0f1b2d;">New contact form submission</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:6px 16px 6px 0;color:#667085;font-weight:600;">Name</td><td>${esc(name)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#667085;font-weight:600;">Email</td><td>${esc(email)}</td></tr>
          ${phone ? `<tr><td style="padding:6px 16px 6px 0;color:#667085;font-weight:600;">Phone</td><td>${esc(phone)}</td></tr>` : ''}
          <tr><td style="padding:6px 16px 6px 0;color:#667085;font-weight:600;">Subject</td><td>${esc(subject)}</td></tr>
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #e6e9f0;"/>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#101828;">
          ${esc(message).replace(/\n/g, '<br/>')}
        </p>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[Contact] Email send failed:', err);
    return Response.json(
      { error: 'Failed to send your message. Please try again.' },
      { status: 500 },
    );
  }
}
