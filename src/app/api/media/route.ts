import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readdir, stat, unlink } from "fs/promises";
import { join, relative } from "path";

const PUBLIC = join(process.cwd(), "public");

type MediaFile = { name: string; url: string; size: number; mtime: string; folder: string };

async function scanDir(dir: string, base: string, files: MediaFile[] = []): Promise<MediaFile[]> {
  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const full = join(dir, entry);
      const s = await stat(full).catch(() => null);
      if (!s) continue;
      if (s.isDirectory()) {
        await scanDir(full, base, files);
      } else if (/\.(webp|jpg|jpeg|png|gif|svg|avif)$/i.test(entry)) {
        const rel = relative(PUBLIC, full).replace(/\\/g, "/");
        const folder = relative(PUBLIC, dir).replace(/\\/g, "/");
        files.push({ name: entry, url: `/${rel}`, size: s.size, mtime: s.mtime.toISOString(), folder });
      }
    }
  } catch {}
  return files;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder"); // filter by folder prefix

  const [uploads, assets] = await Promise.all([
    scanDir(join(PUBLIC, "uploads"), PUBLIC),
    scanDir(join(PUBLIC, "assets", "images"), PUBLIC),
  ]);

  let all = [...uploads, ...assets].sort((a, b) => b.mtime.localeCompare(a.mtime));

  if (folder) {
    all = all.filter(f => f.folder === folder || f.folder.startsWith(folder + "/"));
  }

  return NextResponse.json(all);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url } = await req.json();
  if (!url || !url.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Možete brisati samo uploadovane fajlove" }, { status: 400 });
  }
  // Resolve punu putanju i provjeri da ostaje unutar UPLOAD_DIR (štiti od %2e%2e i sličnih)
  const uploadsDir = join(PUBLIC, "uploads");
  const resolved = require("path").resolve(uploadsDir, url.replace("/uploads/", ""));
  if (!resolved.startsWith(uploadsDir + require("path").sep) && resolved !== uploadsDir) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  await unlink(resolved);
  return NextResponse.json({ ok: true });
}
