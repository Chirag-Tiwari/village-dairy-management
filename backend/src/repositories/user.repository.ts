import { prisma } from '../prisma/client';

export const userRepository = {
  findByMobile(mobileNumber: string) {
    return prisma.user.findUnique({
      where: { mobileNumber },
      include: { farmer: true, staff: { include: { managedDairy: true, managedRegion: true } } },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { farmer: true, staff: { include: { managedDairy: true, managedRegion: true } } },
    });
  },

  setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  },
};
