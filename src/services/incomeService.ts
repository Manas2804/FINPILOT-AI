import { prisma } from "@/lib/database/prisma";
import { demoCreate, demoDelete, demoList, demoUpdate, isDemoStore } from "@/lib/database/demo-store";
import { incomeSchema } from "@/lib/utils/validators";

export async function listIncomes(userId: string) {
  if (isDemoStore) return demoList("incomes", userId);
  return prisma.income.findMany({ where: { userId }, orderBy: { date: "desc" } });
}

export async function createIncome(userId: string, data: unknown) {
  const parsed = incomeSchema.parse(data);
  if (isDemoStore) return demoCreate("incomes", userId, parsed);
  return prisma.income.create({ data: { ...parsed, userId } });
}

export async function updateIncome(userId: string, id: string, data: unknown) {
  const parsed = incomeSchema.parse(data);
  if (isDemoStore) return demoUpdate("incomes", userId, id, parsed);
  return prisma.income.update({ where: { id, userId }, data: parsed });
}

export async function deleteIncome(userId: string, id: string) {
  if (isDemoStore) return demoDelete("incomes", userId, id);
  return prisma.income.delete({ where: { id, userId } });
}
