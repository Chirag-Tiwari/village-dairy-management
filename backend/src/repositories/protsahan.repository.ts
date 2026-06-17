import { prisma } from '../prisma/client';

function monthBounds(year: number, month: number) {
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

export const protsahanRepository = {
  getProtsahanAmountsForMonth(dairyId: string, year: number, month: number) {
    const { start, end } = monthBounds(year, month);
    return prisma.milkCollection.findMany({
      where: { dairyId, collectionDate: { gte: start, lt: end }, protsahanAmount: { gt: 0 } },
      select: { farmerId: true, collectionDate: true, protsahanAmount: true },
    });
  },

  listLedgerForDairyMonth(dairyId: string, year: number, month: number) {
    const { start, end } = monthBounds(year, month);
    return prisma.protsahanLedger.findMany({
      where: { milkCollection: { dairyId }, collectionDate: { gte: start, lt: end } },
    });
  },

  listForFarmer(farmerId: string) {
    return prisma.protsahanLedger.findMany({
      where: { farmerId },
      orderBy: { collectionDate: 'desc' },
    });
  },

  createFromMilkCollection(data: { farmerId: string; milkCollectionId: string; collectionDate: Date; protsahanAmount: number }) {
    return prisma.protsahanLedger.create({
      data: {
        farmerId: data.farmerId,
        milkCollectionId: data.milkCollectionId,
        collectionDate: data.collectionDate,
        protsahanAmount: data.protsahanAmount,
        status: 'PENDING',
      },
    });
  },

  approveForDairyMonth(dairyId: string, year: number, month: number, approvedById: string) {
    const { start, end } = monthBounds(year, month);
    return prisma.protsahanLedger.updateMany({
      where: { milkCollection: { dairyId }, collectionDate: { gte: start, lt: end }, status: 'PENDING' },
      data: { status: 'APPROVED', approvedById, approvedAt: new Date() },
    });
  },

  markPaidForDairyMonth(dairyId: string, year: number, month: number) {
    const { start, end } = monthBounds(year, month);
    return prisma.protsahanLedger.updateMany({
      where: { milkCollection: { dairyId }, collectionDate: { gte: start, lt: end }, status: 'APPROVED' },
      data: { status: 'PAID', paidAt: new Date() },
    });
  },
};
