import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { createDemoUser, findDemoUserByEmail, isDemoStore } from "@/lib/database/demo-store";
import { registerSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  try {
    const data = registerSchema.parse(await request.json());
    const existing = isDemoStore
      ? await findDemoUserByEmail(data.email)
      : await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    const user = isDemoStore
      ? await createDemoUser(data)
      : await prisma.user.create({
          data: { name: data.name, email: data.email.toLowerCase(), password: await bcrypt.hash(data.password, 12) },
          select: { id: true, name: true, email: true },
        });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });
  }
}
