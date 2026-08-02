import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppShell } from "@/components/app-shell";
import { authOptions } from "@/lib/auth/options";
import { findDemoUserById, isDemoStore, updateDemoUser } from "@/lib/database/demo-store";
import { prisma } from "@/lib/database/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const user = isDemoStore
    ? await findDemoUserById(session.user.id)
    : await prisma.user.findUniqueOrThrow({ where: { id: session.user.id }, select: { name: true, email: true, createdAt: true } });
  if (!user) redirect("/login");
  async function updateProfile(formData: FormData) {
    "use server";
    const active = await getServerSession(authOptions);
    if (!active?.user?.id) redirect("/login");
    if (isDemoStore) updateDemoUser(active.user.id, String(formData.get("name") || ""));
    else await prisma.user.update({ where: { id: active.user.id }, data: { name: String(formData.get("name") || "") } });
    revalidatePath("/profile");
  }
  return <AppShell title="Profile" subtitle="Manage your account identity."><section className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"><p className="text-sm text-slate-500">Email</p><p className="mt-1 font-medium">{user.email}</p><p className="mt-5 text-sm text-slate-500">Account created</p><p className="mt-1 font-medium">{user.createdAt.toLocaleDateString("en-IN")}</p><form action={updateProfile} className="mt-6 space-y-3"><label className="block text-sm font-medium">Name<input name="name" defaultValue={user.name} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></label><button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-white">Update profile</button></form></section></AppShell>;
}
