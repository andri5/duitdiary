import { prisma } from '../utils/prisma.js';
import type { CreateExpenseInput, UpdateExpenseInput, ExpenseQueryInput } from '../utils/validation.js';
import type { ExpenseResponse, PaginationMeta } from '../types/index.js';

interface ExpenseWhereInput {
  userId: string;
  deletedAt: null;
  date?: {
    gte?: Date;
    lte?: Date;
  };
  categoryId?: string;
  note?: {
    contains: string;
    mode: 'insensitive';
  };
}

export class ExpenseService {
  async getAll(
    userId: string,
    query: ExpenseQueryInput
  ): Promise<{ expenses: ExpenseResponse[]; meta: PaginationMeta }> {
    const { page, limit, startDate, endDate, categoryId, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: ExpenseWhereInput = {
      userId,
      deletedAt: null,
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.note = { contains: search, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.expense.count({ where: where as any });

    // Get expenses
    const expenses = await prisma.expense.findMany({
      where: where as any,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      expenses: expenses.map((exp: any) => this.formatExpense(exp)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string, userId: string): Promise<ExpenseResponse | null> {
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    if (!expense) return null;

    return this.formatExpense(expense);
  }

  async create(userId: string, data: CreateExpenseInput): Promise<ExpenseResponse> {
    // Verify category exists and is accessible
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        OR: [
          { userId: null, isDefault: true },
          { userId },
        ],
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        categoryId: data.categoryId,
        amount: data.amount,
        note: data.note,
        date: new Date(data.date),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    return this.formatExpense(expense);
  }

  async update(id: string, userId: string, data: UpdateExpenseInput): Promise<ExpenseResponse | null> {
    // Check if expense exists
    const existing = await prisma.expense.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!existing) return null;

    // If categoryId is being updated, verify it exists
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          OR: [
            { userId: null, isDefault: true },
            { userId },
          ],
        },
      });

      if (!category) {
        throw new Error('Category not found');
      }
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.note !== undefined && { note: data.note }),
        ...(data.date && { date: new Date(data.date) }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    return this.formatExpense(expense);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.expense.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!existing) return false;

    // Soft delete
    await prisma.expense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return true;
  }

  private formatExpense(expense: {
    id: string;
    amount: any;
    note: string | null;
    date: Date;
    receiptUrl: string | null;
    createdAt: Date;
    category: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
  }): ExpenseResponse {
    return {
      id: expense.id,
      amount: Number(expense.amount),
      category: expense.category,
      note: expense.note,
      date: expense.date.toISOString().split('T')[0],
      receiptUrl: expense.receiptUrl,
      createdAt: expense.createdAt,
    };
  }
}

export const expenseService = new ExpenseService();
