import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { dairyRepository } from '../repositories/dairy.repository';
import { AppError } from '../utils/appError';

export const dairyController = {
  listForRegion: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.scopeId) throw AppError.forbidden('No region assigned to this account');
    const dairies = await dairyRepository.listByRegion(req.user.scopeId);
    return sendSuccess(res, dairies);
  }),
};
