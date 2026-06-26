"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useRouter, useParams } from "next/navigation";

export default function EditBlogPost() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    category: "Vodiči", thumbnail: "", published: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((data) => { setForm(data); setLoading(false); });
  }, [id]);

  async function handleSave(published: boolean) {
    setSaving(true);
    await fetch(`/api/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published, publishedAt: published ? new Date() : null }),
    });
    router.push("/admin/blog");
  }

  if (loading) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8,
    fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none",
    boxSizing: "border-box", color: "#111827", background: "#fff", display: "block",
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Uredi blog post</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.back()} style={{ padding: "10px 18px", border: "1.5px solid #E2E8ED", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "'Satoshi', sans-serif" }}>
            Odustani
          </button>
          <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "10px 18px", border: "none", borderRadius: 8, background: "#E6EEF2", color: "#0B1D33", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
            Sačuvaj draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: "10px 22px", border: "none", borderRadius: 8, background: "#0F766E", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
            {saving ? "Čuvanje..." : "Objavi"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Naslov *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ ...inp, fontSize: 18, fontWeight: 600 }} />
            </div>
            <div>
              <label style={lbl}>Slug (URL)</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inp} />
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
            <label style={lbl}>Kratak opis (excerpt)</label>
            <textarea value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3} style={{ ...inp, resize: "vertical" }} />
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
            <label style={lbl}>Sadržaj (HTML)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={20} style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
            <p style={{ fontSize: 12, color: "#6B7B8A", marginTop: 8 }}>
              Koristite HTML tagove: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;img&gt;...
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 }}>
            <strong style={{ fontSize: 13, color: "#0B1D33", display: "block", marginBottom: 16 }}>Status</strong>
            <div style={{
              padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: form.published ? "#DCFCE7" : "#F1F5F7",
              color: form.published ? "#16A34A" : "#6B7B8A"
            }}>
              {form.published ? "✓ Objavljeno" : "○ Draft"}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 }}>
            <strong style={{ fontSize: 13, color: "#0B1D33", display: "block", marginBottom: 16 }}>Kategorija</strong>
            {["Vodiči", "Analize", "Trendovi"].map((cat) => (
              <label key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                <input type="radio" name="cat" checked={form.category === cat} onChange={() => setForm({ ...form, category: cat })} />
                <span style={{ fontSize: 14, color: "#374151" }}>{cat}</span>
              </label>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 }}>
            <ImageUpload label="Thumbnail slika" value={form.thumbnail || ""} onChange={v => setForm({ ...form, thumbnail: v })} maxWidthPx={1200} qualityWebp={0.85} />
          </div>
        </div>
      </div>
    </div>
  );
}
