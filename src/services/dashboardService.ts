import { prisma } from "@/lib/database/prisma";
import { demoList, isDemoStore } from "@/lib/database/demo-store";
import { monthRange } from "@/lib/utils";

const toNumber = (value: unknown) => Number(value ?? 0);

export async function getDashboard(userId: string) {
  const { start, end } = monthRange();
  const [incomes, expenses, loans] = isDemoStore
    ? [demoList("incomes", userId), demoList("expenses", userId), demoList("loans", userId)]
    : await Promise.all([
        prisma.income.findMany({ where: { userId }, orderBy: { date: "asc" } }),
        prisma.expense.findMany({ where: { userId }, orderBy: { date: "asc" } }),
        prisma.loan.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      ]);

  const monthIncome = incomes.filter((item) => item.date >= start && item.date < end).reduce((sum, item) => sum + toNumber(item.amount), 0);
  const monthExpenseBase = expenses.filter((item) => item.date >= start && item.date < end).reduce((sum, item) => sum + toNumber(item.amount), 0);
  const monthlyEmi = loans.reduce((sum, loan) => sum + toNumber(loan.emiAmount), 0);
  const monthExpenses = monthExpenseBase + monthlyEmi;
  const savings = monthIncome - monthExpenses;
  const savingsRate = monthIncome ? (savings / monthIncome) * 100 : 0;
  const loanBurden = monthIncome ? (monthlyEmi / monthIncome) * 100 : 0;
  const expenseRatio = monthIncome ? (monthExpenses / monthIncome) * 100 : 100;
  const stability = incomes.length >= 2 ? 25 : incomes.length ? 15 : 0;
  const score = Math.max(0, Math.min(100, Math.round(stability + Math.max(0, 30 - expenseRatio * 0.3) + Math.max(0, savingsRate * 0.6) + Math.max(0, 25 - loanBurden * 0.5))));

  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const e = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const income = incomes.filter((x) => x.date >= s && x.date < e).reduce((sum, x) => sum + toNumber(x.amount), 0);
    const expense = expenses.filter((x) => x.date >= s && x.date < e).reduce((sum, x) => sum + toNumber(x.amount), 0) + monthlyEmi;
    return { month: d.toLocaleString("en", { month: "short" }), income, expense, savings: income - expense };
  });

  const expenseCategories = Object.values(
    expenses.reduce<Record<string, { name: string; value: number }>>((acc, expense) => {
      acc[expense.category] ??= { name: expense.category, value: 0 };
      acc[expense.category].value += toNumber(expense.amount);
      return acc;
    }, {}),
  );

  return {
    summary: { monthIncome, monthExpenses, savings, savingsRate, score, monthlyEmi },
    charts: { monthly, expenseCategories },
    loans: loans.map((loan) => ({
      id: loan.id,
      name: loan.loanName,
      type: loan.loanType,
      principal: toNumber(loan.principalAmount),
      remaining: toNumber(loan.remainingAmount),
      progress: Math.round(((toNumber(loan.principalAmount) - toNumber(loan.remainingAmount)) / Math.max(1, toNumber(loan.principalAmount))) * 100),
    })),
  };
}
