"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Category = { id: string; name: string; slug: string; order: number };
type Product = {
  id: string; title: string; series?: string; published: boolean; order: number;
  images: string; specs: string; categoryId: string; subGroup?: string;
  category: { id: string; name: string; slug: string };
};

type View = "kategorije" | "svi";

// ── Sortable product row ─────────────────────────────────────────────────────
function SortableRow({ p, onToggle, onDelete }: {
  p: Product;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
  const specs = (() => { try { return JSON.parse(p.specs) as string[]; } catch { return []; } })();

  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : p.published ? 1 : 0.6,
      display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
      background: isDragging ? "#F0FDF4" : "#fff",
      borderBottom: "1px solid #F1F5F7",
    }}>
      {/* Drag handle */}
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#CBD5DC", fontSize: 18, flexShrink: 0, userSelect: "none" }}>
        ⠿
      </div>
      {/* Thumbnail */}
      <div style={{ width: 48, height: 48, background: "#F8FAFB", borderRadius: 8, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
        <div style={{ fontSize: 12, color: "#6B7B8A", display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
          {p.series && <span style={{ color: "#0F766E", fontWeight: 500 }}>{p.series}</span>}
          {p.subGroup && <span style={{ color: "#9CA3AF" }}>· {p.subGroup}</span>}
          {specs.slice(0, 3).map(s => (
            <span key={s} style={{ background: "#E6EEF2", color: "#374151", padding: "1px 6px", borderRadius: 10, fontSize: 11 }}>{s}</span>
          ))}
        </div>
      </div>
      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
        <button onClick={onToggle} style={{
          padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500,
          background: p.published ? "#DCFCE7" : "#F1F5F7", color: p.published ? "#16A34A" : "#6B7B8A",
        }}>{p.published ? "✓ Aktivan" : "○ Skriven"}</button>
        <Link href={`/admin/products/${p.id}`} style={{ padding: "5px 12px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: "none" }}>
          Uredi
        </Link>
        <button onClick={onDelete} style={{ padding: "5px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProductsAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<View>("kategorije");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function load() {
    const [cats, prods] = await Promise.all([
      fetch("/api/products/categories").then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
    ]);
    setCategories(cats);
    setProducts(prods);
    if (!selectedCat && cats.length) setSelectedCat(cats[0].id);
  }
  useEffect(() => { load(); }, []);

  async function handleDragEnd(e: DragEndEvent, catProducts: Product[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = catProducts.findIndex(p => p.id === active.id);
    const ni = catProducts.findIndex(p => p.id === over.id);
    const reordered = arrayMove(catProducts, oi, ni);
    // Update local state
    const ids = new Set(reordered.map(p => p.id));
    setProducts(prev => [...prev.filter(p => !ids.has(p.id)), ...reordered]);
    // Save order to API
    setSaving(true);
    await Promise.all(reordered.map((p, idx) =>
      fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: idx }) })
    ));
    setSaving(false);
  }

  async function togglePublish(p: Product) {
    await fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    await load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Obrisati proizvod?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
  }

  // Category products sorted by order
  const catProducts = selectedCat
    ? products.filter(p => p.categoryId === selectedCat).sort((a, b) => a.order - b.order)
    : [];

  const selectedCatObj = categories.find(c => c.id === selectedCat);

  // All products with search
  const allFiltered = products.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.series ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Proizvodi</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{products.length} proizvoda u {categories.length} kategorija</p>
        </div>
        <Link href="/admin/products/new" style={{ padding: "11px 22px", background: "#0F766E", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          + Novi proizvod
        </Link>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E2E8ED", marginBottom: 24 }}>
        {[{ key: "kategorije" as View, label: "Po kategoriji" }, { key: "svi" as View, label: "Svi proizvodi" }].map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: view === t.key ? 700 : 400,
            color: view === t.key ? "#0F766E" : "#6B7B8A",
            borderBottom: view === t.key ? "2.5px solid #0F766E" : "2.5px solid transparent", marginBottom: -1,
          }}>{t.label}</button>
        ))}
        {saving && <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", fontSize: 13, color: "#6B7B8A", paddingBottom: 10 }}>Čuvanje redoslijeda...</span>}
      </div>

      {/* ── VIEW: PO KATEGORIJI ── */}
      {view === "kategorije" && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>
          {/* Category sidebar */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", position: "sticky", top: 80 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB" }}>
              <strong style={{ fontSize: 13, color: "#0B1D33" }}>Kategorije</strong>
            </div>
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              const active = selectedCat === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCat(cat.id)} style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "11px 16px", border: "none", textAlign: "left", cursor: "pointer",
                  background: active ? "#F0FDF4" : "#fff",
                  borderLeft: active ? "3px solid #0F766E" : "3px solid transparent",
                  fontFamily: "'Satoshi', sans-serif",
                }}>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#0B1D33" : "#374151" }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: "#6B7B8A", background: "#F1F5F7", padding: "2px 8px", borderRadius: 20 }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Product list for selected category */}
          <div>
            {selectedCatObj && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0B1D33", margin: 0 }}>{selectedCatObj.name}</h2>
                  <p style={{ fontSize: 13, color: "#6B7B8A", margin: "3px 0 0" }}>
                    {catProducts.length} proizvoda · prevuci za promjenu redoslijeda · redoslijed se odmah sačuva
                  </p>
                </div>
                <Link href="/admin/products/new" style={{ padding: "8px 16px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                  + Novi u ovoj kategoriji
                </Link>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
              {catProducts.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7B8A", fontSize: 14 }}>
                  Nema proizvoda u ovoj kategoriji.
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, catProducts)}>
                  <SortableContext items={catProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {catProducts.map(p => (
                      <SortableRow key={p.id} p={p} onToggle={() => togglePublish(p)} onDelete={() => deleteProduct(p.id)} />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW: SVI PROIZVODI ── */}
      {view === "svi" && (
        <div>
          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži po nazivu ili seriji..."
              style={{ padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, outline: "none", width: 320, fontFamily: "'Satoshi', sans-serif" }} />
            {search && <span style={{ marginLeft: 10, fontSize: 13, color: "#6B7B8A" }}>{allFiltered.length} rezultata</span>}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {allFiltered.map(p => {
              const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
              return (
                <div key={p.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", opacity: p.published ? 1 : 0.6, display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 130, background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} /> : <span style={{ opacity: 0.2, fontSize: 32 }}>📦</span>}
                  </div>
                  <div style={{ padding: "10px 12px", flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#0F766E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{p.category.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3 }}>{p.title}</div>
                    {p.series && <div style={{ fontSize: 11, color: "#6B7B8A", marginTop: 2 }}>{p.series}</div>}
                  </div>
                  <div style={{ padding: "8px 12px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 6 }}>
                    <button onClick={() => togglePublish(p)} style={{ padding: "4px 8px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 500, background: p.published ? "#DCFCE7" : "#F1F5F7", color: p.published ? "#16A34A" : "#6B7B8A" }}>
                      {p.published ? "✓" : "○"}
                    </button>
                    <Link href={`/admin/products/${p.id}`} style={{ flex: 1, padding: "4px 8px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 6, fontSize: 11, fontWeight: 500, textDecoration: "none", textAlign: "center" }}>Uredi</Link>
                    <button onClick={() => deleteProduct(p.id)} style={{ padding: "4px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
