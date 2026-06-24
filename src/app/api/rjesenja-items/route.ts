import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const items = await prisma.rjesenjaItem.findMany({
    where: { rjesenjaSlug: slug },
    include: { product: { include: { category: true } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rjesenjaSlug, productId } = await req.json();

  const max = await prisma.rjesenjaItem.aggregate({
    where: { rjesenjaSlug },
    _max: { order: true },
  });
  const order = (max._max.order ?? -1) + 1;

  const item = await prisma.rjesenjaItem.create({
    data: { rjesenjaSlug, productId, order },
    include: { product: { include: { category: true } } },
  });
  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { items } = await req.json(); // [{ id, order }]
  await prisma.$transaction(
    items.map(({ id, order }: { id: string; order: number }) =>
      prisma.rjesenjaItem.update({ where: { id }, data: { order } })
    )
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.rjesenjaItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
