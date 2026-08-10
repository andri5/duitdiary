import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import expenseRoutes from './expense.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DuitDiary API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/uploads', uploadRoutes);

export default router;
