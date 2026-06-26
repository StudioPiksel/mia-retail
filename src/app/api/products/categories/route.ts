import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.productCategory.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, slug } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: "name and slug required" }, { status: 400 });

  const max = await prisma.productCategory.aggregate({ _max: { order: true } });
  const category = await prisma.productCategory.create({
    data: { name, slug, order: (max._max.order ?? -1) + 1 },
  });
  return NextResponse.json(category);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, name } = await req.json();
  const category = await prisma.productCategory.update({ where: { id }, data: { name } });
  return NextResponse.json(category);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return NextResponse.json({ error: `Kategorija ima ${count} proizvoda. Premjestite ih prije brisanja.` }, { status: 400 });
  await prisma.productCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
