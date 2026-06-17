import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { monthlyPaymentService } from '../services/monthlyPayment.service';
import { resolveDairyScope } from '../utils/resolveDairyScope';
import { AppError } from '../utils/appError';

export const monthlyPaymentController = {
  getRegister: asyncHandler(async (req: Request, res: Response) => {
    const dairyId = await resolveDairyScope(req, req.query.dairyId as string | undefined);
    const { year, month } = req.query as unknown as { year: number; month: number };
    const register = await monthlyPaymentService.getRegister(dairyId, Number(year), Number(month));
    return sendSuccess(res, register);
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {
    const dairyId = await resolveDairyScope(req, req.body.dairyId);
    const { year, month } = req.body;
    const result = await monthlyPaymentService.verifyMonth(dairyId, year, month);
    return sendSuccess(res, result, 200, 'Month verified successfully');
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const dairyId = await resolveDairyScope(req, req.body.dairyId);
    const { year, month } = req.body;
    const result = await monthlyPaymentService.approveMonth(dairyId, year, month, req.user.userId);
    return sendSuccess(res, result, 200, 'Month approved successfully');
  }),
};
