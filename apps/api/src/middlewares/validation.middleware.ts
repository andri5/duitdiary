/**
 * Validation Middleware
 * Validates request body and query parameters
 */

import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult, ValidationChain } from 'express-validator';
import { sendError } from '../utils/response';

/**
 * Middleware to check validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? (err as any).path : 'unknown',
      message: err.msg,
    }));
    return sendError(
      res,
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      formattedErrors
    );
  }
  next();
};

/**
 * Validation rules for authentication
 */
export const authValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid email format')
      .toLowerCase(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
  ];
};

/**
 * Validation rules for expenses
 */
export const expenseValidationRules = () => {
  return [
    body('categoryId')
      .trim()
      .notEmpty()
      .withMessage('Category ID is required')
      .isUUID()
      .withMessage('Invalid category ID format'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ min: 0.01, max: 999999999.99 })
      .withMessage('Amount must be a number between 0.01 and 999999999.99'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description max 500 characters'),
    body('date')
      .optional()
      .trim()
      .isISO8601()
      .withMessage('Invalid date format (use YYYY-MM-DD)')
      .custom((value) => {
        const expenseDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (expenseDate > today) {
          throw new Error('Expense date cannot be in the future');
        }
        return true;
      }),
  ];
};

/**
 * Validation rules for categories
 */
export const categoryValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be 2-50 characters'),
    body('color')
      .optional()
      .trim()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Invalid color format (must be hex: #RRGGBB)'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description max 200 characters'),
  ];
};

/**
 * Validation rules for dashboard queries
 */
export const dashboardValidationRules = () => {
  return [
    query('startDate')
      .optional()
      .trim()
      .isISO8601()
      .withMessage('Invalid start date format (use YYYY-MM-DD)'),
    query('endDate')
      .optional()
      .trim()
      .isISO8601()
      .withMessage('Invalid end date format (use YYYY-MM-DD)')
      .custom((value, { req }) => {
        if (req.query.startDate && value) {
          const start = new Date(req.query.startDate as string);
          const end = new Date(value);
          if (start > end) {
            throw new Error('Start date must be before end date');
          }
        }
        return true;
      }),
    query('categoryId')
      .optional()
      .trim()
      .isUUID()
      .withMessage('Invalid category ID format'),
  ];
};

/**
 * Compose validation middleware
 */
export const validate = (validationRules: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validationRules.map(rule => rule.run(req)));
    handleValidationErrors(req, res, next);
  };
};
