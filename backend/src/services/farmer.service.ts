import { farmerRepository } from '../repositories/farmer.repository';
import { hashPassword } from '../utils/password.util';
import { AppError } from '../utils/appError';
import { CreateFarmerInput, UpdateFarmerInput } from '../validators/farmer.validator';

export const farmerService = {
  async registerFarmer(dairyId: string, input: CreateFarmerInput) {
    const passwordHash = await hashPassword(input.password);
    return farmerRepository.createWithUser(dairyId, input, passwordHash);
  },

  async updateFarmer(farmerId: string, dairyId: string, input: UpdateFarmerInput) {
    const farmer = await farmerRepository.findById(farmerId);
    if (!farmer || farmer.dairyId !== dairyId) {
      throw AppError.notFound('Farmer not found in this dairy');
    }
    return farmerRepository.update(farmerId, input);
  },

  listForDairy(dairyId: string) {
    return farmerRepository.listByDairy(dairyId);
  },

  listForRegion(regionId: string) {
    return farmerRepository.listByRegion(regionId);
  },

  async getOwnProfile(userId: string) {
    const farmer = await farmerRepository.findByUserId(userId);
    if (!farmer) throw AppError.notFound('Farmer profile not found');
    return farmer;
  },

  async getById(farmerId: string) {
    const farmer = await farmerRepository.findById(farmerId);
    if (!farmer) throw AppError.notFound('Farmer not found');
    return farmer;
  },
};
