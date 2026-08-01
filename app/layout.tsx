import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import RecaptchaProvider from '@/components/RecaptchaProvider';

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});
const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});
const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sterlingassetsholdings.com'),
  title: {
    default: 'Sterling Assets Holdings',
    template: '%s | Sterling Assets Holdings',
  },
  description: 'Sterling Assets Holdings investment platform.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Sterling Assets Holdings',
    description: 'Investment platform.',
    url: 'https://sterlingassetsholdings.com',
    siteName: 'Sterling Assets Holdings',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <RecaptchaProvider>
          {children}
          <Toaster position='top-right' richColors duration={4000} />
        </RecaptchaProvider>
      </body>
    </html>
  );
}
