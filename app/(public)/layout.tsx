import type { ReactNode } from 'react';
import { getViewer } from '@/lib/viewer';
import LogoPreloader from '@/components/public/LogoPreloader';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Lightweight — reads the session cookie and returns null if unverified.
  const viewer = await getViewer();

  return (
    <>
      {/* First-visit only logo preloader — mounts on client, checks sessionStorage. */}
      <LogoPreloader />

      {/* Fixed navbar — needs auth state to swap Login↔Dashboard. */}
      <PublicNavbar
        isAuthenticated={!!viewer}
        userRole={viewer?.role as 'USER' | 'ADMIN' | undefined}
      />

      {/*
        No padding-top here. The home-page hero and inner-page banners each
        manage their own top padding (140-150px) to sit below the fixed navbar.
      */}
      <main className='flex-1'>{children}</main>

      <PublicFooter />
    </>
  );
}
