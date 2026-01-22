import { z } from 'zod';

// Guardian Validation schema
export const GuardianLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Validation schema - Students use username, not email
export const StudentLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});