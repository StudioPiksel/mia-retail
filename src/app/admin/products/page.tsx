"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string; title: string; series?: string; published: boolean; order: number;
  images: string; specs: string;
  category: { id: string; name: string; slug: string };
};
type Category = { id: string; name: string; slug: string };

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const [prods, cats] = await Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/products/categories").then(r => r.json()),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function togglePublish(p: Product) {
    await fetch(`/api/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Obrisati proizvod?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
  }

  const filtered = products
    .filter(p => catFilter === "all" || p.category.slug === catFilter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const firstImg = (p: Product) => {
    try { const imgs = JSON.parse(p.images); return imgs[0] || null; } catch { return null; }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Proizvodi</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{products.length} proizvoda u bazi</p>
        </div>
        <Link href="/admin/products/new" style={{
          padding: "11px 22px", background: "#0F766E", color: "#fff",
          borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600
        }}>+ Novi proizvod</Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Pretraži proizvode..."
          style={{ padding: "9px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, outline: "none", width: 220, fontFamily: "'Satoshi', sans-serif" }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setCatFilter("all")} style={pillStyle(catFilter === "all")}>Sve</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.slug)} style={pillStyle(catFilter === c.slug)}>{c.name}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#6B7B8A" }}>Učitavanje...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map(p => {
            const img = firstImg(p);
            return (
              <div key={p.id} style={{
                background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED",
                overflow: "hidden", display: "flex", flexDirection: "column",
                opacity: p.published ? 1 : 0.65
              }}>
                {/* Image */}
                <div style={{ height: 140, background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? (
                    <img src={img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                  ) : (
                    <span style={{ fontSize: 32, opacity: 0.2 }}>📦</span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "#0F766E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {p.category.name}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3 }}>{p.title}</div>
                  {p.series && <div style={{ fontSize: 12, color: "#6B7B8A" }}>{p.series}</div>}
                </div>

                {/* Actions */}
                <div style={{ padding: "10px 14px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => togglePublish(p)} style={{
                    padding: "5px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                    background: p.published ? "#DCFCE7" : "#F1F5F7",
                    color: p.published ? "#16A34A" : "#6B7B8A",
                  }}>{p.published ? "✓ Aktivan" : "○ Skriven"}</button>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <Link href={`/admin/products/${p.id}`} style={{
                      padding: "5px 10px", background: "#E6EEF2", color: "#0B1D33",
                      borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: "none"
                    }}>Uredi</Link>
                    <button onClick={() => handleDelete(p.id)} style={{
                      padding: "5px 10px", background: "#FEF2F2", color: "#DC2626",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500
                    }}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && !loading && (
            <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: "#6B7B8A" }}>
              Nema proizvoda sa ovim filterom.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
  borderColor: active ? "#0F766E" : "#E2E8ED",
  background: active ? "#C7F1E6" : "#fff",
  color: active ? "#0A5C56" : "#6B7B8A",
  cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
  fontFamily: "'Satoshi', sans-serif",
});
