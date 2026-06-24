import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.settings.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data: Record<string, string> = await req.json();
  await prisma.$transaction(
    Object.entries(data).map(([key, value]) =>
      prisma.settings.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  return NextResponse.json({ ok: true });
}
