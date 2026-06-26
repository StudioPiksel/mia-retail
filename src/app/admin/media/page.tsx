"use client";
import { useEffect, useState, useMemo } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type MediaFile = { name: string; url: string; size: number; mtime: string; folder: string };

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  async function load() {
    setLoading(true);
    const data = await fetch("/api/media").then(r => r.json());
    setFiles(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function deleteFile(url: string, name: string) {
    if (!url.startsWith("/uploads/")) {
      alert("Asset slike se ne mogu brisati iz media library-ja. Brisanje je moguće samo za uploadovane fajlove.");
      return;
    }
    if (!confirm(`Obrisati "${name}"?`)) return;
    await fetch("/api/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    await load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  // Build folder tree from all files
  const folders = useMemo(() => {
    const set = new Set<string>();
    files.forEach(f => {
      const parts = f.folder.split("/");
      // Add root folders and up to 2 levels deep
      if (parts.length >= 1) set.add(parts[0]);
      if (parts.length >= 2) set.add(`${parts[0]}/${parts[1]}`);
      if (parts.length >= 3) set.add(`${parts[0]}/${parts[1]}/${parts[2]}`);
    });
    return Array.from(set).sort();
  }, [files]);

  // Filter files
  const filtered = useMemo(() => {
    return files.filter(f => {
      const matchFolder = !selectedFolder || f.folder === selectedFolder || f.folder.startsWith(selectedFolder + "/");
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.url.toLowerCase().includes(search.toLowerCase());
      return matchFolder && matchSearch;
    });
  }, [files, selectedFolder, search]);

  const totalMB = (files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);
  const filteredMB = (filtered.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);

  // Nice folder label
  function folderLabel(path: string) {
    const parts = path.split("/");
    const last = parts[parts.length - 1];
    const depth = parts.length - 1;
    return { label: last, depth };
  }

  return (
    <div style={{ display: "flex", gap: 0, minHeight: "calc(100vh - 120px)" }}>
      {/* ── SIDEBAR: Folder tree ── */}
      <div style={{
        width: 220, flexShrink: 0, background: "#fff", borderRadius: 12,
        border: "1px solid #E2E8ED", overflow: "hidden", alignSelf: "start",
        position: "sticky", top: 80,
      }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB" }}>
          <strong style={{ fontSize: 13, color: "#0B1D33" }}>Folderi</strong>
        </div>
        <div style={{ overflowY: "auto", maxHeight: "70vh" }}>
          {/* All */}
          <button onClick={() => setSelectedFolder(null)} style={{
            width: "100%", padding: "9px 14px", border: "none", textAlign: "left",
            background: !selectedFolder ? "#F0FDF4" : "transparent", cursor: "pointer",
            fontSize: 13, fontFamily: "'Satoshi', sans-serif",
            borderLeft: !selectedFolder ? "3px solid #0F766E" : "3px solid transparent",
            color: !selectedFolder ? "#0B1D33" : "#374151", fontWeight: !selectedFolder ? 600 : 400,
          }}>
            Sve slike <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>({files.length})</span>
          </button>

          {/* Uploads folder */}
          {folders.some(f => f.startsWith("uploads")) && (
            <>
              <div style={{ padding: "6px 14px 3px", fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Uploadovano</div>
              {["uploads"].map(f => {
                const count = files.filter(fi => fi.folder === f || fi.folder.startsWith(f + "/")).length;
                const active = selectedFolder === f;
                return (
                  <button key={f} onClick={() => setSelectedFolder(f === selectedFolder ? null : f)} style={{
                    width: "100%", padding: "7px 14px 7px 20px", border: "none", textAlign: "left",
                    background: active ? "#F0FDF4" : "transparent", cursor: "pointer",
                    fontSize: 12, fontFamily: "'Satoshi', sans-serif",
                    borderLeft: active ? "3px solid #0F766E" : "3px solid transparent",
                    color: active ? "#0B1D33" : "#374151", fontWeight: active ? 600 : 400,
                  }}>
                    📁 {f} <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: 4 }}>({count})</span>
                  </button>
                );
              })}
            </>
          )}

          {/* Assets folders */}
          <div style={{ padding: "6px 14px 3px", fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Assets</div>
          {folders.filter(f => f.startsWith("assets")).map(f => {
            const { label, depth } = folderLabel(f);
            const count = files.filter(fi => fi.folder === f || fi.folder.startsWith(f + "/")).length;
            const active = selectedFolder === f;
            return (
              <button key={f} onClick={() => setSelectedFolder(f === selectedFolder ? null : f)} style={{
                width: "100%", padding: `6px 14px 6px ${14 + depth * 10}px`, border: "none", textAlign: "left",
                background: active ? "#F0FDF4" : "transparent", cursor: "pointer",
                fontSize: 12, fontFamily: "'Satoshi', sans-serif",
                borderLeft: active ? "3px solid #0F766E" : "3px solid transparent",
                color: active ? "#0B1D33" : "#374151", fontWeight: active ? 600 : 400,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>📁 {label}</span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN: Files ── */}
      <div style={{ flex: 1, paddingLeft: 20, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Media Library</h1>
            <p style={{ color: "#6B7B8A", fontSize: 13, marginTop: 3 }}>
              {loading ? "Učitavanje..." : `${filtered.length} fajlova${selectedFolder ? ` u ${selectedFolder}` : ""} · ${filteredMB} MB`}
              {!selectedFolder && ` · Ukupno: ${files.length} · ${totalMB} MB`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* View toggle */}
            <button onClick={() => setView("grid")} style={{ padding: "7px 10px", border: "1.5px solid", borderColor: view === "grid" ? "#0F766E" : "#E2E8ED", borderRadius: 7, background: view === "grid" ? "#C7F1E6" : "#fff", cursor: "pointer", fontSize: 14, color: view === "grid" ? "#0A5C56" : "#6B7B8A" }}>⊞</button>
            <button onClick={() => setView("list")} style={{ padding: "7px 10px", border: "1.5px solid", borderColor: view === "list" ? "#0F766E" : "#E2E8ED", borderRadius: 7, background: view === "list" ? "#C7F1E6" : "#fff", cursor: "pointer", fontSize: 14, color: view === "list" ? "#0A5C56" : "#6B7B8A" }}>☰</button>
          </div>
        </div>

        {/* Search + Upload */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži po imenu..."
            style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'Satoshi', sans-serif" }} />
          <div style={{ minWidth: 240 }}>
            <ImageUpload value="" onChange={() => load()} maxWidthPx={1440} qualityWebp={0.85} />
          </div>
        </div>

        {/* Files grid / list */}
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#6B7B8A" }}>Skeniranje fajlova...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#6B7B8A" }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>🖼</div>
            <div>Nema fajlova{search ? ` za "${search}"` : ""}</div>
          </div>
        ) : view === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {filtered.map(f => {
              const isCopied = copied === f.url;
              const kb = (f.size / 1024).toFixed(0);
              const canDelete = f.url.startsWith("/uploads/");
              const isImg = /\.(webp|jpg|jpeg|png|gif)$/i.test(f.name);
              return (
                <div key={f.url} style={{ background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 120, background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => copyUrl(f.url)}>
                    {isImg ? (
                      <img src={f.url} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} loading="lazy" />
                    ) : (
                      <span style={{ fontSize: 32, opacity: 0.3 }}>📄</span>
                    )}
                  </div>
                  <div style={{ padding: "7px 9px", flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1 }}>{kb} KB</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 4 }}>
                    <button onClick={() => copyUrl(f.url)} style={{
                      flex: 1, padding: "4px 5px", borderRadius: 5, border: "none", cursor: "pointer",
                      fontSize: 10, fontWeight: 600, fontFamily: "'Satoshi', sans-serif",
                      background: isCopied ? "#DCFCE7" : "#E6EEF2", color: isCopied ? "#16A34A" : "#0B1D33",
                    }}>{isCopied ? "✓ Kopirano" : "Kopiraj URL"}</button>
                    {canDelete && (
                      <button onClick={() => deleteFile(f.url, f.name)} style={{ padding: "4px 6px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11 }}>✕</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List view */
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr 80px 90px 80px", gap: 0, padding: "8px 14px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", fontSize: 11, color: "#6B7B8A", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Naziv</span><span>URL</span><span>Veličina</span><span></span><span></span>
            </div>
            {filtered.map(f => {
              const isCopied = copied === f.url;
              const kb = (f.size / 1024).toFixed(0);
              const canDelete = f.url.startsWith("/uploads/");
              const isImg = /\.(webp|jpg|jpeg|png|gif)$/i.test(f.name);
              return (
                <div key={f.url} style={{ display: "grid", gridTemplateColumns: "2fr 3fr 80px 90px 80px", gap: 0, padding: "8px 14px", borderBottom: "1px solid #F8FAFB", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
                    {isImg ? (
                      <img src={f.url} alt="" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 4, flexShrink: 0, background: "#F8FAFB" }} loading="lazy" />
                    ) : (
                      <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
                    )}
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#6B7B8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.url}</span>
                  <span style={{ fontSize: 11, color: "#6B7B8A" }}>{kb} KB</span>
                  <button onClick={() => copyUrl(f.url)} style={{
                    padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 600, fontFamily: "'Satoshi', sans-serif",
                    background: isCopied ? "#DCFCE7" : "#E6EEF2", color: isCopied ? "#16A34A" : "#0B1D33",
                  }}>{isCopied ? "✓" : "Kopiraj"}</button>
                  <div>
                    {canDelete && (
                      <button onClick={() => deleteFile(f.url, f.name)} style={{ padding: "5px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Obriši</button>
                    )}
                    {!canDelete && <span style={{ fontSize: 10, color: "#9CA3AF" }}>Asset</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
