import { z } from 'zod';

export const milkEntrySchema = z.object({
  farmerId: z.string().min(1, 'Select a farmer'),
  milkQuantityL: z.coerce.number().positive('Must be greater than 0').max(500),
  fat: z.coerce.number().min(0, 'Cannot be negative').max(15, 'Unrealistically high'),
  snf: z.coerce.number().min(0, 'Cannot be negative').max(15, 'Unrealistically high'),
  ratePerLitre: z.coerce.number().positive('Must be greater than 0'),
});

export type MilkEntryFormValues = z.infer<typeof milkEntrySchema>;

// Mirrors the backend's protsahan.service.ts so the form can show a live
// preview before submitting. The backend remains the source of truth and
// recalculates independently -- this is purely a UX convenience.
export function previewProtsahan(milkQuantityL: number, snf: number) {
  let rate = 0;
  if (snf > 8.0) rate = 4;
  else if (snf >= 7.5 && snf <= 7.99) rate = 3;

  return { rate, amount: Math.round(milkQuantityL * rate * 100) / 100 };
}
