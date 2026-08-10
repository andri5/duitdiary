import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendCreated, sendError } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

export class UploadController {
  async uploadReceipt(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user?.userId) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }

      const file = req.file;
      if (!file) {
        sendError(res, 'File struk wajib diunggah', 400, 'FILE_REQUIRED');
        return;
      }

      const url = `/uploads/receipts/${file.filename}`;

      sendCreated(
        res,
        {
          url,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
        'Receipt uploaded successfully'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload receipt';
      sendError(res, message, 400, 'UPLOAD_FAILED');
    }
  }

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const authUser = (req as AuthenticatedRequest).user;
      if (!authUser?.userId) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }

      const file = req.file;
      if (!file) {
        sendError(res, 'Foto profil wajib diunggah', 400, 'FILE_REQUIRED');
        return;
      }

      const avatar = `/uploads/avatars/${file.filename}`;

      const user = await prisma.user.update({
        where: { id: authUser.userId },
        data: { avatar },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      sendCreated(
        res,
        {
          url: avatar,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            currency: user.currency,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        'Avatar uploaded successfully'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload avatar';
      sendError(res, message, 400, 'UPLOAD_FAILED');
    }
  }
}

export const uploadController = new UploadController();
