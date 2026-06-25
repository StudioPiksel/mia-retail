import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB max input
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: "Slika je prevelika (max 2MB)" }, { status: 400 });

  const allowed = ["image/webp", "image/jpeg", "image/png", "image/gif"];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: "Neispravni format" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename (WebP already compressed client-side)
  const ext = file.name.endsWith(".webp") ? "webp" : file.type.split("/")[1];
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
