import { Request, Response, NextFunction } from 'express';
import { sendServerError } from '../utils/response.js';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      success: false,
      message: error.message,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        stack: error.stack,
      },
    });
    return;
  }

  sendServerError(res);
};
