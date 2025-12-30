import { prisma } from '../utils/prisma.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../utils/validation.js';
import type { CategoryResponse } from '../types/index.js';

export class CategoryService {
  async getAll(userId: string): Promise<CategoryResponse[]> {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: null, isDefault: true }, // Default categories
          { userId }, // User's custom categories
        ],
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      isDefault: cat.isDefault,
      expenseCount: cat._count.expenses,
    }));
  }

  async getById(id: string, userId: string): Promise<CategoryResponse | null> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        OR: [
          { userId: null, isDefault: true },
          { userId },
        ],
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isDefault: category.isDefault,
      expenseCount: category._count.expenses,
    };
  }

  async create(userId: string, data: CreateCategoryInput): Promise<CategoryResponse> {
    const category = await prisma.category.create({
      data: {
        userId,
        name: data.name,
        icon: data.icon,
        color: data.color,
        isDefault: false,
      },
    });

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isDefault: category.isDefault,
      expenseCount: 0,
    };
  }

  async update(id: string, userId: string, data: UpdateCategoryInput): Promise<CategoryResponse | null> {
    // Check if category exists and belongs to user
    const existing = await prisma.category.findFirst({
      where: {
        id,
        userId, // Only user's custom categories can be updated
        isDefault: false,
      },
    });

    if (!existing) return null;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.icon && { icon: data.icon }),
        ...(data.color && { color: data.color }),
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isDefault: category.isDefault,
      expenseCount: category._count.expenses,
    };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    // Check if category exists and belongs to user
    const existing = await prisma.category.findFirst({
      where: {
        id,
        userId,
        isDefault: false,
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    if (!existing) return false;

    // Check if category has expenses
    if (existing._count.expenses > 0) {
      throw new Error('Cannot delete category with existing expenses');
    }

    await prisma.category.delete({ where: { id } });
    return true;
  }
}

export const categoryService = new CategoryService();
