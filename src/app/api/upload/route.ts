import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

// Magic bytes za svaki dozvoljeni format
const MAGIC: Record<string, { bytes: number[]; ext: string }> = {
  "image/jpeg": { bytes: [0xFF, 0xD8, 0xFF], ext: "jpg" },
  "image/png":  { bytes: [0x89, 0x50, 0x4E, 0x47], ext: "png" },
  "image/gif":  { bytes: [0x47, 0x49, 0x46], ext: "gif" },
  "image/webp": { bytes: [0x52, 0x49, 0x46, 0x46], ext: "webp" },
};

function detectMime(buffer: Buffer): string | null {
  for (const [mime, { bytes }] of Object.entries(MAGIC)) {
    if (bytes.every((b, i) => buffer[i] === b)) return mime;
  }
  return null;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: "Slika je prevelika (max 2MB)" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Provjera stvarnog sadržaja fajla (magic bytes) — ne oslanjamo se na Content-Type od klijenta
  const realMime = detectMime(buffer);
  if (!realMime) return NextResponse.json({ error: "Neispravni format — dozvoljeni: JPG, PNG, GIF, WebP" }, { status: 400 });

  const ext = MAGIC[realMime].ext;
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
