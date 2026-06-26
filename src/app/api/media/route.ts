import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const files = await readdir(UPLOAD_DIR);
    const items = await Promise.all(
      files.filter(f => !f.startsWith(".")).map(async (f) => {
        const s = await stat(join(UPLOAD_DIR, f));
        return { name: f, url: `/uploads/${f}`, size: s.size, mtime: s.mtime };
      })
    );
    return NextResponse.json(items.sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime()));
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json();
  if (!name || name.includes("..")) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  await unlink(join(UPLOAD_DIR, name));
  return NextResponse.json({ ok: true });
}
