import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const max = await prisma.designProject.aggregate({ where: { studioId: id }, _max: { order: true } });
  const project = await prisma.designProject.create({
    data: { ...data, studioId: id, order: (max._max.order ?? -1) + 1 },
  });
  return NextResponse.json(project);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { items } = await req.json();
  await prisma.$transaction(
    items.map(({ id, order }: { id: string; order: number }) =>
      prisma.designProject.update({ where: { id }, data: { order } })
    )
  );
  return NextResponse.json({ ok: true });
}
