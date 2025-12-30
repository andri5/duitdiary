import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authMiddleware, validate } from '../middlewares/index.js';
import { createCategorySchema, updateCategorySchema } from '../utils/validation.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories (default + user's custom)
 * @access  Private
 */
router.get('/', (req, res) => categoryController.getAll(req, res));

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 * @access  Private
 */
router.get('/:id', (req, res) => categoryController.getById(req, res));

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new custom category
 * @access  Private
 */
router.post(
  '/',
  validate(createCategorySchema),
  (req, res) => categoryController.create(req, res)
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a custom category
 * @access  Private
 */
router.put(
  '/:id',
  validate(updateCategorySchema),
  (req, res) => categoryController.update(req, res)
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a custom category
 * @access  Private
 */
router.delete('/:id', (req, res) => categoryController.delete(req, res));

export default router;
