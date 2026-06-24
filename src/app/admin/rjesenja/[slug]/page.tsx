"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Product = { id: string; title: string; series?: string; images: string; category: { name: string } };
type RjesenjaItem = { id: string; order: number; product: Product };

const RJESENJA_LABELS: Record<string, string> = {
  supermarketi: "Supermarketi & Maloprodaja",
  "mesnice-ribarnice": "Mesnice & Ribarnice",
  horeca: "HoReCa & Ugostiteljstvo",
  pekare: "Pekare & Poslastičarnice",
  "apoteke-drogerije": "Apoteke & Drogerije",
};

function SortableCard({ item, onRemove }: { item: RjesenjaItem; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const img = (() => { try { return JSON.parse(item.product.images)[0]; } catch { return null; } })();

  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : 1,
      background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED",
      overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: isDragging ? "0 8px 24px rgba(11,29,51,0.15)" : "none",
      cursor: "grab",
    }}>
      <div {...attributes} {...listeners} style={{ height: 110, background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {img ? (
          <img src={img} alt={item.product.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
        ) : (
          <span style={{ fontSize: 28, opacity: 0.2 }}>📦</span>
        )}
        <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(11,29,51,0.5)", borderRadius: 4, padding: "2px 6px", color: "#fff", fontSize: 11 }}>
          ⠿ Prevuci
        </div>
      </div>
      <div style={{ padding: "10px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#0F766E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
          {item.product.category.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3 }}>{item.product.title}</div>
        {item.product.series && <div style={{ fontSize: 11, color: "#6B7B8A", marginTop: 2 }}>{item.product.series}</div>}
      </div>
      <div style={{ padding: "8px 12px", borderTop: "1px solid #F1F5F7" }}>
        <button onClick={() => onRemove(item.id)} style={{
          width: "100%", padding: "5px", background: "#FEF2F2", color: "#DC2626",
          border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "'Satoshi', sans-serif"
        }}>Ukloni</button>
      </div>
    </div>
  );
}

export default function RjesenjaEditor() {
  const { slug } = useParams<{ slug: string }>();
  const [items, setItems] = useState<RjesenjaItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    const [rjItems, prods, cats] = await Promise.all([
      fetch(`/api/rjesenja-items?slug=${slug}`).then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
      fetch("/api/products/categories").then(r => r.json()),
    ]);
    setItems(rjItems);
    setAllProducts(prods);
    setCategories(cats);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    await fetch("/api/rjesenja-items", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map((it, idx) => ({ id: it.id, order: idx })) }),
    });
  }

  async function addProduct(productId: string) {
    const already = items.find(i => i.product.id === productId);
    if (already) return;
    await fetch("/api/rjesenja-items", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rjesenjaSlug: slug, productId }),
    });
    await load();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function removeItem(id: string) {
    await fetch("/api/rjesenja-items", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  const assignedIds = new Set(items.map(i => i.product.id));
  const available = allProducts
    .filter(p => !assignedIds.has(p.id))
    .filter(p => catFilter === "all" || p.category.name === catFilter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const uniqueCats = Array.from(new Set(allProducts.map(p => p.category.name)));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <a href="/admin" style={{ color: "#6B7B8A", fontSize: 13, textDecoration: "none" }}>Admin</a>
          <span style={{ color: "#6B7B8A" }}>›</span>
          <span style={{ fontSize: 13, color: "#0B1D33", fontWeight: 500 }}>
            Rješenja — {RJESENJA_LABELS[slug] ?? slug}
          </span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>
          Proizvodi na stranici: {RJESENJA_LABELS[slug] ?? slug}
        </h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>
          Prevlačenjem kartica mijenjate redoslijed. Prikazano na sajtu u realnom vremenu.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        {/* Left: current products with DnD */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <strong style={{ fontSize: 15, color: "#0B1D33" }}>Dodani proizvodi ({items.length})</strong>
            {saved && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
          </div>

          {items.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", background: "#F8FAFB", borderRadius: 12, border: "1.5px dashed #E2E8ED", color: "#6B7B8A" }}>
              Nema dodanih proizvoda. Dodajte ih iz panela desno.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {items.map(item => (
                    <SortableCard key={item.id} item={item} onRemove={removeItem} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Right: product picker */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", position: "sticky", top: 80 }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #E2E8ED" }}>
            <strong style={{ fontSize: 14, color: "#0B1D33" }}>Dodaj proizvod</strong>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pretraži..." style={{ ...inp, marginTop: 10 }} />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inp, marginTop: 8 }}>
              <option value="all">Sve kategorije</option>
              {uniqueCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ maxHeight: 500, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {available.length === 0 && (
              <div style={{ padding: 20, textAlign: "center", color: "#6B7B8A", fontSize: 13 }}>
                {allProducts.length === items.length ? "Svi proizvodi su dodani." : "Nema rezultata."}
              </div>
            )}
            {available.map(p => {
              const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
              return (
                <button key={p.id} onClick={() => addProduct(p.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                  border: "1.5px solid #E2E8ED", borderRadius: 8, background: "#fff",
                  cursor: "pointer", textAlign: "left", transition: "border-color 0.2s, background 0.2s",
                  fontFamily: "'Satoshi', sans-serif",
                }}>
                  <div style={{ width: 40, height: 40, background: "#F8FAFB", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7B8A" }}>{p.category.name}</div>
                  </div>
                  <span style={{ color: "#0F766E", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>+</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8,
  fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none",
  boxSizing: "border-box", color: "#111827", background: "#fff", display: "block"
};
