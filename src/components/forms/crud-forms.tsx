"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { incomeCategories, expenseCategories, loanTypes } from "@/lib/utils/constants";
import { apiRequest } from "@/lib/utils/api";

type Mode = "income" | "expenses" | "loans";

export function FinanceForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    const data = Object.fromEntries(formData.entries());
    try {
      await apiRequest(`/api/${mode}`, { method: "POST", body: JSON.stringify(data) });
      router.refresh();
      (document.getElementById(`${mode}-form`) as HTMLFormElement)?.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    }
  }
  if (mode === "loans") return <Panel title="Add Loan"><form id="loans-form" action={submit} className="grid gap-4 md:grid-cols-2"><Field name="loanName" label="Loan name" /><Select name="loanType" label="Loan type" options={loanTypes} /><Field name="principalAmount" label="Principal amount" type="number" /><Field name="interestRate" label="Interest rate" type="number" step="0.01" /><Field name="emiAmount" label="EMI amount" type="number" /><Field name="remainingAmount" label="Remaining amount" type="number" /><Field name="startDate" label="Start date" type="date" /><Field name="endDate" label="End date" type="date" /><Submit error={error} /></form></Panel>;
  const isIncome = mode === "income";
  return <Panel title={isIncome ? "Add Income" : "Add Expense"}><form id={`${mode}-form`} action={submit} className="grid gap-4 md:grid-cols-2"><Field name={isIncome ? "source" : "title"} label={isIncome ? "Source" : "Expense name"} /><Field name="amount" label="Amount" type="number" /><Select name="category" label="Category" options={isIncome ? incomeCategories : expenseCategories} /><Field name="date" label="Date" type="date" /><label className="md:col-span-2 text-sm font-medium">Description<textarea name="description" className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></label><Submit error={error} /></form></Panel>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"><h2 className="mb-4 font-semibold">{title}</h2>{children}</section>;
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return <label className="text-sm font-medium">{label}<input required {...rest} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></label>;
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label className="text-sm font-medium">{label}<select required name={name} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">{options.map((x) => <option key={x}>{x}</option>)}</select></label>;
}

function Submit({ error }: { error: string }) {
  return <div className="md:col-span-2">{error && <p className="mb-2 text-sm text-rose-600">{error}</p>}<button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white">Save</button></div>;
}
