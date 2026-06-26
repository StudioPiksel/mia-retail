import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: all category maps for a product
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const maps = await prisma.productCategoryMap.findMany({
    where: { productId },
    include: { category: true },
  });
  return NextResponse.json(maps);
}

// POST: add product to an extra category
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productId, categoryId } = await req.json();

  const existing = await prisma.productCategoryMap.findUnique({
    where: { productId_categoryId: { productId, categoryId } },
  });
  if (existing) return NextResponse.json(existing);

  const map = await prisma.productCategoryMap.create({
    data: { productId, categoryId },
    include: { category: true },
  });
  return NextResponse.json(map);
}

// DELETE: remove product from an extra category
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productId, categoryId } = await req.json();

  await prisma.productCategoryMap.deleteMany({
    where: { productId, categoryId },
  });
  return NextResponse.json({ ok: true });
}
