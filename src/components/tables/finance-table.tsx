"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function FinanceTable({ type, rows }: { type: "income" | "expenses" | "loans"; rows: Record<string, unknown>[] }) {
  const router = useRouter();
  async function remove(id: string) {
    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    router.refresh();
  }
  const cols = type === "loans" ? ["loanName", "loanType", "principalAmount", "interestRate", "emiAmount", "remainingAmount"] : type === "income" ? ["source", "category", "amount", "date"] : ["title", "category", "amount", "date"];
  return <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-900"><tr>{cols.map((c) => <th key={c} className="px-4 py-3 font-medium">{label(c)}</th>)}<th className="px-4 py-3" /></tr></thead><tbody>{rows.map((row) => <tr key={String(row.id)} className="border-t border-slate-100 dark:border-slate-800">{cols.map((c) => <td key={c} className="px-4 py-3">{cell(c, row[c])}</td>)}<td className="px-4 py-3 text-right"><button onClick={() => remove(String(row.id))} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button></td></tr>)}{!rows.length && <tr><td colSpan={cols.length + 1} className="px-4 py-8 text-center text-slate-500">No records yet.</td></tr>}</tbody></table></div></section>;
}

function label(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (x) => x.toUpperCase());
}

function cell(key: string, value: unknown) {
  if (key.toLowerCase().includes("amount") || key === "emiAmount") return formatCurrency(Number(value));
  if (key === "interestRate") return `${Number(value)}%`;
  if (key === "date") return formatDate(String(value));
  return String(value ?? "");
}
