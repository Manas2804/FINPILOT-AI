import { prisma } from "@/lib/database/prisma";
import { demoCreate, demoDelete, demoList, demoUpdate, isDemoStore } from "@/lib/database/demo-store";
import { loanSchema } from "@/lib/utils/validators";

export async function listLoans(userId: string) {
  if (isDemoStore) return demoList("loans", userId);
  return prisma.loan.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function createLoan(userId: string, data: unknown) {
  const parsed = loanSchema.parse(data);
  if (isDemoStore) return demoCreate("loans", userId, parsed);
  return prisma.loan.create({ data: { ...parsed, userId } });
}

export async function updateLoan(userId: string, id: string, data: unknown) {
  const parsed = loanSchema.parse(data);
  if (isDemoStore) return demoUpdate("loans", userId, id, parsed);
  return prisma.loan.update({ where: { id, userId }, data: parsed });
}

export async function deleteLoan(userId: string, id: string) {
  if (isDemoStore) return demoDelete("loans", userId, id);
  return prisma.loan.delete({ where: { id, userId } });
}
