import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FinanceForm } from "@/components/forms/crud-forms";
import { FinanceTable } from "@/components/tables/finance-table";
import { authOptions } from "@/lib/auth/options";
import { listIncomes } from "@/services/incomeService";

export default async function IncomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const incomes = await listIncomes(session.user.id);
  return <AppShell title="Income" subtitle="Add, delete, and review income streams."><div className="grid gap-6"><FinanceForm mode="income" /><FinanceTable type="income" rows={incomes as unknown as Record<string, unknown>[]} /></div></AppShell>;
}
