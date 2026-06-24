"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Category = { id: string; name: string; slug: string };

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "", series: "", description: "", specs: "[]",
    images: "[]", categoryId: "", published: true, order: 0,
  });
  const [specsInput, setSpecsInput] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    fetch("/api/products/categories").then(r => r.json()).then((cats) => {
      setCategories(cats);
      if (isNew && cats.length) setForm(f => ({ ...f, categoryId: cats[0].id }));
    });
    if (!isNew) {
      fetch(`/api/products/${id}`).then(r => r.json()).then((p) => {
        setForm({
          title: p.title, series: p.series || "", description: p.description || "",
          specs: p.specs, images: p.images, categoryId: p.categoryId,
          published: p.published, order: p.order,
        });
        try { setSpecsInput(JSON.parse(p.specs).join(", ")); } catch {}
        try { setImagesList(JSON.parse(p.images)); } catch {}
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function addImage() {
    if (!newImageUrl.trim()) return;
    const updated = [...imagesList, newImageUrl.trim()];
    setImagesList(updated);
    setForm(f => ({ ...f, images: JSON.stringify(updated) }));
    setNewImageUrl("");
  }
  function removeImage(i: number) {
    const updated = imagesList.filter((_, idx) => idx !== i);
    setImagesList(updated);
    setForm(f => ({ ...f, images: JSON.stringify(updated) }));
  }
  function moveImage(i: number, dir: -1 | 1) {
    const updated = [...imagesList];
    const tmp = updated[i]; updated[i] = updated[i + dir]; updated[i + dir] = tmp;
    setImagesList(updated);
    setForm(f => ({ ...f, images: JSON.stringify(updated) }));
  }

  async function handleSave() {
    setSaving(true);
    const specs = specsInput ? JSON.stringify(specsInput.split(",").map(s => s.trim()).filter(Boolean)) : "[]";
    const payload = { ...form, specs, images: JSON.stringify(imagesList) };
    if (isNew) {
      await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch(`/api/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    router.push("/admin/products");
  }

  if (loading) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>
          {isNew ? "Novi proizvod" : "Uredi proizvod"}
        </h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.back()} style={btnGhost}>Odustani</button>
          <button onClick={handleSave} disabled={saving} style={btnPrimary}>
            {saving ? "Čuvanje..." : "Sačuvaj"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <label style={lbl}>Naziv proizvoda *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} placeholder="npr. Vertikalna vitrina — staklena vrata" />
          </div>

          <div style={card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Serija / Model</label>
                <input value={form.series} onChange={e => setForm({ ...form, series: e.target.value })} style={inp} placeholder="npr. CURVE, Premium, FGL-A" />
              </div>
              <div>
                <label style={lbl}>Kategorija *</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={inp}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={lbl}>Opis (opcionalno)</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Kratki opis proizvoda..." />
            </div>
          </div>

          <div style={card}>
            <label style={lbl}>Specs tagovi</label>
            <input value={specsInput} onChange={e => setSpecsInput(e.target.value)}
              style={inp} placeholder="LED, Niska potrošnja, Staklena vrata" />
            <p style={{ fontSize: 12, color: "#6B7B8A", marginTop: 6 }}>Razdvoji zarezom. Prikazuju se kao tagovi na karticama.</p>
            {specsInput && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {specsInput.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                  <span key={s} style={{ padding: "3px 10px", background: "#E6EEF2", color: "#374151", borderRadius: 20, fontSize: 12 }}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status */}
          <div style={card}>
            <strong style={{ fontSize: 13, color: "#0B1D33", display: "block", marginBottom: 14 }}>Status</strong>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              <span style={{ fontSize: 14, color: "#374151" }}>Aktivan (vidljiv na sajtu)</span>
            </label>
          </div>

          {/* Images */}
          <div style={card}>
            <strong style={{ fontSize: 13, color: "#0B1D33", display: "block", marginBottom: 14 }}>
              Slike ({imagesList.length})
            </strong>
            <p style={{ fontSize: 12, color: "#6B7B8A", marginBottom: 10 }}>
              Prva slika = thumbnail. Ostale = lightbox galerija.
            </p>

            {imagesList.map((img, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "8px 10px", background: "#F8FAFB", borderRadius: 8 }}>
                <img src={img} alt="" style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 6, background: "#fff", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#6B7B8A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.split("/").pop()}</span>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {i > 0 && <button onClick={() => moveImage(i, -1)} style={iconBtn}>↑</button>}
                  {i < imagesList.length - 1 && <button onClick={() => moveImage(i, 1)} style={iconBtn}>↓</button>}
                  <button onClick={() => removeImage(i)} style={{ ...iconBtn, color: "#DC2626" }}>✕</button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addImage()}
                placeholder="/assets/images/katalog/..." style={{ ...inp, flex: 1, fontSize: 12 }} />
              <button onClick={addImage} style={{ ...btnPrimary, padding: "8px 14px", fontSize: 13 }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 };
const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inp: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8,
  fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none",
  boxSizing: "border-box", color: "#111827", background: "#fff", display: "block"
};
const btnPrimary: React.CSSProperties = {
  padding: "10px 22px", background: "#0F766E", color: "#fff", border: "none",
  borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif"
};
const btnGhost: React.CSSProperties = {
  padding: "10px 18px", border: "1.5px solid #E2E8ED", background: "#fff",
  borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "'Satoshi', sans-serif"
};
const iconBtn: React.CSSProperties = {
  width: 24, height: 24, background: "#E6EEF2", border: "none",
  borderRadius: 4, cursor: "pointer", fontSize: 12, display: "flex",
  alignItems: "center", justifyContent: "center", padding: 0
};
