import { prisma } from '../utils/prisma.js';
import type { RecurringFrequency, TransactionType } from '@prisma/client';

export type CreateRecurringInput = {
  categoryId: string;
  type?: TransactionType;
  amount: number;
  note?: string;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
};

export class RecurringService {
  async list(userId: string) {
    return prisma.recurringTransaction.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true, type: true } },
      },
      orderBy: [{ isActive: 'desc' }, { nextRunDate: 'asc' }],
    });
  }

  async create(userId: string, data: CreateRecurringInput) {
    const start = new Date(`${data.startDate}T00:00:00`);
    return prisma.recurringTransaction.create({
      data: {
        userId,
        categoryId: data.categoryId,
        type: data.type ?? 'EXPENSE',
        amount: data.amount,
        note: data.note,
        frequency: data.frequency,
        startDate: start,
        endDate: data.endDate ? new Date(`${data.endDate}T00:00:00`) : null,
        nextRunDate: start,
      },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true, type: true } },
      },
    });
  }

  async setActive(userId: string, id: string, isActive: boolean) {
    const existing = await prisma.recurringTransaction.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return prisma.recurringTransaction.update({
      where: { id },
      data: { isActive },
    });
  }
}

export const recurringService = new RecurringService();
