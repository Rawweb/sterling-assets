import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/session';
import { createPresignedGetUrl } from '@/lib/r2';

// Admin-only endpoint. Generates a short-lived presigned GET URL for a
// private R2 object and redirects the browser to it. The file itself
// is never served through your server — only the redirect URL is.
export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const key = req.nextUrl.searchParams.get('key');
  if (!key || key.trim() === '') {
    return NextResponse.json({ error: 'Missing file key.' }, { status: 400 });
  }

  try {
    const url = await createPresignedGetUrl({ key: key.trim() });
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.json(
      { error: 'Could not generate view URL.' },
      { status: 500 },
    );
  }
}
