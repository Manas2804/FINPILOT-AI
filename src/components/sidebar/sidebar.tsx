import Link from "next/link";
import { BarChart3, CreditCard, Home, Landmark, User, Wallet } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/income", label: "Income", icon: Wallet },
  { href: "/expenses", label: "Expenses", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/70 p-4 lg:block dark:border-slate-800 dark:bg-slate-950/70">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2 font-semibold"><Home size={18} /> FINPILOT AI</Link>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900">
            <item.icon size={18} /> {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
