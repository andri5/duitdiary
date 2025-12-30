import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/index.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/v1/dashboard/summary
 * @desc    Get dashboard summary (today, week, month totals + recent expenses + top categories)
 * @access  Private
 */
router.get('/summary', (req, res) => dashboardController.getSummary(req, res));

export default router;
