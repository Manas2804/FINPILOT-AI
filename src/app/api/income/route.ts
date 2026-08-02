import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { createIncome, listIncomes } from "@/services/incomeService";

export async function GET() {
  try {
    return NextResponse.json(await listIncomes(await requireUserId()));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const income = await createIncome(await requireUserId(), await request.json());
    revalidatePath("/income");
    revalidatePath("/dashboard");
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Invalid income data" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 400 });
  }
}
