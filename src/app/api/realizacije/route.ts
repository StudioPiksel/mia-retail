import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.realizacija.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const max = await prisma.realizacija.aggregate({ _max: { order: true } });
  const item = await prisma.realizacija.create({
    data: { ...data, order: (max._max.order ?? -1) + 1 },
  });
  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { items } = await req.json();
  await prisma.$transaction(
    items.map(({ id, order }: { id: string; order: number }) =>
      prisma.realizacija.update({ where: { id }, data: { order } })
    )
  );
  return NextResponse.json({ ok: true });
}
