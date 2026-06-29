import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const studios = await prisma.designStudio.findMany({
    orderBy: { order: "asc" },
    include: {
      projects: { orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json(studios);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { badge, name, tag } = await req.json();
  const max = await prisma.designStudio.aggregate({ _max: { order: true } });
  const studio = await prisma.designStudio.create({
    data: { badge: badge.toUpperCase().slice(0, 3), name, tag, order: (max._max.order ?? -1) + 1 },
    include: { projects: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(studio);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, badge, name, tag } = await req.json();
  const studio = await prisma.designStudio.update({
    where: { id },
    data: { ...(badge && { badge: badge.toUpperCase().slice(0, 3) }), ...(name && { name }), ...(tag && { tag }) },
  });
  return NextResponse.json(studio);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const count = await prisma.designProject.count({ where: { studioId: id } });
  if (count > 0) return NextResponse.json({ error: `Studio ima ${count} projekata. Obrišite ih prvo.` }, { status: 400 });
  await prisma.designStudio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
