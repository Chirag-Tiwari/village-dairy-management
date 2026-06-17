import { farmerRepository } from '../repositories/farmer.repository';
import { protsahanRepository } from '../repositories/protsahan.repository';
import { buildRegisterMatrix } from '../utils/registerMatrix.util';
import { AppError } from '../utils/appError';

export const protsahanLedgerService = {
  async getRegister(dairyId: string, year: number, month: number) {
    const farmers = await farmerRepository.listByDairy(dairyId);
    const entries = await protsahanRepository.getProtsahanAmountsForMonth(dairyId, year, month);

    const matrix = buildRegisterMatrix(
      farmers.map((f: { id: string; name: string }) => ({ id: f.id, name: f.name })),
      entries.map((e: { farmerId: string; collectionDate: Date; protsahanAmount: unknown }) => ({
        farmerId: e.farmerId,
        collectionDate: e.collectionDate,
        amount: Number(e.protsahanAmount),
      })),
      year,
      month,
    );

    const ledgerEntries = await protsahanRepository.listLedgerForDairyMonth(dairyId, year, month);
    const statusCounts = ledgerEntries.reduce(
      (acc: Record<string, number>, entry: { status: string }) => {
        acc[entry.status] = (acc[entry.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { ...matrix, statusCounts };
  },

  async approveMonth(dairyId: string, year: number, month: number, approvedById: string) {
    const result = await protsahanRepository.approveForDairyMonth(dairyId, year, month, approvedById);
    if (result.count === 0) {
      throw AppError.badRequest('No pending protsahan entries found for this month');
    }
    return result;
  },

  async markPaid(dairyId: string, year: number, month: number) {
    const result = await protsahanRepository.markPaidForDairyMonth(dairyId, year, month);
    if (result.count === 0) {
      throw AppError.badRequest('No approved protsahan entries found for this month');
    }
    return result;
  },

  listForFarmer(farmerId: string) {
    return protsahanRepository.listForFarmer(farmerId);
  },
};
