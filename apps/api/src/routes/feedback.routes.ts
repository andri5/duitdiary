import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/index.js';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

router.get('/status', authMiddleware, async (req: Request, res: Response) => {
  const { userId } = (req as AuthenticatedRequest).user!;
  const existing = await prisma.feedback.findUnique({
    where: { userId },
    select: { id: true },
  });
  res.json({ success: true, data: { submitted: !!existing } });
});

router.post('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  const { name, message, rating } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ success: false, message: 'Message is required' });
    return;
  }

  const authUser = (req as AuthenticatedRequest).user;

  if (authUser) {
    const existing = await prisma.feedback.findUnique({
      where: { userId: authUser.userId },
      select: { id: true },
    });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'Kamu sudah mengirim masukan sebelumnya. Terima kasih!',
      });
      return;
    }
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId: authUser?.userId ?? null,
        name: typeof name === 'string' ? name.trim().slice(0, 100) || null : null,
        message: message.trim(),
        rating: Math.min(5, Math.max(0, Number(rating) || 0)),
      },
    });
    res.status(201).json({ success: true, data: { id: feedback.id } });
  } catch (e) {
    console.error('Feedback create failed:', e);
    res.status(500).json({ success: false, message: 'Gagal menyimpan masukan' });
  }
});

export default router;
