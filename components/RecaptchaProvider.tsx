'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Thin client wrapper around GoogleReCaptchaProvider.
// The root layout is a server component so it cannot use the provider
// directly — this wrapper lets it embed a client component safely.
export default function RecaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // If the site key is not configured (e.g. local dev without .env.local),
  // render children without reCAPTCHA so the app still works.
  if (!siteKey) return <>{children}</>;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
