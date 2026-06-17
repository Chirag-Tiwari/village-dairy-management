import { prisma } from '../prisma/client';

export const dairyRepository = {
  listByRegion(regionId: string) {
    return prisma.dairy.findMany({ where: { regionId }, orderBy: { name: 'asc' } });
  },

  findById(id: string) {
    return prisma.dairy.findUnique({ where: { id } });
  },
};
