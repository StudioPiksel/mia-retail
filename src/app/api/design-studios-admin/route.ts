import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const studios = await prisma.designStudio.findMany({
    orderBy: { order: "asc" },
    include: { projects: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(studios);
}
