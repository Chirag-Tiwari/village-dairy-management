// Pure calculation logic for protsahan (incentive) rate and amount.
// Kept isolated from I/O so it's trivial to unit test and reused by both
// the milk collection service and the protsahan ledger aggregation.

export function calculateProtsahanRate(snf: number): number {
  if (snf > 8.0) return 4;
  if (snf >= 7.5 && snf <= 7.99) return 3;
  return 0;
}

export function calculateProtsahanAmount(milkQuantityL: number, snf: number): {
  protsahanRate: number;
  protsahanAmount: number;
} {
  const protsahanRate = calculateProtsahanRate(snf);
  const protsahanAmount = round2(milkQuantityL * protsahanRate);
  return { protsahanRate, protsahanAmount };
}

export function calculateTotalAmount(milkQuantityL: number, ratePerLitre: number): number {
  return round2(milkQuantityL * ratePerLitre);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
