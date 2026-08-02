import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, CreditCard, Landmark, ShieldCheck, Wallet } from "lucide-react";
import { Navbar } from "@/components/navbar/navbar";

const features = [
  ["Income Tracking", Wallet],
  ["Expense Management", CreditCard],
  ["Loan Tracking", Landmark],
  ["Financial Dashboard", BarChart3],
  ["Future AI Advisor Ready", BrainCircuit],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-700 shadow-sm dark:border-emerald-900 dark:bg-slate-900"><ShieldCheck size={16} /> Secure fintech foundation</div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-normal md:text-6xl">Your Personal Finance Operating System</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Track your money, understand your spending, and build a smarter financial future.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white">Get Started <ArrowRight size={18} /></Link><Link href="/login" className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-medium dark:border-slate-800 dark:bg-slate-900">Login</Link></div>
        </div>
        <div className="rounded-lg border border-white/60 bg-white/80 p-5 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="grid gap-4 sm:grid-cols-2">
            {["Income: Rs80,000", "Expenses: Rs50,000", "Savings: Rs30,000", "Savings Rate: 37.5%"].map((item) => <div key={item} className="rounded-lg border border-slate-100 p-5 dark:border-slate-800"><p className="text-sm text-slate-500">{item.split(":")[0]}</p><p className="mt-2 text-2xl font-semibold">{item.split(":")[1]}</p></div>)}
          </div>
          <div className="mt-5 h-40 rounded-lg bg-[linear-gradient(135deg,#059669,#2563eb)] p-5 text-white"><p className="text-sm opacity-80">Financial Health Score</p><p className="mt-3 text-5xl font-semibold">82</p><p className="mt-4 text-sm opacity-90">Strong savings with manageable loan burden.</p></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16"><h2 className="text-3xl font-semibold">Everything money, one workspace</h2><div className="mt-8 grid gap-4 md:grid-cols-5">{features.map(([label, Icon]) => <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><Icon className="text-emerald-600" /><p className="mt-4 font-medium">{String(label)}</p></div>)}</div></section>
      <section className="mx-auto max-w-7xl px-4 py-16"><h2 className="text-3xl font-semibold">How It Works</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{["Add your income", "Track expenses", "Understand your finances"].map((step, i) => <div key={step} className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><span className="text-sm text-emerald-600">Step {i + 1}</span><p className="mt-3 text-xl font-semibold">{step}</p></div>)}</div></section>
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">FINPILOT AI. Built for the next generation of personal financial intelligence.</footer>
    </main>
  );
}
