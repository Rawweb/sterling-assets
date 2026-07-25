import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has('session');
  const { pathname } = req.nextUrl;

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
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
