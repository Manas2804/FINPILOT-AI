import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { deleteLoan, updateLoan } from "@/services/loanService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const loan = await updateLoan(await requireUserId(), (await params).id, await request.json());
    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return NextResponse.json(loan);
  } catch {
    return NextResponse.json({ error: "Unable to update loan" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const loan = await deleteLoan(await requireUserId(), (await params).id);
    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return NextResponse.json(loan);
  } catch {
    return NextResponse.json({ error: "Unable to delete loan" }, { status: 400 });
  }
}
