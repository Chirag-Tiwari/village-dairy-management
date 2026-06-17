import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { protsahanLedgerService } from '../services/protsahanLedger.service';
import { resolveDairyScope } from '../utils/resolveDairyScope';
import { farmerService } from '../services/farmer.service';
import { AppError } from '../utils/appError';

export const protsahanController = {
  getRegister: asyncHandler(async (req: Request, res: Response) => {
    const dairyId = await resolveDairyScope(req, req.query.dairyId as string | undefined);
    const { year, month } = req.query as unknown as { year: number; month: number };
    const register = await protsahanLedgerService.getRegister(dairyId, Number(year), Number(month));
    return sendSuccess(res, register);
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const dairyId = await resolveDairyScope(req, req.body.dairyId);
    const { year, month } = req.body;
    const result = await protsahanLedgerService.approveMonth(dairyId, year, month, req.user.userId);
    return sendSuccess(res, result, 200, 'Protsahan entries approved');
  }),

  markPaid: asyncHandler(async (req: Request, res: Response) => {
    const dairyId = await resolveDairyScope(req, req.body.dairyId);
    const { year, month } = req.body;
    const result = await protsahanLedgerService.markPaid(dairyId, year, month);
    return sendSuccess(res, result, 200, 'Protsahan entries marked as paid');
  }),

  myLedger: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const farmer = await farmerService.getOwnProfile(req.user.userId);
    const ledger = await protsahanLedgerService.listForFarmer(farmer.id);
    return sendSuccess(res, ledger);
  }),
};
