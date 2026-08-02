import { Sidebar } from "@/components/sidebar/sidebar";

export function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <section className="min-w-0 flex-1 p-4 md:p-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-emerald-600">FINPILOT AI</p>
          <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
        </header>
        {children}
      </section>
    </main>
  );
}
