import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; pid: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { pid } = await params;
  const data = await req.json();
  const p = await prisma.designProject.update({ where: { id: pid }, data });
  return NextResponse.json(p);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; pid: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { pid } = await params;
  await prisma.designProject.delete({ where: { id: pid } });
  return NextResponse.json({ ok: true });
}
