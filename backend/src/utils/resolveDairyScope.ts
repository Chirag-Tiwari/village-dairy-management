import { Request } from 'express';
import { dairyRepository } from '../repositories/dairy.repository';
import { AppError } from './appError';

// Both the Monthly Payment Register and the Protsahan Register need to
// know "which dairy am I looking at," but that resolves differently per
// role: a secretary always sees their own dairy (no choice involved), a
// supervisor must explicitly pick one of the dairies in their region and
// we verify it's actually theirs before trusting the id from the request.
export async function resolveDairyScope(req: Request, requestedDairyId?: string): Promise<string> {
  if (!req.user) throw AppError.unauthorized();

  if (req.user.role === 'SECRETARY') {
    if (!req.user.scopeId) throw AppError.forbidden('No dairy assigned to this account');
    return req.user.scopeId;
  }

  if (req.user.role === 'SUPERVISOR') {
    if (!requestedDairyId) throw AppError.badRequest('dairyId is required');
    const dairy = await dairyRepository.findById(requestedDairyId);
    if (!dairy || dairy.regionId !== req.user.scopeId) {
      throw AppError.forbidden('This dairy is not in your region');
    }
    return requestedDairyId;
  }

  throw AppError.forbidden();
}
