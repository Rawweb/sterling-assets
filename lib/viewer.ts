import 'server-only';
import { getCurrentUser } from './session';

export type Viewer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  kycStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
  avatarUrl: string | null;
  emailVerified: boolean;
};

export async function getViewer(): Promise<Viewer | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!user.emailVerified) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? '',
    country: user.country ?? '',
    kycStatus: user.kycStatus,
    role: user.role,
    avatarUrl: user.avatarUrl,
    emailVerified: !!user.emailVerified,
  };
}
