"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#059669", "#2563eb", "#f59e0b", "#e11d48", "#7c3aed", "#0891b2"];

export function IncomeExpenseChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  return <ChartShell title="Income vs Expense"><ResponsiveContainer width="100%" height={260}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="income" fill="#059669" radius={[6, 6, 0, 0]} /><Bar dataKey="expense" fill="#e11d48" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartShell>;
}

export function ExpensePieChart({ data }: { data: { name: string; value: number }[] }) {
  return <ChartShell title="Expense Categories"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data.length ? data : [{ name: "No expenses", value: 1 }]} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>{(data.length ? data : [{ name: "No expenses" }]).map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartShell>;
}

export function SavingsTrendChart({ data }: { data: { month: string; savings: number }[] }) {
  return <ChartShell title="Monthly Saving Trend"><ResponsiveContainer width="100%" height={260}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="savings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></ChartShell>;
}

export function LoanProgress({ loans }: { loans: { id: string; name: string; type: string; progress: number }[] }) {
  return <ChartShell title="Loan Overview"><div className="space-y-4">{loans.length ? loans.map((loan) => <div key={loan.id}><div className="flex justify-between text-sm"><span>{loan.name}</span><span>{loan.progress}% paid</span></div><div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${loan.progress}%` }} /></div></div>) : <p className="text-sm text-slate-500">No active loans yet.</p>}</div></ChartShell>;
}

function ChartShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"><h2 className="mb-4 font-semibold">{title}</h2>{children}</section>;
}
