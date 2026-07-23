import { NextRequest } from 'next/server';
import { consumeVerificationToken } from '@/lib/token'

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

  return Response.redirect(`${base}/login?verified=1`);
}
