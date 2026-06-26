import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");

  const where = categorySlug
    ? { category: { slug: categorySlug }, published: true }
    : { published: true };

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      categoryMaps: { include: { category: true } },
    },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const product = await prisma.product.create({ data, include: { category: true } });
  return NextResponse.json(product);
}
