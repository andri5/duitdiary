import { prisma } from '../utils/prisma.js';
import type { DashboardSummary } from '../types/index.js';

export class DashboardService {
  async getSummary(userId: string): Promise<DashboardSummary> {
    const now = new Date();
    
    // Calculate date ranges
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get today's expenses
    const todayExpenses = await this.getExpenseStats(userId, todayStart, todayEnd);

    // Get this week's expenses
    const weekExpenses = await this.getExpenseStats(userId, weekStart, todayEnd);

    // Get this month's expenses
    const monthExpenses = await this.getExpenseStats(userId, monthStart, monthEnd);

    // Get recent expenses
    const recentExpenses = await prisma.expense.findMany({
      where: {
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
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get top categories this month
    const topCategories = await this.getTopCategories(userId, monthStart, monthEnd);

    return {
      today: todayExpenses,
      thisWeek: weekExpenses,
      thisMonth: monthExpenses,
      recentExpenses: recentExpenses.map((exp: any) => ({
        id: exp.id,
        amount: Number(exp.amount),
        category: exp.category,
        note: exp.note,
        date: exp.date.toISOString().split('T')[0],
        receiptUrl: exp.receiptUrl,
        createdAt: exp.createdAt,
      })),
      topCategories,
    };
  }

  private async getExpenseStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ total: number; count: number }> {
    const result = await prisma.expense.aggregate({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      total: Number(result._sum.amount || 0),
      count: result._count.id,
    };
  }

  private async getTopCategories(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DashboardSummary['topCategories']> {
    const expenses = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: 'desc' },
      },
      take: 5,
    });

    // Get total for percentage calculation
    const totalResult = await prisma.expense.aggregate({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
    });

    const total = Number(totalResult._sum.amount || 0);

    // Get category details
    const categoryIds = expenses.map((e: any) => e.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
    });

    const categoryMap = new Map(categories.map((c: any) => [c.id, c]));

    return expenses.map((exp: any) => {
      const category = categoryMap.get(exp.categoryId) as any;
      const expTotal = Number(exp._sum.amount || 0);
      return {
        category: {
          name: category?.name || '',
          icon: category?.icon || '',
          color: category?.color || '',
        },
        total: expTotal,
        percentage: total > 0 ? Math.round((expTotal / total) * 100 * 10) / 10 : 0,
      };
    });
  }
}

export const dashboardService = new DashboardService();
