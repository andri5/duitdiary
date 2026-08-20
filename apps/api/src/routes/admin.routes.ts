import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authMiddleware, adminMiddleware } from '../middlewares/index.js';
import { paramString } from '../utils/params.js';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
import { auditService } from '../services/audit.service.js';
import { ensureDefaultFeatureFlags, setFeatureFlag } from '../services/featureFlags.service.js';

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
  void auditService.log({
    userId: currentAdmin.userId,
    actorRole: currentAdmin.role,
    action: 'UPDATE_USER_ROLE',
    entityType: 'user',
    entityId: id,
    summary: `Role ${user.email} -> ${role}`,
    metadata: { role },
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
  const deleted = await prisma.user.delete({
    where: { id },
    select: { id: true, email: true },
  });
  void auditService.log({
    userId: currentAdmin.userId,
    actorRole: currentAdmin.role,
    action: 'DELETE_USER',
    entityType: 'user',
    entityId: id,
    summary: `Delete user ${deleted.email}`,
  });
  res.json({ success: true, message: 'User deleted' });
});

router.get('/feedback', async (_req: Request, res: Response) => {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      message: true,
      rating: true,
      isPublished: true,
      createdAt: true,
      userId: true,
    },
  });
  res.json({ success: true, data: feedback });
});

router.patch('/feedback/:id', async (req: Request, res: Response) => {
  const id = paramString(req.params.id);
  const { isPublished } = req.body as { isPublished?: boolean };
  if (typeof isPublished !== 'boolean') {
    res.status(400).json({ success: false, message: 'isPublished (boolean) wajib' });
    return;
  }

  try {
    const updated = await prisma.feedback.update({
      where: { id },
      data: { isPublished },
      select: {
        id: true,
        name: true,
        message: true,
        rating: true,
        isPublished: true,
        createdAt: true,
      },
    });

    const authUser = (req as AuthenticatedRequest).user!;
    await auditService.log({
      userId: authUser.userId,
      actorRole: 'ADMIN',
      action: isPublished ? 'PUBLISH_FEEDBACK' : 'UNPUBLISH_FEEDBACK',
      entityType: 'feedback',
      entityId: id,
      summary: `${isPublished ? 'Publish' : 'Unpublish'} feedback ${id}`,
    });

    res.json({ success: true, data: updated, message: isPublished ? 'Ditampilkan di landing' : 'Disembunyikan dari landing' });
  } catch {
    res.status(404).json({ success: false, message: 'Feedback tidak ditemukan' });
  }
});

router.delete('/feedback/:id', async (req: Request, res: Response) => {
  const id = paramString(req.params.id);
  await prisma.feedback.delete({ where: { id } });
  res.json({ success: true, message: 'Feedback deleted' });
});

// ==================== ADMIN INSIGHTS ====================
router.get('/activity', async (req: Request, res: Response) => {
  const take = Number(req.query.take || 50);
  const safeTake = Number.isFinite(take) ? Math.min(Math.max(take, 1), 200) : 50;

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeTake,
    select: {
      id: true,
      userId: true,
      actorRole: true,
      action: true,
      entityType: true,
      entityId: true,
      summary: true,
      createdAt: true,
    },
  });

  res.json({ success: true, data: logs });
});

router.get('/feature-flags', async (_req: Request, res: Response) => {
  await ensureDefaultFeatureFlags();
  const flags = await prisma.featureFlag.findMany({
    orderBy: { label: 'asc' },
    select: { key: true, label: true, description: true, isEnabled: true, updatedAt: true },
  });
  res.json({ success: true, data: flags });
});

router.patch('/feature-flags/:key', async (req: Request, res: Response) => {
  const key = paramString(req.params.key);
  const { isEnabled } = req.body as { isEnabled?: boolean };

  if (typeof isEnabled !== 'boolean') {
    res.status(400).json({ success: false, message: 'isEnabled must be boolean' });
    return;
  }

  const currentAdmin = (req as AuthenticatedRequest).user!;

  let updated;
  try {
    updated = await setFeatureFlag(key, isEnabled, currentAdmin.userId);
  } catch {
    res.status(404).json({ success: false, message: 'Feature flag not found' });
    return;
  }

  void auditService.log({
    userId: currentAdmin.userId,
    actorRole: currentAdmin.role,
    action: 'TOGGLE_FEATURE_FLAG',
    entityType: 'feature_flag',
    entityId: key,
    summary: `Feature flag ${key} -> ${isEnabled ? 'ON' : 'OFF'}`,
    metadata: { isEnabled },
  });

  res.json({ success: true, data: updated });
});

router.get('/traffic', async (req: Request, res: Response) => {
  const days = Number(req.query.days || 7);
  const safeDays = Number.isFinite(days) ? Math.min(Math.max(days, 1), 30) : 7;

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - safeDays);

  const events = await prisma.visitEvent.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: { createdAt: true, path: true, sessionId: true },
    orderBy: { createdAt: 'desc' },
    take: 50000,
  });

  const totalVisits = events.length;
  const uniqueSessions = new Set(events.map((e) => e.sessionId));

  // Active "today" (based on sessionId uniqueness)
  const todayStart = new Date(end);
  todayStart.setHours(0, 0, 0, 0);
  const todaySessions = new Set(
    events
      .filter((e) => e.createdAt >= todayStart)
      .map((e) => e.sessionId)
  );

  const pathCounts = new Map<string, number>();
  for (const e of events) {
    const current = pathCounts.get(e.path) ?? 0;
    pathCounts.set(e.path, current + 1);
  }

  const topPaths = Array.from(pathCounts.entries())
    .map(([path, visits]) => ({ path, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  // Daily buckets (YYYY-MM-DD)
  const dayCounts = new Map<string, number>();
  for (const e of events) {
    const day = e.createdAt.toISOString().slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }

  const daily = Array.from(dayCounts.entries())
    .map(([date, visits]) => ({ date, visits }))
    .sort((a, b) => a.date.localeCompare(b.date));

  res.json({
    success: true,
    data: {
      totalVisits,
      uniqueVisitorsInRange: uniqueSessions.size,
      activeUsersToday: todaySessions.size,
      daily,
      topPaths,
    },
  });
});

export default router;
