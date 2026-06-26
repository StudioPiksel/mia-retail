"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    category: "Vodiči", thumbnail: "", published: false
  });
  const [saving, setSaving] = useState(false);

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[čć]/g, "c").replace(/[šš]/g, "s")
      .replace(/[žž]/g, "z").replace(/đ/g, "d").replace(/[^a-z0-9-]/g, "");
  }

  async function handleSave(published: boolean) {
    setSaving(true);
    await fetch("/api/blog", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published, publishedAt: published ? new Date() : null })
    });
    router.push("/admin/blog");
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Novi blog post</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.back()} style={{ padding: "10px 18px", border: "1.5px solid #E2E8ED", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "'Satoshi', sans-serif" }}>
            Odustani
          </button>
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "10px 18px", border: "none", borderRadius: 8, background: "#E6EEF2", color: "#0B1D33", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
            Sačuvaj draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "10px 22px", border: "none", borderRadius: 8, background: "#0F766E", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
            Objavi
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Naslov *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                placeholder="Unesite naslov posta..." required style={{ ...inp, fontSize: 18, fontWeight: 600 }} />
            </div>
            <div>
              <label style={lbl}>Slug (URL)</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="kako-opremiti-supermarket" style={inp} />
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
            <label style={lbl}>Kratak opis (excerpt)</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Kratki opis koji se prikazuje u listingu..." rows={3}
              style={{ ...inp, resize: "vertical" }} />
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
            <label style={{ ...lbl, marginBottom: 10 }}>Sadržaj</label>
            <BlogEditor value={form.content} onChange={v => setForm({ ...form, content: v })} />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 }}>
            <strong style={{ fontSize: 13, color: "#0B1D33", display: "block", marginBottom: 16 }}>Kategorija</strong>
            {["Vodiči", "Analize", "Trendovi"].map(cat => (
              <label key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                <input type="radio" name="cat" checked={form.category === cat} onChange={() => setForm({ ...form, category: cat })} />
                <span style={{ fontSize: 14, color: "#374151" }}>{cat}</span>
              </label>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 }}>
            <ImageUpload label="Thumbnail slika" value={form.thumbnail} onChange={v => setForm({ ...form, thumbnail: v })} maxWidthPx={1200} qualityWebp={0.85} />
          </div>
        </div>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inp: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8,
  fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none",
  boxSizing: "border-box", color: "#111827", background: "#fff", display: "block"
};
