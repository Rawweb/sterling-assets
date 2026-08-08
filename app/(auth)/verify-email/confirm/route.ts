import { NextRequest } from 'next/server';
import { consumeVerificationToken } from '@/lib/token';
import { createSession } from '@/lib/session';
import { prisma } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/mail';

const WELCOME_TITLE = 'Welcome to Sterling Assets Holdings';

const WELCOME_BODY = `We're delighted to have you join our growing community of investors.

Your account is verified and ready. Here's how to get started: make a deposit, choose an investment plan, and let your money work for you.

Our team is committed to giving you a secure, transparent, and rewarding experience. If you need any help getting started, our support team is always available.

Welcome aboard. We look forward to supporting your investment journey.`;

function getBaseUrl(req: NextRequest) {
  // Behind Render's proxy, req.nextUrl.origin resolves to the internal
  // localhost:10000 bind address, not the public URL.
  return (
    process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const base = getBaseUrl(req);

  if (!token) {
    return Response.redirect(`${base}/verify-email?status=invalid`);
  }

  const result = await consumeVerificationToken(token);

  if (!result.ok) {
    return Response.redirect(`${base}/verify-email?status=${result.reason}`);
  }

  // Create an authenticated session so the user lands on /dashboard
  // already logged in, without having to enter credentials again.
  try {
    await createSession(result.userId);
  } catch {
    // Session creation failed but the email IS verified.
    // Fall back to login so the user can sign in with their verified account.
    return Response.redirect(`${base}/login?verified=1`);
  }

  // Send welcome notification + email in parallel. Both are best-effort;
  // a failure here must never block the redirect or break the session.
  try {
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, email: true, fullName: true },
    });

    if (user) {
      await Promise.all([
        prisma.notification.create({
          data: {
            userId: user.id,
            type: 'WELCOME',
            title: WELCOME_TITLE,
            body: WELCOME_BODY,
          },
        }),
        sendNotificationEmail(
          user.email,
          WELCOME_TITLE, // title  (maps to email subject)
          WELCOME_BODY, // message (maps to email body)
          user.fullName, // fullName (optional, used in greeting)
        ),
      ]);
    }
  } catch {
    // best-effort; session is already set, redirect proceeds regardless
  }

  return Response.redirect(`${base}/dashboard`);
}
