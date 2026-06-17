import { AccessTokenPayload } from './auth.types';

// Augment Express's Request so `req.user` is typed everywhere after the
// auth middleware runs, instead of `any` or repeated casts in controllers.
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
