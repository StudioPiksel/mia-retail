"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState, useRef } from "react";
import ImageUpload from "./ImageUpload";

type Product = {
  id: string; title: string; series?: string; images: string;
  subGroup?: string; category: { name: string; slug: string };
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

// ── Toolbar button ─────────────────────────────────────────────────────────────
function TB({ active, onClick, title, children, style }: {
  active?: boolean; onClick: () => void; title?: string;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: "5px 10px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
        background: active ? "rgba(199,241,230,0.25)" : "rgba(255,255,255,0.08)",
        color: active ? "#C7F1E6" : "#fff", cursor: "pointer",
        fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: active ? 700 : 500,
        display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 2px", flexShrink: 0 }} />;
}

// ── Main Editor ────────────────────────────────────────────────────────────────
export default function BlogEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [htmlValue, setHtmlValue] = useState(value);
  const [showImg, setShowImg] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showProduct, setShowProduct] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showLink, setShowLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ allowBase64: true, inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Počnite pisati vaš post..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
      setHtmlValue(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-content",
        style: "outline:none;min-height:400px;padding:20px 24px;font-family:'Satoshi',sans-serif;font-size:15px;line-height:1.75;color:#111827;",
      },
    },
  });

  // Sync incoming value changes (e.g. when loading saved content)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      setHtmlValue(value);
    }
  }, []);

  // Load products when picker opens
  useEffect(() => {
    if (showProduct && products.length === 0) {
      fetch("/api/products").then(r => r.json()).then(setProducts);
    }
  }, [showProduct]);

  function switchToHtml() {
    setHtmlValue(editor?.getHTML() ?? "");
    setMode("html");
  }

  function switchToVisual() {
    editor?.commands.setContent(htmlValue);
    onChange(htmlValue);
    setMode("visual");
  }

  function insertImage(url: string) {
    editor?.chain().focus().setImage({ src: url, alt: "" }).run();
    setShowImg(false);
  }

  function insertVideo() {
    if (!videoUrl.trim() || !editor) return;
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    const viMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    let html = "";
    if (ytMatch) {
      html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:24px 0;"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe></div>`;
    } else if (viMatch) {
      html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:24px 0;"><iframe src="https://player.vimeo.com/video/${viMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe></div>`;
    } else {
      html = `<video src="${videoUrl}" controls style="width:100%;border-radius:12px;margin:24px 0;"></video>`;
    }
    editor.commands.insertContent(html);
    setVideoUrl(""); setShowVideo(false);
  }

  function insertProduct(prod: Product) {
    if (!editor) return;
    const img = (() => { try { return JSON.parse(prod.images)[0] ?? ""; } catch { return ""; } })();
    const zone = prod.subGroup ? slugify(prod.subGroup) : "";
    const url = `/proizvodi/${prod.category.slug}${zone ? `#${zone}` : ""}`;
    const html = `<a href="${url}" class="blog-product-card" style="display:flex;gap:16px;align-items:center;padding:16px 20px;background:#F8FAFB;border:1.5px solid #E2E8ED;border-radius:12px;text-decoration:none;margin:20px 0;">${img ? `<img src="${img}" alt="${prod.title}" style="width:72px;height:72px;object-fit:contain;border-radius:8px;background:#fff;flex-shrink:0;">` : ""}<div style="flex:1;"><div style="font-size:11px;font-weight:700;color:#0F766E;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">${prod.category.name}</div><div style="font-size:15px;font-weight:700;color:#0B1D33;margin-bottom:2px;">${prod.title}</div>${prod.series ? `<div style="font-size:12px;color:#6B7B8A;">${prod.series}</div>` : ""}</div><span style="font-size:13px;color:#0F766E;font-weight:600;white-space:nowrap;flex-shrink:0;">Pogledajte →</span></a>`;
    editor.commands.insertContent(html);
    setShowProduct(false); setProdSearch("");
  }

  function setLink() {
    if (!linkUrl.trim()) { editor?.chain().focus().unsetLink().run(); }
    else { editor?.chain().focus().setLink({ href: linkUrl }).run(); }
    setLinkUrl(""); setShowLink(false);
  }

  const filteredProducts = products.filter(p =>
    !prodSearch || p.title.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category.name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  if (!editor) return <div style={{ height: 400, background: "#F8FAFB", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>Učitavanje editora...</div>;

  return (
    <div style={{ border: "1.5px solid #E2E8ED", borderRadius: 10, overflow: "hidden" }}>
      {/* ── TOOLBAR ── */}
      <div style={{
        background: "#0B1D33", padding: "8px 12px",
        display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center",
      }}>
        {/* Headings */}
        <TB active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Naslov H2">H2</TB>
        <TB active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Naslov H3">H3</TB>
        <Divider />

        {/* Text format */}
        <TB active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Podebljano"><b>B</b></TB>
        <TB active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Kurziv"><i>I</i></TB>
        <TB active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Podcrtano"><u>U</u></TB>
        <TB active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citat">❝</TB>
        <Divider />

        {/* Lists */}
        <TB active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista s tačkama">• Lista</TB>
        <TB active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numerisana lista">1. Lista</TB>
        <Divider />

        {/* Align */}
        <TB active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Lijevo">⬅</TB>
        <TB active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centar">↔</TB>
        <Divider />

        {/* Link */}
        <TB active={editor.isActive("link")} onClick={() => { setLinkUrl(editor.getAttributes("link").href ?? ""); setShowLink(s => !s); setShowImg(false); setShowVideo(false); setShowProduct(false); }} title="Link">🔗 Link</TB>
        <Divider />

        {/* Media */}
        <TB active={showImg} onClick={() => { setShowImg(s => !s); setShowVideo(false); setShowProduct(false); setShowLink(false); }} title="Umetni sliku">🖼 Slika</TB>
        <TB active={showVideo} onClick={() => { setShowVideo(s => !s); setShowImg(false); setShowProduct(false); setShowLink(false); }} title="Umetni video">▶ Video</TB>
        <Divider />

        {/* Product insert */}
        <TB
          active={showProduct}
          onClick={() => { setShowProduct(s => !s); setShowImg(false); setShowVideo(false); setShowLink(false); }}
          title="Umetni product karticu"
          style={{ borderColor: showProduct ? "#C7F1E6" : undefined, color: showProduct ? "#C7F1E6" : "#fff" }}
        >
          📦 Ubaci proizvod
        </TB>

        {/* Mode toggle */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <TB active={mode === "visual"} onClick={switchToVisual}>✨ Vizualni</TB>
          <TB active={mode === "html"} onClick={switchToHtml}>&lt;/&gt; HTML</TB>
        </div>
      </div>

      {/* ── PANELS ── */}
      {showLink && (
        <div style={{ padding: "10px 14px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", gap: 8 }}>
          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..."
            onKeyDown={e => e.key === "Enter" && setLink()}
            style={{ flex: 1, padding: "7px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
          <button onClick={setLink} style={{ padding: "7px 14px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>Postavi link</button>
          <button onClick={() => { editor.chain().focus().unsetLink().run(); setShowLink(false); }} style={{ padding: "7px 12px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13 }}>Ukloni link</button>
        </div>
      )}

      {showImg && (
        <div style={{ padding: "14px 16px", background: "#F0FDF4", borderBottom: "1px solid #E2E8ED" }}>
          <ImageUpload value="" onChange={url => { if (url) insertImage(url); }} maxWidthPx={1200} qualityWebp={0.85} label="Odaberi ili uploaduj sliku" />
        </div>
      )}

      {showVideo && (
        <div style={{ padding: "10px 14px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", gap: 8 }}>
          <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && insertVideo()}
            placeholder="YouTube ili Vimeo URL..."
            style={{ flex: 1, padding: "7px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
          <button onClick={insertVideo} style={{ padding: "7px 14px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>Ubaci</button>
        </div>
      )}

      {showProduct && (
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8ED", maxHeight: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", background: "#F0FDF4", borderBottom: "1px solid #E2E8ED" }}>
            <p style={{ fontSize: 12, color: "#0A5C56", fontWeight: 600, margin: "0 0 6px" }}>Odaberi proizvod — ubacuje se kao kartica s linkom</p>
            <input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="Pretraži..." autoFocus
              style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredProducts.slice(0, 30).map(prod => {
              const img = (() => { try { return JSON.parse(prod.images)[0]; } catch { return null; } })();
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
                  <span style={{ fontSize: 18, color: "#0F766E", flexShrink: 0 }}>+</span>
                </button>
              );
            })}
            {filteredProducts.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#6B7B8A" }}>Nema rezultata</div>}
          </div>
        </div>
      )}

      {/* ── EDITOR CONTENT ── */}
      {mode === "visual" ? (
        <div style={{ background: "#fff" }}>
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div>
          <textarea
            value={htmlValue}
            onChange={e => { setHtmlValue(e.target.value); onChange(e.target.value); }}
            rows={22}
            style={{
              width: "100%", padding: "14px", border: "none", outline: "none",
              fontSize: 13, fontFamily: "monospace", resize: "vertical",
              lineHeight: 1.6, color: "#111827", background: "#fff", display: "block",
              boxSizing: "border-box",
            }}
          />
          <div style={{ padding: "8px 14px", background: "#F8FAFB", borderTop: "1px solid #E2E8ED", fontSize: 11, color: "#9CA3AF" }}>
            HTML mod — direktno uređivanje koda · prebaci na Vizualni da vidiš formatiran tekst
          </div>
        </div>
      )}

      {/* ── TipTap CSS ── */}
      <style>{`
        .tiptap-content h2 { font-size: 1.5rem; font-weight: 800; color: #0B1D33; margin: 28px 0 12px; line-height: 1.3; }
        .tiptap-content h3 { font-size: 1.2rem; font-weight: 700; color: #0B1D33; margin: 20px 0 8px; }
        .tiptap-content p { margin: 0 0 14px; }
        .tiptap-content strong { font-weight: 700; color: #0B1D33; }
        .tiptap-content em { font-style: italic; }
        .tiptap-content u { text-decoration: underline; }
        .tiptap-content blockquote { border-left: 4px solid #0F766E; padding: 12px 20px; background: #F0FDF4; margin: 20px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #374151; }
        .tiptap-content ul { padding-left: 20px; margin: 0 0 14px; }
        .tiptap-content ol { padding-left: 20px; margin: 0 0 14px; }
        .tiptap-content li { margin-bottom: 6px; }
        .tiptap-content a { color: #0F766E; text-decoration: underline; }
        .tiptap-content img { max-width: 100%; border-radius: 12px; margin: 20px 0; display: block; }
        .tiptap-content .blog-product-card:hover { border-color: #0F766E !important; }
        .tiptap-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #9CA3AF; pointer-events: none; height: 0; }
        .ProseMirror-focused { outline: none; }
      `}</style>
    </div>
  );
}
