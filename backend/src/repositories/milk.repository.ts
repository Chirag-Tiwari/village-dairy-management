import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

export const milkRepository = {
  listByDairyAndDate(dairyId: string, date: Date) {
    return prisma.milkCollection.findMany({
      where: { dairyId, collectionDate: date },
      include: { farmer: { select: { id: true, name: true, category: true } } },
      orderBy: { farmer: { name: 'asc' } },
    });
  },

  listByFarmer(farmerId: string, from?: Date, to?: Date) {
    return prisma.milkCollection.findMany({
      where: {
        farmerId,
        ...(from || to
          ? { collectionDate: { gte: from, lte: to } }
          : {}),
      },
      orderBy: { collectionDate: 'desc' },
    });
  },

  findOneForFarmerAndDate(farmerId: string, date: Date) {
    return prisma.milkCollection.findUnique({
      where: { farmerId_collectionDate: { farmerId, collectionDate: date } },
    });
  },

  // Creates the milk collection row and, when there's an incentive
  // amount, its matching protsahan ledger row in the same transaction --
  // the two must never exist out of sync with each other.
  create(data: {
    farmerId: string;
    dairyId: string;
    collectionDate: Date;
    milkQuantityL: number;
    fat: number;
    snf: number;
    ratePerLitre: number;
    totalAmount: number;
    protsahanRate: number;
    protsahanAmount: number;
    recordedById: string;
  }) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const milkCollection = await tx.milkCollection.create({ data });

      if (data.protsahanAmount > 0) {
        await tx.protsahanLedger.create({
          data: {
            farmerId: data.farmerId,
            milkCollectionId: milkCollection.id,
            collectionDate: data.collectionDate,
            protsahanAmount: data.protsahanAmount,
            status: 'PENDING',
          },
        });
      }

      return milkCollection;
    });
  },
};
