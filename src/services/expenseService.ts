import { prisma } from "@/lib/database/prisma";
import { demoCreate, demoDelete, demoList, demoUpdate, isDemoStore } from "@/lib/database/demo-store";
import { expenseSchema } from "@/lib/utils/validators";

export async function listExpenses(userId: string, filters?: { category?: string; min?: number; max?: number }) {
  if (isDemoStore) {
    return demoList("expenses", userId).filter((item) =>
      (!filters?.category || item.category === filters.category) &&
      (filters?.min === undefined || item.amount >= filters.min) &&
      (filters?.max === undefined || item.amount <= filters.max)
    );
  }
  return prisma.expense.findMany({
    where: {
      userId,
      category: filters?.category || undefined,
      amount: {
        gte: filters?.min,
        lte: filters?.max,
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function createExpense(userId: string, data: unknown) {
  const parsed = expenseSchema.parse(data);
  if (isDemoStore) return demoCreate("expenses", userId, parsed);
  return prisma.expense.create({ data: { ...parsed, userId } });
}

export async function updateExpense(userId: string, id: string, data: unknown) {
  const parsed = expenseSchema.parse(data);
  if (isDemoStore) return demoUpdate("expenses", userId, id, parsed);
  return prisma.expense.update({ where: { id, userId }, data: parsed });
}

export async function deleteExpense(userId: string, id: string) {
  if (isDemoStore) return demoDelete("expenses", userId, id);
  return prisma.expense.delete({ where: { id, userId } });
}
