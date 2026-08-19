import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authMiddleware, adminMiddleware } from '../middlewares/index.js';
import { paramString } from '../utils/params.js';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', async (_req: Request, res: Response) => {
  const [userCount, txCount, feedbackCount, savingsCount, todayUsers] = await Promise.all([
    prisma.user.count(),
    prisma.expense.count(),
    prisma.feedback.count(),
    prisma.savingsGoal.count(),
    prisma.user.count({
      where: { createdAt: { gte: new Date(new Date().toISOString().split('T')[0]) } },
    }),
  ]);
  res.json({
    success: true,
    data: { users: userCount, transactions: txCount, feedback: feedbackCount, savingsGoals: savingsCount, todayUsers },
  });
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
      _count: { select: { expenses: true, savingsGoals: true, budgets: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: users });
});

router.patch('/users/:id/role', async (req: Request, res: Response) => {
  const id = paramString(req.params.id);
  const { role } = req.body;
  if (!['USER', 'ADMIN'].includes(role)) {
    res.status(400).json({ success: false, message: 'Invalid role' });
    return;
  }
  const currentAdmin = (req as AuthenticatedRequest).user!;
  if (currentAdmin.userId === id && role !== 'ADMIN') {
    res.status(400).json({ success: false, message: 'Tidak bisa menurunkan role diri sendiri' });
    return;
  }
  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json({ success: true, data: user });
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  const id = paramString(req.params.id);
  const currentAdmin = (req as AuthenticatedRequest).user!;
  if (currentAdmin.userId === id) {
    res.status(400).json({ success: false, message: 'Tidak bisa menghapus diri sendiri' });
    return;
  }
  await prisma.user.delete({ where: { id } });
  res.json({ success: true, message: 'User deleted' });
});

router.get('/feedback', async (_req: Request, res: Response) => {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  res.json({ success: true, data: feedback });
});

router.delete('/feedback/:id', async (req: Request, res: Response) => {
  const id = paramString(req.params.id);
  await prisma.feedback.delete({ where: { id } });
  res.json({ success: true, message: 'Feedback deleted' });
});

export default router;
