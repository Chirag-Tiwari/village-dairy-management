import { farmerRepository } from '../repositories/farmer.repository';
import { monthlyPaymentRepository } from '../repositories/monthlyPayment.repository';
import { buildRegisterMatrix } from '../utils/registerMatrix.util';
import { AppError } from '../utils/appError';

async function computeMatrix(dairyId: string, year: number, month: number) {
  const farmers = await farmerRepository.listByDairy(dairyId);
  const entries = await monthlyPaymentRepository.getMilkAmountsForMonth(dairyId, year, month);

  return buildRegisterMatrix(
    farmers.map((f: { id: string; name: string }) => ({ id: f.id, name: f.name })),
    entries.map((e: { farmerId: string; collectionDate: Date; totalAmount: unknown }) => ({
      farmerId: e.farmerId,
      collectionDate: e.collectionDate,
      amount: Number(e.totalAmount),
    })),
    year,
    month,
  );
}

export const monthlyPaymentService = {
  async getRegister(dairyId: string, year: number, month: number) {
    const matrix = await computeMatrix(dairyId, year, month);
    const existingRecords = await monthlyPaymentRepository.listForDairyMonth(dairyId, year, month);
    const statusByFarmerId = new Map(
      existingRecords.map((r: { farmerId: string; status: string }) => [r.farmerId, r.status]),
    );

    return {
      ...matrix,
      rows: matrix.rows.map((row) => ({
        ...row,
        status: statusByFarmerId.get(row.farmerId) ?? 'PENDING',
      })),
    };
  },

  async verifyMonth(dairyId: string, year: number, month: number) {
    const matrix = await computeMatrix(dairyId, year, month);

    if (!matrix.isBalanced) {
      throw AppError.conflict(
        'Row totals and column totals do not match. Re-check entries before verifying this month.',
      );
    }

    await monthlyPaymentRepository.upsertManyForDairy(dairyId, year, month, matrix.rows);
    return matrix;
  },

  async approveMonth(dairyId: string, year: number, month: number, approvedById: string) {
    const records = await monthlyPaymentRepository.listForDairyMonth(dairyId, year, month);

    if (records.length === 0) {
      throw AppError.badRequest('Verify this month before approving it');
    }
    const allVerifiedOrApproved = records.every(
      (r: { status: string }) => r.status === 'VERIFIED' || r.status === 'APPROVED',
    );
    if (!allVerifiedOrApproved) {
      throw AppError.conflict('All farmer records must be verified before approval');
    }

    return monthlyPaymentRepository.approveAllForDairyMonth(dairyId, year, month, approvedById);
  },
};
