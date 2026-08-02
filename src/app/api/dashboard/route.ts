import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/server";
import { getDashboard } from "@/services/dashboardService";

export async function GET() {
  try {
    return NextResponse.json(await getDashboard(await requireUserId()));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
