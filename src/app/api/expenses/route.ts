import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { createExpense, listExpenses } from "@/services/expenseService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    return NextResponse.json(await listExpenses(await requireUserId(), {
      category: url.searchParams.get("category") || undefined,
      min: url.searchParams.get("min") ? Number(url.searchParams.get("min")) : undefined,
      max: url.searchParams.get("max") ? Number(url.searchParams.get("max")) : undefined,
    }));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const expense = await createExpense(await requireUserId(), await request.json());
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid expense data" }, { status: 400 });
  }
}
