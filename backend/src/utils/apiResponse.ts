import { Response } from 'express';

// Single, predictable response envelope so the frontend never has to
// guess the shape of a success payload.
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message = 'Success') {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
