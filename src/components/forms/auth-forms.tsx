"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CircleUserRound } from "lucide-react";
import { registerSchema } from "@/lib/utils/validators";
import { apiRequest } from "@/lib/utils/api";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm({ defaultValues: { email: "", password: "" } });
  async function onSubmit(values: { email: string; password: string }) {
    setError("");
    const result = await signIn("credentials", { ...values, redirect: false });
    if (result?.ok) router.push("/dashboard");
    else setError("Invalid email or password");
  }
  return <AuthShell title="Welcome back" subtitle="Sign in to continue to your financial cockpit."><GoogleButton /><Divider /><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"><Input label="Email" type="email" {...form.register("email")} /><Input label="Password" type="password" {...form.register("password")} />{error && <p className="text-sm text-rose-600">{error}</p>}<button className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white">Login</button><p className="text-center text-sm text-slate-500">New here? <Link className="text-emerald-600" href="/register">Create account</Link></p></form></AuthShell>;
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", password: "" } });
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await apiRequest("/api/register", { method: "POST", body: JSON.stringify(values) });
      await signIn("credentials", { email: values.email, password: values.password, redirect: false });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    }
  }
  return <AuthShell title="Create your account" subtitle="Start tracking income, expenses, loans, and savings securely."><GoogleButton /><Divider /><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"><Input label="Full Name" {...form.register("name")} /><Input label="Email" type="email" {...form.register("email")} /><Input label="Password" type="password" {...form.register("password")} />{error && <p className="text-sm text-rose-600">{error}</p>}<button className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white">Get Started</button><p className="text-center text-sm text-slate-500">Already registered? <Link className="text-emerald-600" href="/login">Login</Link></p></form></AuthShell>;
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950"><section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"><h1 className="text-2xl font-semibold">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p><div className="mt-8">{children}</div></section></main>;
}

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => <label className="block text-sm font-medium"><span>{label}</span><input {...props} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950" /></label>;

function GoogleButton() {
  return <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-3 font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"><CircleUserRound size={18} /> Continue with Google</button>;
}

function Divider() {
  return <div className="mb-5 flex items-center gap-3 text-xs uppercase text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> or continue with email <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /></div>;
}
