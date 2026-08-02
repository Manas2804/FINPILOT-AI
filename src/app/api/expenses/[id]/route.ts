import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { deleteExpense, updateExpense } from "@/services/expenseService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const expense = await updateExpense(await requireUserId(), (await params).id, await request.json());
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return NextResponse.json(expense);
  } catch {
    return NextResponse.json({ error: "Unable to update expense" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const expense = await deleteExpense(await requireUserId(), (await params).id);
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return NextResponse.json(expense);
  } catch {
    return NextResponse.json({ error: "Unable to delete expense" }, { status: 400 });
  }
}
