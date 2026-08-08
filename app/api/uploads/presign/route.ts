import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { createPresignedUploadUrl } from '@/lib/r2';
import { randomBytes } from 'crypto';
import { checkLimit, tooManyRequests } from '@/lib/rate-limit';

// Only these MIME types are accepted for any upload.
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — generous for a phone photo or scanned PDF

type UploadType = 'deposit-proof' | 'kyc-front' | 'kyc-back';

const UPLOAD_TYPES: UploadType[] = ['deposit-proof', 'kyc-front', 'kyc-back'];

function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  return map[contentType] ?? 'bin';
}

function buildKey(userId: string, uploadType: UploadType, ext: string): string {
  const ts = Date.now();
  const rand = randomBytes(8).toString('hex');

  switch (uploadType) {
    case 'deposit-proof':
      return `deposits/${userId}/${ts}-${rand}.${ext}`;
    case 'kyc-front':
      return `kyc/${userId}/${ts}-front.${ext}`;
    case 'kyc-back':
      return `kyc/${userId}/${ts}-back.${ext}`;
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // Per-user limit: 20 presign requests per hour.
  const limit = checkLimit(`presign:user:${user.id}`, 20, 60 * 60_000);
  if (limit.limited) return tooManyRequests(limit.retryAfterMs);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const { contentType, uploadType, contentLength } = body as Record<
    string,
    unknown
  >;

  if (typeof contentType !== 'string' || !ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
  }

  if (
    typeof uploadType !== 'string' ||
    !UPLOAD_TYPES.includes(uploadType as UploadType)
  ) {
    return NextResponse.json(
      { error: 'Invalid upload type.' },
      { status: 400 },
    );
  }

  if (
    typeof contentLength !== 'number' ||
    !Number.isInteger(contentLength) ||
    contentLength <= 0 ||
    contentLength > MAX_BYTES
  ) {
    return NextResponse.json(
      { error: 'File size must be between 1 byte and 10 MB.' },
      { status: 400 },
    );
  }

  const ext = getExtension(contentType);
  const key = buildKey(user.id, uploadType as UploadType, ext);

  try {
    const uploadUrl = await createPresignedUploadUrl({
      key,
      contentType,
      contentLength,
    });

    return NextResponse.json({ uploadUrl, key });
  } catch {
    return NextResponse.json(
      { error: 'Could not generate upload URL. Please try again.' },
      { status: 500 },
    );
  }
}
