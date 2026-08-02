import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { createLoan, listLoans } from "@/services/loanService";

export async function GET() {
  try {
    return NextResponse.json(await listLoans(await requireUserId()));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const loan = await createLoan(await requireUserId(), await request.json());
    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return NextResponse.json(loan, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid loan data" }, { status: 400 });
  }
}
