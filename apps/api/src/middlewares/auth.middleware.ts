import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { sendUnauthorized } from '../utils/response.js';
import { config } from '../config/index.js';
import { AuthenticatedRequest } from '../types/index.js';

function extractAccessToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    if (token) return token;
  }

  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[
    config.cookie.accessName
  ];
  return cookieToken || null;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = extractAccessToken(req);

  if (!token) {
    sendUnauthorized(res, 'Access token is required');
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    sendUnauthorized(res, 'Invalid or expired access token');
    return;
  }

  (req as AuthenticatedRequest).user = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };

  next();
};

export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = extractAccessToken(req);
  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      (req as AuthenticatedRequest).user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }
  }
  next();
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as AuthenticatedRequest).user;
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return;
  }
  next();
};
