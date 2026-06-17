import { milkRepository } from '../repositories/milk.repository';
import { farmerRepository } from '../repositories/farmer.repository';
import { calculateProtsahanAmount, calculateTotalAmount } from './protsahan.service';
import { AppError } from '../utils/appError';
import { CreateMilkEntryInput } from '../validators/milk.validator';

export const milkService = {
  async recordEntry(dairyId: string, recordedById: string, input: CreateMilkEntryInput) {
    const farmer = await farmerRepository.findById(input.farmerId);
    if (!farmer || farmer.dairyId !== dairyId) {
      throw AppError.forbidden('This farmer does not belong to your dairy');
    }

    const existing = await milkRepository.findOneForFarmerAndDate(input.farmerId, input.collectionDate);
    if (existing) {
      throw AppError.conflict('An entry for this farmer on this date already exists');
    }

    const totalAmount = calculateTotalAmount(input.milkQuantityL, input.ratePerLitre);
    const { protsahanRate, protsahanAmount } = calculateProtsahanAmount(input.milkQuantityL, input.snf);

    return milkRepository.create({
      farmerId: input.farmerId,
      dairyId,
      collectionDate: input.collectionDate,
      milkQuantityL: input.milkQuantityL,
      fat: input.fat,
      snf: input.snf,
      ratePerLitre: input.ratePerLitre,
      totalAmount,
      protsahanRate,
      protsahanAmount,
      recordedById,
    });
  },

  async getDailyRegister(dairyId: string, date: Date) {
    const entries = await milkRepository.listByDairyAndDate(dairyId, date);

    const totals = entries.reduce(
      (
        acc: { totalMilk: number; totalAmount: number; totalProtsahan: number },
        entry: { milkQuantityL: unknown; totalAmount: unknown; protsahanAmount: unknown },
      ) => ({
        totalMilk: acc.totalMilk + Number(entry.milkQuantityL),
        totalAmount: acc.totalAmount + Number(entry.totalAmount),
        totalProtsahan: acc.totalProtsahan + Number(entry.protsahanAmount),
      }),
      { totalMilk: 0, totalAmount: 0, totalProtsahan: 0 },
    );

    return { entries, totals };
  },

  getFarmerHistory(farmerId: string, from?: Date, to?: Date) {
    return milkRepository.listByFarmer(farmerId, from, to);
  },
};
