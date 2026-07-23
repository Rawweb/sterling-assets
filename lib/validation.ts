import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address' }));

const password = z
  .string()
  .min(8, { error: 'Password must be at least 8 characters' })
  .max(72, { error: 'Password is too long' })
//   .regex(/[0-9]/, { error: 'Password must contain at least one number' });

// ── Register ─────────────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { error: 'Enter your full name' })
      .max(80, { error: 'Name is too long' }),

    email,

    phone: z
      .string()
      .trim()
      .min(7, { error: 'Enter a valid phone number' })
      .max(20, { error: 'Enter a valid phone number' }),

    password,

    confirmPassword: z.string(),

    country: z.string().trim().min(1, { error: 'Select your country' }),

    referral: z
      .string()
      .trim()
      .max(40)
      .optional()
      .transform((r) => (r === '' ? undefined : r)),
  })
  // Cross-field rule: runs only after every field above passes.
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Enter your password' }),
  remember: z.boolean().optional(),
});

// ── Types generated from the schemas ─────────────────────────────────────────
// One source of truth: change the schema, the type changes with it.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
