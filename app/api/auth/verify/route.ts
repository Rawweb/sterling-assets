import { NextRequest } from 'next/server';
import { consumeVerificationToken } from '@/lib/token';
import { prisma } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/mail';

const welcomeBody = `We're delighted to have you join our growing community of investors.

Your account is verified and ready. Here's how to get started: make a deposit, choose an investment plan, and let your money work for you.

Our team is committed to giving you a secure, transparent, and rewarding experience. If you need any help getting started, our support team is always available.

Welcome aboard. We look forward to supporting your investment journey.`;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const base = req.nextUrl.origin;

  if (!token) {
    return Response.redirect(`${base}/verify-email?status=invalid`);
  }

  const result = await consumeVerificationToken(token);

  if (!result.ok) {
    return Response.redirect(`${base}/verify-email?status=${result.reason}`);
  }

  // email verified — send welcome in-app + email, best-effort
  try {
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, email: true, fullName: true },
    });
    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'WELCOME',
          title: 'Welcome to Sterling Assets Holdings',
          body: welcomeBody,
        },
      });
      await sendNotificationEmail(
        user.email,
        user.fullName,
        'Welcome to Sterling Assets Holdings',
        welcomeBody,
      );
    }
  } catch {
    // best-effort; never block the redirect
  }

  return Response.redirect(`${base}/login?verified=1`);
}
