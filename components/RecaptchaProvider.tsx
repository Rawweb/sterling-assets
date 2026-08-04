'use client';

/**
 * reCAPTCHA v2 Invisible does not need a global context provider.
 * Each form renders its own <ReCAPTCHA> component and holds its own ref.
 * This component is kept as a passthrough so the root layout does not
 * need to be changed.
 */
export default function RecaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
