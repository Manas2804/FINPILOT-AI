import { CreditCard, Gauge, PiggyBank, Wallet } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SummaryCard } from "@/components/dashboard-cards/summary-card";
import { ExpensePieChart, IncomeExpenseChart, LoanProgress, SavingsTrendChart } from "@/components/charts/finance-charts";
import { authOptions } from "@/lib/auth/options";
import { formatCurrency } from "@/lib/utils";
import { getDashboard } from "@/services/dashboardService";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const data = await getDashboard(session.user.id);
  return (
    <AppShell title="Financial Dashboard" subtitle="Current month performance, trends, and health signals.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Monthly Income" value={formatCurrency(data.summary.monthIncome)} detail="Current month income" icon={Wallet} />
        <SummaryCard title="Monthly Expense" value={formatCurrency(data.summary.monthExpenses)} detail="Includes active loan EMI" icon={CreditCard} tone="rose" />
        <SummaryCard title="Savings" value={formatCurrency(data.summary.savings)} detail={`${data.summary.savingsRate.toFixed(1)}% savings rate`} icon={PiggyBank} tone="blue" />
        <SummaryCard title="Financial Score" value={`${data.summary.score}/100`} detail="Income, savings, expenses, loans" icon={Gauge} tone="amber" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <IncomeExpenseChart data={data.charts.monthly} />
        <ExpensePieChart data={data.charts.expenseCategories} />
        <SavingsTrendChart data={data.charts.monthly} />
        <LoanProgress loans={data.loans} />
      </div>
    </AppShell>
  );
}
