import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller.js';
import { authMiddleware, validate } from '../middlewares/index.js';
import { createExpenseSchema, updateExpenseSchema } from '../utils/validation.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/v1/expenses
 * @desc    Get all expenses with pagination and filters
 * @access  Private
 */
router.get('/', (req, res) => expenseController.getAll(req, res));

/**
 * @route   GET /api/v1/expenses/:id
 * @desc    Get expense by ID
 * @access  Private
 */
router.get('/:id', (req, res) => expenseController.getById(req, res));

/**
 * @route   POST /api/v1/expenses
 * @desc    Create a new expense
 * @access  Private
 */
router.post(
  '/',
  validate(createExpenseSchema),
  (req, res) => expenseController.create(req, res)
);

/**
 * @route   PUT /api/v1/expenses/:id
 * @desc    Update an expense
 * @access  Private
 */
router.put(
  '/:id',
  validate(updateExpenseSchema),
  (req, res) => expenseController.update(req, res)
);

/**
 * @route   DELETE /api/v1/expenses/:id
 * @desc    Delete an expense (soft delete)
 * @access  Private
 */
router.delete('/:id', (req, res) => expenseController.delete(req, res));

export default router;
