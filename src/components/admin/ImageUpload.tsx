"use client";
import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxWidthPx?: number;   // resize if wider (default 1280)
  qualityWebp?: number;  // WebP quality 0-1 (default 0.82)
  maxInputMB?: number;   // max original file size (default 8)
}

export default function ImageUpload({
  value,
  onChange,
  label,
  maxWidthPx = 1280,
  qualityWebp = 0.82,
  maxInputMB = 8,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function compressToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > maxWidthPx) { h = Math.round(h * (maxWidthPx / w)); w = maxWidthPx; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("Kompresija nije uspjela")),
          "image/webp",
          qualityWebp
        );
      };
      img.onerror = () => reject(new Error("Slika se ne može učitati"));
      img.src = url;
    });
  }

  async function handleFile(file: File) {
    setError("");
    if (file.size > maxInputMB * 1024 * 1024) {
      setError(`Slika je prevelika (max ${maxInputMB}MB)`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Molimo odaberite sliku");
      return;
    }

    setUploading(true);
    try {
      // 1. Compress to WebP client-side
      const webpBlob = await compressToWebP(file);
      const sizeMB = (webpBlob.size / 1024 / 1024).toFixed(2);

      // 2. Show preview
      const previewUrl = URL.createObjectURL(webpBlob);
      setPreview(previewUrl);

      // 3. Upload to server
      const fd = new FormData();
      fd.append("file", new File([webpBlob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Upload nije uspio"); }
      const { url } = await res.json();
      onChange(url);
      setPreview(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Greška pri uploadu");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const displayImg = preview || (value && !value.startsWith("http") ? value : value);

  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* URL input */}
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/assets/images/... ili uploaduj →"
          style={{
            flex: 1, padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8,
            fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none",
            boxSizing: "border-box", color: "#111827", background: "#fff",
          }}
        />

        {/* Upload button */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload sliku (automatska WebP kompresija)"
          style={{
            padding: "9px 14px", background: uploading ? "#E2E8ED" : "#0F766E",
            color: uploading ? "#6B7B8A" : "#fff", border: "none", borderRadius: 8,
            cursor: uploading ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600,
            fontFamily: "'Satoshi', sans-serif", whiteSpace: "nowrap", flexShrink: 0,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {uploading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Kompresija...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              Upload
            </>
          )}
        </button>

        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>

      {/* Drag & drop zone + preview */}
      {(displayImg || true) && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            marginTop: 8, borderRadius: 8, overflow: "hidden",
            border: "1.5px dashed #E2E8ED", minHeight: 60,
            background: "#F8FAFB", cursor: "pointer", position: "relative",
          }}
          onClick={() => inputRef.current?.click()}
        >
          {displayImg ? (
            <img src={displayImg} alt="" style={{ width: "100%", maxHeight: 140, objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
              Prevuci sliku ovdje ili klikni Upload
            </div>
          )}
          {uploading && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "#0F766E", fontWeight: 600 }}>Kompresija i upload...</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#DC2626", background: "#FEF2F2", padding: "6px 10px", borderRadius: 6 }}>
          ⚠ {error}
        </div>
      )}

      {!uploading && !error && value && (
        <div style={{ marginTop: 4, fontSize: 11, color: "#6B7B8A" }}>
          WebP · max {maxWidthPx}px širine · kompresija pri uploadu
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
