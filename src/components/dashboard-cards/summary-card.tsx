import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryCard({ title, value, detail, icon: Icon, tone = "emerald" }: { title: string; value: string; detail: string; icon: LucideIcon; tone?: "emerald" | "blue" | "amber" | "rose" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <span className={cn("grid size-10 place-items-center rounded-lg", tones[tone])}><Icon size={20} /></span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
