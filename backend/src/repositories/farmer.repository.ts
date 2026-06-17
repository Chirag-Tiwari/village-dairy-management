import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import { CreateFarmerInput, UpdateFarmerInput } from '../validators/farmer.validator';

export const farmerRepository = {
  listByDairy(dairyId: string) {
    return prisma.farmer.findMany({
      where: { dairyId },
      orderBy: { name: 'asc' },
    });
  },

  listByRegion(regionId: string) {
    return prisma.farmer.findMany({
      where: { dairy: { regionId } },
      include: { dairy: { select: { name: true, village: true } } },
      orderBy: { name: 'asc' },
    });
  },

  findById(id: string) {
    return prisma.farmer.findUnique({
      where: { id },
      include: { dairy: { select: { id: true, name: true, village: true } } },
    });
  },

  findByUserId(userId: string) {
    return prisma.farmer.findUnique({ where: { userId } });
  },

  async createWithUser(dairyId: string, input: CreateFarmerInput, passwordHash: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          mobileNumber: input.mobileNumber,
          passwordHash,
          role: 'USER',
        },
      });

      return tx.farmer.create({
        data: {
          userId: user.id,
          name: input.name,
          mobileNumber: input.mobileNumber,
          village: input.village,
          category: input.category,
          dairyId,
        },
      });
    });
  },

  update(id: string, input: UpdateFarmerInput) {
    return prisma.farmer.update({ where: { id }, data: input });
  },
};
