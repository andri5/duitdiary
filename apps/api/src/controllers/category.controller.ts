import { Request, Response } from 'express';
import { categoryService } from '../services/category.service.js';
import { sendSuccess, sendCreated, sendError, sendNotFound } from '../utils/response.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../utils/validation.js';
import type { AuthenticatedRequest } from '../types/index.js';

export class CategoryController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const categories = await categoryService.getAll(userId);
      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get categories';
      sendError(res, message, 500, 'GET_CATEGORIES_FAILED');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const { id } = req.params;
      const category = await categoryService.getById(id, userId);
      
      if (!category) {
        sendNotFound(res, 'Category not found');
        return;
      }
      
      sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get category';
      sendError(res, message, 500, 'GET_CATEGORY_FAILED');
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const data: CreateCategoryInput = req.body;
      const category = await categoryService.create(userId, data);
      sendCreated(res, category, 'Category created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create category';
      sendError(res, message, 400, 'CREATE_CATEGORY_FAILED');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const { id } = req.params;
      const data: UpdateCategoryInput = req.body;
      const category = await categoryService.update(id, userId, data);
      
      if (!category) {
        sendNotFound(res, 'Category not found or cannot be updated');
        return;
      }
      
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update category';
      sendError(res, message, 400, 'UPDATE_CATEGORY_FAILED');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const { id } = req.params;
      const deleted = await categoryService.delete(id, userId);
      
      if (!deleted) {
        sendNotFound(res, 'Category not found or cannot be deleted');
        return;
      }
      
      sendSuccess(res, null, 'Category deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category';
      if (message.includes('existing expenses')) {
        sendError(res, message, 409, 'CATEGORY_HAS_EXPENSES');
      } else {
        sendError(res, message, 400, 'DELETE_CATEGORY_FAILED');
      }
    }
  }
}

export const categoryController = new CategoryController();
