import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Ključevi dostupni bez autentifikacije (frontend ih čita)
const PUBLIC_KEYS_PREFIX = [
  "megamenu_", "rjesenja_", "proizvodi_", "onama_", "pomoc_", "kontakt_",
  "whatsapp_", "rjesenja_pages", "megamenu_rjesenja", "megamenu_proizvodi",
];

function isPublicKey(key: string) {
  return PUBLIC_KEYS_PREFIX.some(p => key.startsWith(p) || key === p);
}

export async function GET(req: Request) {
  const session = await auth();
  const all = await prisma.settings.findMany();
  const map = Object.fromEntries(
    all
      .filter(s => session || isPublicKey(s.key))
      .map(s => [s.key, s.value])
  );
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
  // Invalidira Vercel CDN cache za sve stranice koje koriste Settings
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
