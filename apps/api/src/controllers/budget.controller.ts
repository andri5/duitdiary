import { Request, Response } from 'express';
import { budgetService } from '../services/budget.service.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.js';
import { budgetQuerySchema } from '../utils/validation.js';
import type { CreateBudgetInput, UpdateBudgetInput } from '../utils/validation.js';
import type { AuthenticatedRequest } from '../types/index.js';

export class BudgetController {
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const query = budgetQuerySchema.parse(req.query);
      const status = await budgetService.getStatus(userId, query.month);
      sendSuccess(res, status, 'Budget status retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get budget';
      sendError(res, message, 500, 'GET_BUDGET_FAILED');
    }
  }

  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const data: CreateBudgetInput = req.body;
      const status = await budgetService.upsert(userId, data);
      sendSuccess(res, status, 'Budget saved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save budget';
      sendError(res, message, 400, 'SAVE_BUDGET_FAILED');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const data: UpdateBudgetInput = req.body;
      const status = await budgetService.upsert(userId, data);
      sendSuccess(res, status, 'Budget updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update budget';
      sendError(res, message, 400, 'UPDATE_BUDGET_FAILED');
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const { month } = req.params;
      const deleted = await budgetService.remove(userId, String(month));
      if (!deleted) {
        sendNotFound(res, 'Budget bulan ini belum diatur');
        return;
      }
      sendSuccess(res, null, 'Budget deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete budget';
      sendError(res, message, 400, 'DELETE_BUDGET_FAILED');
    }
  }
}

export const budgetController = new BudgetController();
