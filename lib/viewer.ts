import 'server-only';
import { demoUser, summary } from './dashboard-data';

export type Viewer = {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  avatarUrl: string | null;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  balanceCents: number;
};

export async function getViewer(): Promise<Viewer> {
  return {
    fullName: demoUser.fullName,
    email: demoUser.email,
    country: demoUser.country,
    phone: demoUser.phone,
    avatarUrl: demoUser.avatarUrl,
    kycStatus: demoUser.kycStatus,
    balanceCents: summary.balanceCents,
  };
}