type SendMailArgs = {
  to: string;
  subject: string;
  html: string;
};

async function sendMail({ to, subject, html }: SendMailArgs) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: replace with the real Zoho transport.
    throw new Error('Mail transport not configured');
  }

  console.log('\n──────── EMAIL (dev) ────────');
  console.log('To:      ', to);
  console.log('Subject: ', subject);
  console.log(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
  console.log('─────────────────────────────\n');
}

export async function sendVerificationEmail(to: string, token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const link = `${base}/api/auth/verify?token=${token}`;

  await sendMail({
    to,
    subject: 'Verify your email',
    html: `
      <p>Welcome to Sterling Assets Holdings.</p>
      <p>Confirm your email address to activate your account:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
