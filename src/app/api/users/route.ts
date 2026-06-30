import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, name, password, role } = await req.json();
  if (!email || !name || !password || typeof password !== "string" || password.length < 8)
    return NextResponse.json({ error: "Email, ime i lozinka (min 8 znakova) su obavezni." }, { status: 400 });
  if (!["admin"].includes(role ?? "admin"))
    return NextResponse.json({ error: "Neispravna rola." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email već postoji." }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, name, password: hashed, role: "admin" } });
  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (id === (session.user as { id?: string }).id)
    return NextResponse.json({ error: "Ne možete obrisati vlastiti nalog." }, { status: 400 });

  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  if (adminCount <= 1)
    return NextResponse.json({ error: "Ne možete obrisati posljednjeg admina." }, { status: 400 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
