import { z } from 'zod';

export const monthlyRegisterQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  dairyId: z.string().uuid().optional(),
});

export const monthlyActionSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  dairyId: z.string().uuid().optional(),
});

export type MonthlyActionInput = z.infer<typeof monthlyActionSchema>;
