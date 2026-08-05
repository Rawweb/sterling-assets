import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.t.
 *
 * CSP note: 'unsafe-inline' on script-src and style-src is required by
 * Next.js (inline hydration scripts, CSS-in-JS). Removing it would break
 * the app. The other directives still provide meaningful protection.
 *
 * Tune the CSP as third-party services are added or removed.
 */
const securityHeaders = [
  // Prevents clickjacking — stops other sites from embedding this app in an iframe.
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Prevents MIME-type sniffing — browser must respect the declared content-type.
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Forces HTTPS for 1 year. Only takes effect on HTTPS responses (safe to ship always).
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // Sends only origin (no path/query) as referrer on cross-origin requests.
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disables browser features this app does not use.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Content Security Policy.
  // Sources allowed per directive:
  //   script-src  — Next.js inline scripts + Google Translate (incl. translate-pa API) + reCAPTCHA v2
  //   style-src   — Next.js inline styles + Google Translate's injected stylesheet
  //   font-src    — self + data URIs (next/font embeds fonts as data URIs)
  //   img-src     — self + Cloudinary avatars + Unsplash CDN + CoinTelegraph RSS images + Google (translate icons/logos)
  //   connect-src — self + Google APIs (translate, translate-pa, recaptcha) + R2 direct upload (deposit proof / KYC docs)
  //   frame-src   — Google Maps embed (contact page) + reCAPTCHA v2 iframe
  //   worker-src  — Next.js service worker
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV !== 'production' ? "'unsafe-eval' " : ''}https://www.google.com https://www.gstatic.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com`,
      "style-src 'self' 'unsafe-inline' https://www.gstatic.com",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://s3-images.ctmedia.io https://www.google.com https://www.gstatic.com https://fonts.gstatic.com https://translate.googleapis.com",
      `connect-src 'self' https://www.google.com https://translate.googleapis.com https://translate.google.com https://translate-pa.googleapis.com https://${process.env.R2_BUCKET_NAME ?? 'sterling-assets'}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      "frame-src 'self' https://www.google.com https://maps.google.com https://recaptcha.google.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to every route.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
