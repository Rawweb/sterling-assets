// app/api/auth/resend-verification/route.ts
import { prisma } from '@/lib/db';
import { getPendingEmail } from '@/lib/session';
import { createVerificationToken, RESEND_COOLDOWN_SECONDS } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';


export async function POST() {
  const email = await getPendingEmail();

  if (!email) {
    return Response.json(
      { error: 'We could not identify your account. Please log in again.' },
      { status: 400 },
    );
  }

  const genericOk = Response.json({
    ok: true,
    message: 'A new verification link is on its way to your inbox.',
  });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user || user.emailVerified) return genericOk;

    const lastToken = await prisma.verificationToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    if (lastToken) {
      const secondsSince = (Date.now() - lastToken.createdAt.getTime()) / 1000;
      if (secondsSince < RESEND_COOLDOWN_SECONDS) {
        // retryAfter is a NUMBER so the client can drive its countdown from it.
        const retryAfter = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSince);
        return Response.json(
          { error: 'Please wait before requesting another link.', retryAfter },
          { status: 429 },
        );
      }
    }

    const token = await createVerificationToken(user.id);
    await sendVerificationEmail(user.email, token);

    return genericOk;
  } catch (error) {
    console.error('Resend verification failed:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
