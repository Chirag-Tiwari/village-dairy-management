import { z } from 'zod';

export const createMilkEntrySchema = z.object({
  farmerId: z.string().uuid('Invalid farmer'),
  collectionDate: z.coerce.date(),
  milkQuantityL: z.coerce.number().positive('Milk quantity must be greater than 0').max(500),
  fat: z.coerce.number().min(0).max(15),
  snf: z.coerce.number().min(0).max(15),
  ratePerLitre: z.coerce.number().positive('Rate per litre must be greater than 0'),
});

export type CreateMilkEntryInput = z.infer<typeof createMilkEntrySchema>;

export const listMilkQuerySchema = z.object({
  date: z.coerce.date().optional(),
  farmerId: z.string().uuid().optional(),
});
