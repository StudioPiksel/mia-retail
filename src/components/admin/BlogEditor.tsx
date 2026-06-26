"use client";
import { useRef, useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

type Product = {
  id: string; title: string; series?: string; images: string;
  subGroup?: string; zoneLabel?: string;
  category: { name: string; slug: string };
};

interface Props {
  value: string;
  onChange: (v: string) => void;
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showImgUpload, setShowImgUpload] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [prodSearch, setProdSearch] = useState("");

  useEffect(() => {
    if (showProductPicker && products.length === 0) {
      fetch("/api/products").then(r => r.json()).then(setProducts);
    }
  }, [showProductPicker]);

  function insertAtCursor(html: string) {
    const ta = textareaRef.current;
    if (!ta) { onChange(value + html); return; }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = value.slice(0, start) + html + value.slice(end);
    onChange(newVal);
    // Restore cursor after inserted text
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + html.length, start + html.length);
    }, 0);
  }

  function wrapSelection(before: string, after: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || "tekst";
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newVal);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + selected.length); }, 0);
  }

  function insertImage(url: string) {
    insertAtCursor(`\n<img src="${url}" alt="" style="width:100%;border-radius:12px;margin:24px 0;" loading="lazy">\n`);
    setShowImgUpload(false);
  }

  function insertVideo() {
    if (!videoUrl.trim()) return;
    // Extract YouTube/Vimeo ID
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    const viMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (ytMatch) {
      insertAtCursor(`\n<div class="blog-video-wrap" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:24px 0;">
  <iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>
</div>\n`);
    } else if (viMatch) {
      insertAtCursor(`\n<div class="blog-video-wrap" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:24px 0;">
  <iframe src="https://player.vimeo.com/video/${viMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>
</div>\n`);
    } else {
      insertAtCursor(`\n<video src="${videoUrl}" controls style="width:100%;border-radius:12px;margin:24px 0;"></video>\n`);
    }
    setVideoUrl(""); setShowVideoInput(false);
  }

  function insertProduct(prod: Product) {
    const img = (() => { try { return JSON.parse(prod.images)[0] ?? ""; } catch { return ""; } })();
    // Build anchor: zone from subGroup
    const zone = prod.subGroup ? slugify(prod.subGroup) : "";
    const url = `/proizvodi/${prod.category.slug}${zone ? `#${zone}` : ""}`;

    const html = `
<a href="${url}" class="blog-product-card" style="display:flex;gap:16px;align-items:center;padding:16px 20px;background:#F8FAFB;border:1.5px solid #E2E8ED;border-radius:12px;text-decoration:none;margin:20px 0;transition:border-color 0.2s;">
  ${img ? `<img src="${img}" alt="${prod.title}" style="width:72px;height:72px;object-fit:contain;border-radius:8px;background:#fff;flex-shrink:0;">` : ""}
  <div style="flex:1;">
    <div style="font-size:11px;font-weight:700;color:#0F766E;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">${prod.category.name}</div>
    <div style="font-size:15px;font-weight:700;color:#0B1D33;margin-bottom:2px;">${prod.title}</div>
    ${prod.series ? `<div style="font-size:12px;color:#6B7B8A;">${prod.series}</div>` : ""}
  </div>
  <span style="font-size:13px;color:#0F766E;font-weight:600;white-space:nowrap;flex-shrink:0;">Pogledajte →</span>
</a>`;
    insertAtCursor(html);
    setShowProductPicker(false); setProdSearch("");
  }

  const filteredProducts = products.filter(p =>
    !prodSearch || p.title.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category.name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const TB: React.CSSProperties = {
    padding: "6px 10px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
    background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer",
    fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 500,
    display: "flex", alignItems: "center", gap: 5,
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        background: "#0B1D33", borderRadius: "10px 10px 0 0", padding: "8px 12px",
        display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center",
      }}>
        {/* Headings */}
        <button style={TB} onClick={() => insertAtCursor("\n<h2>Naslov</h2>\n")} title="H2">H2</button>
        <button style={TB} onClick={() => insertAtCursor("\n<h3>Podnaslov</h3>\n")} title="H3">H3</button>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />

        {/* Text formatting */}
        <button style={TB} onClick={() => wrapSelection("<strong>", "</strong>")} title="Bold"><b>B</b></button>
        <button style={TB} onClick={() => wrapSelection("<em>", "</em>")} title="Italic"><i>I</i></button>
        <button style={TB} onClick={() => insertAtCursor("\n<blockquote style=\"border-left:4px solid #0F766E;padding:12px 20px;background:#F0FDF4;margin:20px 0;border-radius:0 8px 8px 0;font-style:italic;\">Citat ili istaknuta rečenica</blockquote>\n")} title="Blockquote">❝</button>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />

        {/* List */}
        <button style={TB} onClick={() => insertAtCursor("\n<ul>\n  <li>Stavka 1</li>\n  <li>Stavka 2</li>\n  <li>Stavka 3</li>\n</ul>\n")} title="Lista">≡</button>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />

        {/* Media */}
        <button style={{ ...TB, background: showImgUpload ? "rgba(15,118,110,0.4)" : "rgba(255,255,255,0.08)" }}
          onClick={() => { setShowImgUpload(s => !s); setShowVideoInput(false); setShowProductPicker(false); }}>
          🖼 Slika
        </button>
        <button style={{ ...TB, background: showVideoInput ? "rgba(15,118,110,0.4)" : "rgba(255,255,255,0.08)" }}
          onClick={() => { setShowVideoInput(s => !s); setShowImgUpload(false); setShowProductPicker(false); }}>
          ▶ Video
        </button>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />

        {/* Product insert */}
        <button style={{ ...TB, background: showProductPicker ? "rgba(199,241,230,0.2)" : "rgba(255,255,255,0.08)", borderColor: showProductPicker ? "#C7F1E6" : "rgba(255,255,255,0.2)", color: showProductPicker ? "#C7F1E6" : "#fff" }}
          onClick={() => { setShowProductPicker(s => !s); setShowImgUpload(false); setShowVideoInput(false); }}>
          📦 Ubaci proizvod
        </button>
      </div>

      {/* Image upload panel */}
      {showImgUpload && (
        <div style={{ padding: "14px 16px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderTop: "none" }}>
          <ImageUpload value="" onChange={url => { if (url) insertImage(url); }} maxWidthPx={1200} qualityWebp={0.85} label="Odaberi ili uploadaj sliku" />
          <p style={{ fontSize: 11, color: "#6B7B8A", marginTop: 6 }}>Ili upiši URL ručno i pritisni Enter</p>
        </div>
      )}

      {/* Video URL panel */}
      {showVideoInput && (
        <div style={{ padding: "12px 16px", background: "#F8FAFB", border: "1px solid #E2E8ED", borderTop: "none", display: "flex", gap: 8 }}>
          <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && insertVideo()}
            placeholder="YouTube / Vimeo URL ili direktan link na video..."
            style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
          <button onClick={insertVideo} style={{ padding: "8px 16px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
            Ubaci
          </button>
        </div>
      )}

      {/* Product picker panel */}
      {showProductPicker && (
        <div style={{ border: "1px solid #C7F1E6", borderTop: "none", borderRadius: "0 0 8px 8px", background: "#fff", maxHeight: 340, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8ED", background: "#F0FDF4" }}>
            <p style={{ fontSize: 12, color: "#0A5C56", fontWeight: 600, margin: "0 0 6px" }}>
              📦 Odaberi proizvod → ubacuje se kao kartica s linkom na konkretnu zonu
            </p>
            <input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="Pretraži po nazivu ili kategoriji..."
              autoFocus
              style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredProducts.slice(0, 30).map(prod => {
              const img = (() => { try { return JSON.parse(prod.images)[0]; } catch { return null; } })();
              const zone = prod.subGroup ? slugify(prod.subGroup) : "";
              const url = `/proizvodi/${prod.category.slug}${zone ? `#${zone}` : ""}`;
              return (
                <button key={prod.id} onClick={() => insertProduct(prod)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                  border: "none", borderBottom: "1px solid #F8FAFB", background: "#fff",
                  cursor: "pointer", textAlign: "left", fontFamily: "'Satoshi', sans-serif",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F0FDF4")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <div style={{ width: 40, height: 40, background: "#F8FAFB", borderRadius: 6, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7B8A" }}>{prod.category.name}{prod.subGroup ? ` · ${prod.subGroup}` : ""}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>→ {url.slice(0, 30)}...</div>
                </button>
              );
            })}
            {filteredProducts.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "#6B7B8A", fontSize: 13 }}>Nema rezultata</div>
            )}
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={22}
        placeholder="<p>Unesite sadržaj posta u HTML formatu...</p>"
        style={{
          width: "100%", padding: "14px", border: "1.5px solid #E2E8ED",
          borderTop: "none", borderRadius: "0 0 10px 10px",
          fontSize: 13, fontFamily: "monospace", outline: "none",
          boxSizing: "border-box", color: "#111827", background: "#fff",
          resize: "vertical", lineHeight: 1.6,
        }}
      />
      <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
        HTML · &lt;h2&gt; &lt;p&gt; &lt;ul&gt;&lt;li&gt; &lt;strong&gt; &lt;blockquote&gt; &lt;img&gt; · video embed ubacuje se automatski iz YouTube/Vimeo URL-a
      </p>
    </div>
  );
}
