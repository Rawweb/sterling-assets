import 'server-only';
import { prisma } from './db';

export async function getAdminKyc() {
  return prisma.kycSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      documentType: true,
      documentFrontUrl: true,
      documentBackUrl: true,
      dateOfBirth: true,
      city: true,
      country: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export type AdminKycSubmission = Awaited<
  ReturnType<typeof getAdminKyc>
>[number];
