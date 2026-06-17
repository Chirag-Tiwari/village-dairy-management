import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { farmerService } from '../services/farmer.service';
import { AppError } from '../utils/appError';

// req.user.scopeId carries dairyId for SECRETARY, regionId for SUPERVISOR,
// farmerId for USER -- set once at login so every handler here just reads it.
export const farmerController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No dairy assigned to this account');
    const farmer = await farmerService.registerFarmer(req.user.scopeId, req.body);
    return sendSuccess(res, farmer, 201, 'Farmer registered successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No dairy assigned to this account');
    const farmer = await farmerService.updateFarmer(req.params.id, req.user.scopeId, req.body);
    return sendSuccess(res, farmer, 200, 'Farmer updated successfully');
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No dairy assigned to this account');
    const farmers = await farmerService.listForDairy(req.user.scopeId);
    return sendSuccess(res, farmers);
  }),

  listForRegion: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No region assigned to this account');
    const farmers = await farmerService.listForRegion(req.user.scopeId);
    return sendSuccess(res, farmers);
  }),

  myProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const farmer = await farmerService.getOwnProfile(req.user.userId);
    return sendSuccess(res, farmer);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const farmer = await farmerService.getById(req.params.id);
    return sendSuccess(res, farmer);
  }),
};
