import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const studios = await prisma.designStudio.findMany({
    orderBy: { order: "asc" },
    include: {
      projects: { where: { published: true }, orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json(studios);
}
