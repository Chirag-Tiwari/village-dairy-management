import { z } from 'zod';

export const createFarmerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short'),
  mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  village: z.string().trim().min(2, 'Village is required'),
  category: z.enum(['GEN', 'SC', 'ST']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateFarmerInput = z.infer<typeof createFarmerSchema>;

export const updateFarmerSchema = z.object({
  name: z.string().trim().min(2).optional(),
  mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/).optional(),
  village: z.string().trim().min(2).optional(),
  category: z.enum(['GEN', 'SC', 'ST']).optional(),
});

export type UpdateFarmerInput = z.infer<typeof updateFarmerSchema>;
