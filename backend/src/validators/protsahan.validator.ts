import { z } from 'zod';

export const protsahanRegisterQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  dairyId: z.string().uuid().optional(),
});

export const protsahanActionSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  dairyId: z.string().uuid().optional(),
});
