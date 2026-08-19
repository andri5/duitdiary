import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import type { Request, Response } from 'express';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, message, rating } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ success: false, message: 'Message is required' });
    return;
  }
  const feedback = await prisma.feedback.create({
    data: {
      name: name?.trim() || null,
      message: message.trim(),
      rating: Math.min(5, Math.max(0, Number(rating) || 0)),
    },
  });
  res.status(201).json({ success: true, data: { id: feedback.id } });
});

export default router;
