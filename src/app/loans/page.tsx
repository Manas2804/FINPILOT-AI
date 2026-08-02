import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FinanceForm } from "@/components/forms/crud-forms";
import { FinanceTable } from "@/components/tables/finance-table";
import { authOptions } from "@/lib/auth/options";
import { formatCurrency } from "@/lib/utils";
import { listLoans } from "@/services/loanService";

export default async function LoansPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const loans = await listLoans(session.user.id);
  const totalPayable = loans.reduce((sum, loan) => sum + Number(loan.emiAmount) * Math.max(1, Math.ceil((loan.endDate.getTime() - new Date().getTime()) / 2629800000)), 0);
  const totalInterest = Math.max(0, totalPayable - loans.reduce((sum, loan) => sum + Number(loan.remainingAmount), 0));
  return <AppShell title="Loans" subtitle="Manage liabilities, EMIs, balances, and payoff progress."><div className="mb-6 grid gap-4 md:grid-cols-2"><div className="rounded-lg border bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><p className="text-sm text-slate-500">Estimated total payable</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(totalPayable)}</p></div><div className="rounded-lg border bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><p className="text-sm text-slate-500">Estimated total interest</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(totalInterest)}</p></div></div><div className="grid gap-6"><FinanceForm mode="loans" /><FinanceTable type="loans" rows={loans as unknown as Record<string, unknown>[]} /></div></AppShell>;
}
