import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { cloudinary } from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB — matches client-side check

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  // Server-side validation — never trust client-side checks alone.
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Use PNG, JPG, or WebP.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 3 MB.' },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload server-side using API credentials.
    // public_id is pinned to the user so each user has exactly one avatar
    // file — overwrite + invalidate replaces the old one cleanly.
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'sterling-assets/avatars',
              public_id: `user_${user.id}`,
              overwrite: true,
              invalidate: true, // bust CDN cache on re-upload
              resource_type: 'image',
              allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            },
            (error, res) => {
              if (error || !res) {
                reject(error ?? new Error('Cloudinary upload failed'));
              } else {
                resolve(res as { secure_url: string });
              }
            },
          )
          .end(buffer);
      },
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: result.secure_url },
    });

    return NextResponse.json({ avatarUrl: result.secure_url });
  } catch (err) {
    console.error('[Avatar] Cloudinary upload failed:', err);
    return NextResponse.json(
      { error: 'Image upload failed. Please try again.' },
      { status: 500 },
    );
  }
}
