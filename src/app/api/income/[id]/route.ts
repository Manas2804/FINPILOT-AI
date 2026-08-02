import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { deleteIncome, updateIncome } from "@/services/incomeService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const income = await updateIncome(await requireUserId(), (await params).id, await request.json());
    revalidatePath("/income");
    revalidatePath("/dashboard");
    return NextResponse.json(income);
  } catch {
    return NextResponse.json({ error: "Unable to update income" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const income = await deleteIncome(await requireUserId(), (await params).id);
    revalidatePath("/income");
    revalidatePath("/dashboard");
    return NextResponse.json(income);
  } catch {
    return NextResponse.json({ error: "Unable to delete income" }, { status: 400 });
  }
}
