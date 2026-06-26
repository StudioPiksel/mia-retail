"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type MediaFile = { name: string; url: string; size: number; mtime: string };

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [copied, setCopied] = useState("");
  const [filter, setFilter] = useState("");

  async function load() {
    const data = await fetch("/api/media").then(r => r.json());
    setFiles(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function deleteFile(name: string) {
    if (!confirm(`Obrisati "${name}"?`)) return;
    await fetch("/api/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    await load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  const filtered = files.filter(f => !filter || f.name.toLowerCase().includes(filter.toLowerCase()));
  const totalMB = (files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Media Library</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{files.length} fajlova · {totalMB} MB ukupno</p>
        </div>
        <div style={{ maxWidth: 360 }}>
          <ImageUpload value="" onChange={() => load()} label="" maxWidthPx={1440} qualityWebp={0.85} />
        </div>
      </div>

      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Pretraži po imenu fajla..."
        style={{ padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, outline: "none", width: 300, marginBottom: 16, fontFamily: "'Satoshi', sans-serif" }} />

      {filtered.length === 0 ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#6B7B8A" }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>🖼</div>
          <div>Nema uploadovanih fajlova. Uploadujte sliku gore desno.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {filtered.map(f => {
            const isImg = /\.(webp|jpg|jpeg|png|gif|svg)$/i.test(f.name);
            const kb = (f.size / 1024).toFixed(0);
            const isCopied = copied === f.url;
            return (
              <div key={f.name} style={{ background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Preview */}
                <div style={{ height: 130, background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {isImg ? (
                    <img src={f.url} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                  ) : (
                    <span style={{ fontSize: 32, opacity: 0.3 }}>📄</span>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: "8px 10px", flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{kb} KB · {new Date(f.mtime).toLocaleDateString("sr-Latn")}</div>
                </div>
                {/* Actions */}
                <div style={{ padding: "7px 10px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 5 }}>
                  <button onClick={() => copyUrl(f.url)} style={{
                    flex: 1, padding: "5px 6px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Satoshi', sans-serif",
                    background: isCopied ? "#DCFCE7" : "#E6EEF2", color: isCopied ? "#16A34A" : "#0B1D33",
                  }}>
                    {isCopied ? "✓ Kopirano" : "Kopiraj URL"}
                  </button>
                  <button onClick={() => deleteFile(f.name)} style={{ padding: "5px 7px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
