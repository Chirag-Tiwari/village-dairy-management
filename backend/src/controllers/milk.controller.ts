import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { milkService } from '../services/milk.service';
import { farmerService } from '../services/farmer.service';
import { AppError } from '../utils/appError';

export const milkController = {
  recordEntry: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No dairy assigned to this account');
    const entry = await milkService.recordEntry(req.user.scopeId, req.user.userId, req.body);
    return sendSuccess(res, entry, 201, 'Milk entry recorded');
  }),

  dailyRegister: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No dairy assigned to this account');
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const register = await milkService.getDailyRegister(req.user.scopeId, date);
    return sendSuccess(res, register);
  }),

  myHistory: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const farmer = await farmerService.getOwnProfile(req.user.userId);
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    const history = await milkService.getFarmerHistory(farmer.id, from, to);
    return sendSuccess(res, history);
  }),
};
