import 'server-only';
import { prisma } from './db';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing 0/O/1/I

function randomCode(length = 7): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

// generate a code guaranteed unique against existing users
export async function generateReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const existing = await prisma.user.findUnique({
      where: { referralCode: code },
    });
    if (!existing) return code;
  }
  throw new Error('Could not generate a unique referral code.');
}
