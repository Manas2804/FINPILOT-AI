import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FinanceForm } from "@/components/forms/crud-forms";
import { FinanceTable } from "@/components/tables/finance-table";
import { authOptions } from "@/lib/auth/options";
import { listExpenses } from "@/services/expenseService";

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ category?: string; min?: string; max?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const filters = await searchParams;
  const expenses = await listExpenses(session.user.id, { category: filters.category, min: filters.min ? Number(filters.min) : undefined, max: filters.max ? Number(filters.max) : undefined });
  return <AppShell title="Expenses" subtitle="Track spending with category and amount filters."><form className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4 dark:border-slate-800 dark:bg-slate-950"><input name="category" placeholder="Category" defaultValue={filters.category} className="rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input name="min" placeholder="Min amount" defaultValue={filters.min} className="rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input name="max" placeholder="Max amount" defaultValue={filters.max} className="rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><button className="rounded-lg bg-slate-950 px-4 py-2 text-white dark:bg-white dark:text-slate-950">Filter</button></form><div className="grid gap-6"><FinanceForm mode="expenses" /><FinanceTable type="expenses" rows={expenses as unknown as Record<string, unknown>[]} /></div></AppShell>;
}
