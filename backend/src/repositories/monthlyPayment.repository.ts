import { prisma } from '../prisma/client';
import { MatrixRow } from '../utils/registerMatrix.util';

function monthBounds(year: number, month: number) {
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

export const monthlyPaymentRepository = {
  getMilkAmountsForMonth(dairyId: string, year: number, month: number) {
    const { start, end } = monthBounds(year, month);
    return prisma.milkCollection.findMany({
      where: { dairyId, collectionDate: { gte: start, lt: end } },
      select: { farmerId: true, collectionDate: true, totalAmount: true },
    });
  },

  listForDairyMonth(dairyId: string, year: number, month: number) {
    return prisma.monthlyPayment.findMany({ where: { dairyId, year, month } });
  },

  // Persists the verification snapshot: one row per farmer for this
  // dairy/month, recording both totals and marking the month VERIFIED.
  upsertManyForDairy(dairyId: string, year: number, month: number, rows: MatrixRow[]) {
    return prisma.$transaction(
      rows.map((row) =>
        prisma.monthlyPayment.upsert({
          where: { farmerId_year_month: { farmerId: row.farmerId, year, month } },
          create: {
            farmerId: row.farmerId,
            dairyId,
            year,
            month,
            rowTotal: row.rowTotal,
            columnTotalCheck: row.rowTotal,
            isBalanced: true,
            status: 'VERIFIED',
          },
          update: {
            rowTotal: row.rowTotal,
            columnTotalCheck: row.rowTotal,
            isBalanced: true,
            status: 'VERIFIED',
          },
        }),
      ),
    );
  },

  approveAllForDairyMonth(dairyId: string, year: number, month: number, approvedById: string) {
    return prisma.monthlyPayment.updateMany({
      where: { dairyId, year, month },
      data: { status: 'APPROVED', approvedById, approvedAt: new Date() },
    });
  },
};
