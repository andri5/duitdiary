import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authMiddleware, adminMiddleware } from '../middlewares/index.js';
import type { Request, Response } from 'express';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/feedback', async (_req: Request, res: Response) => {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json({ success: true, data: feedback });
});

router.get('/users', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      currency: true,
      createdAt: true,
      _count: { select: { expenses: true, savingsGoals: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: users });
});

router.get('/stats', async (_req: Request, res: Response) => {
  const [userCount, txCount, feedbackCount] = await Promise.all([
    prisma.user.count(),
    prisma.expense.count(),
    prisma.feedback.count(),
  ]);
  res.json({
    success: true,
    data: { users: userCount, transactions: txCount, feedback: feedbackCount },
  });
});

export default router;
