import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

const DOC_TYPES = ['national_id', 'passport', 'drivers_license'];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // block if already verified or awaiting review
  if (user.kycStatus === 'APPROVED') {
    return NextResponse.json(
      { error: 'You are already verified.' },
      { status: 409 },
    );
  }
  if (user.kycStatus === 'PENDING') {
    return NextResponse.json(
      { error: 'You already have a submission under review.' },
      { status: 409 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const {
    documentType,
    documentFrontUrl,
    documentBackUrl,
    phone,
    dateOfBirth,
    addressLine,
    city,
    state,
    country,
  } = body as Record<string, unknown>;

  // validate
  if (typeof documentType !== 'string' || !DOC_TYPES.includes(documentType)) {
    return NextResponse.json(
      { error: 'Invalid document type.' },
      { status: 400 },
    );
  }
  if (typeof documentFrontUrl !== 'string' || documentFrontUrl.trim() === '') {
    return NextResponse.json(
      { error: 'Front document is required.' },
      { status: 400 },
    );
  }
  // back required unless passport
  const needsBack = documentType !== 'passport';
  if (
    needsBack &&
    (typeof documentBackUrl !== 'string' || documentBackUrl.trim() === '')
  ) {
    return NextResponse.json(
      { error: 'Back document is required.' },
      { status: 400 },
    );
  }

  const requiredStrings = {
    phone,
    dateOfBirth,
    addressLine,
    city,
    state,
    country,
  };
  for (const [field, value] of Object.entries(requiredStrings)) {
    if (typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json(
        { error: `${field} is required.` },
        { status: 400 },
      );
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // create the submission
      await tx.kycSubmission.create({
        data: {
          userId: user.id,
          documentType,
          documentFrontUrl: documentFrontUrl.trim(),
          documentBackUrl: needsBack
            ? (documentBackUrl as string).trim()
            : null,
          dateOfBirth: (dateOfBirth as string).trim(),
          addressLine: (addressLine as string).trim(),
          city: (city as string).trim(),
          state: (state as string).trim(),
          country: (country as string).trim(),
          status: 'PENDING',
        },
      });

      // update User: phone/country, and flip status to PENDING
      await tx.user.update({
        where: { id: user.id },
        data: {
          phone: (phone as string).trim(),
          country: (country as string).trim(),
          kycStatus: 'PENDING',
        },
      });
    });

    return NextResponse.json({ submitted: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Could not submit verification. Please try again.' },
      { status: 500 },
    );
  }
}
