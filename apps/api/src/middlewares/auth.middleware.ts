import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { sendUnauthorized } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorized(res, 'Access token is required');
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    sendUnauthorized(res, 'Invalid or expired access token');
    return;
  }

  (req as AuthenticatedRequest).user = {
    userId: payload.userId,
    email: payload.email,
  };

  next();
};
