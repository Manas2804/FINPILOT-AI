"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, Plane } from "lucide-react";

export function Navbar() {
  const { data } = useSession();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-white"><Plane size={18} /></span>
          FINPILOT AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex dark:text-slate-300">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/income">Income</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/loans">Loans</Link>
        </nav>
        <div className="flex items-center gap-3">
          {data?.user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><LogOut size={16} /> Sign out</button>
          ) : (
            <Link href="/login" className="rounded-lg bg-slate-950 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-950">Login</Link>
          )}
          <Menu className="md:hidden" size={22} />
        </div>
      </div>
    </header>
  );
}
