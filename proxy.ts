import { NextRequest, NextResponse } from 'next/server';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// CSRF defense: Sec-Fetch-Site (and, as a fallback for older browsers,
// Origin) are set by the browser itself and cannot be forged by page
// JavaScript. SameSite=Lax on the session cookie already blocks most
// cross-site POSTs, but relying on one cookie attribute as the only
// defense is fragile — this is the explicit server-side check OWASP
// recommends on top of it.
function isSameOriginRequest(req: NextRequest): boolean {
  const site = req.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none';

  const origin = req.headers.get('origin');
  if (origin) return origin === req.nextUrl.origin;

  // Neither header present — not a browser request we recognize.
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isApiRoute = pathname.startsWith('/api/');
  const isCronRoute = pathname.startsWith('/api/cron/');
  const isStateChanging = !SAFE_METHODS.has(req.method);

  if (
    isApiRoute &&
    !isCronRoute &&
    isStateChanging &&
    !isSameOriginRequest(req)
  ) {
    return NextResponse.json(
      { error: 'Cross-site request blocked.' },
      { status: 403 },
    );
  }

  const hasSession = req.cookies.has('session');
  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isProtected && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'],
};
