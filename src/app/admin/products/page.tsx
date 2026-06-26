"use client";
import { useEffect, useState, useRef } from "react";
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

// ── Move dropdown ─────────────────────────────────────────────────────────────
function MoveDropdown({ product, categories, onMove }: {
  product: Product;
  categories: Category[];
  onMove: (productId: string, catId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const others = categories.filter(c => c.id !== product.categoryId);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} title="Premjesti u drugu kategoriju" style={{
        padding: "5px 8px", background: open ? "#E6EEF2" : "#F8FAFB",
        border: "1px solid #E2E8ED", borderRadius: 6, cursor: "pointer", fontSize: 11,
        color: "#374151", fontFamily: "'Satoshi', sans-serif", whiteSpace: "nowrap",
      }}>
        ↔ Premjesti
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 200,
          background: "#fff", border: "1px solid #E2E8ED", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(11,29,51,0.12)", minWidth: 220, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #F1F5F7", fontSize: 11, color: "#6B7B8A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Premjesti u kategoriju
          </div>
          {others.map(cat => (
            <button key={cat.id} onClick={() => { onMove(product.id, cat.id); setOpen(false); }} style={{
              width: "100%", padding: "10px 14px", border: "none", background: "#fff",
              textAlign: "left", cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif",
              color: "#0B1D33", display: "block",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F0FDF4")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sortable product row ──────────────────────────────────────────────────────
function SortableRow({ p, categories, onToggle, onDelete, onMove }: {
  p: Product; categories: Category[];
  onToggle: () => void; onDelete: () => void;
  onMove: (productId: string, catId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
  const specs = (() => { try { return JSON.parse(p.specs) as string[]; } catch { return []; } })();

  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : p.published ? 1 : 0.6,
      display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
      background: isDragging ? "#F0FDF4" : "#fff", borderBottom: "1px solid #F1F5F7",
    }}>
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#CBD5DC", fontSize: 18, flexShrink: 0, userSelect: "none" }}>⠿</div>
      <div style={{ width: 44, height: 44, background: "#F8FAFB", borderRadius: 8, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
        <div style={{ fontSize: 12, color: "#6B7B8A", display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap", alignItems: "center" }}>
          {p.series && <span style={{ color: "#0F766E", fontWeight: 500 }}>{p.series}</span>}
          {p.subGroup && <span style={{ color: "#9CA3AF" }}>· {p.subGroup}</span>}
          {specs.slice(0, 3).map(s => (
            <span key={s} style={{ background: "#E6EEF2", color: "#374151", padding: "1px 6px", borderRadius: 10, fontSize: 11 }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
        <button onClick={onToggle} style={{ padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, background: p.published ? "#DCFCE7" : "#F1F5F7", color: p.published ? "#16A34A" : "#6B7B8A" }}>
          {p.published ? "✓" : "○"}
        </button>
        <MoveDropdown product={p} categories={categories} onMove={onMove} />
        <Link href={`/admin/products/${p.id}`} style={{ padding: "5px 10px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: "none" }}>Uredi</Link>
        <button onClick={onDelete} style={{ padding: "5px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProductsAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<View>("kategorije");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  // New category form
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  // Rename category
  const [renamingCat, setRenamingCat] = useState<string | null>(null);
  const [renameCatName, setRenameCatName] = useState("");

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

  // Reorder products in a category
  async function handleDragEnd(e: DragEndEvent, catProducts: Product[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = catProducts.findIndex(p => p.id === active.id);
    const ni = catProducts.findIndex(p => p.id === over.id);
    const reordered = arrayMove(catProducts, oi, ni);
    const ids = new Set(reordered.map(p => p.id));
    setProducts(prev => [...prev.filter(p => !ids.has(p.id)), ...reordered]);
    setSaving(true);
    await Promise.all(reordered.map((p, idx) =>
      fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: idx }) })
    ));
    setSaving(false);
  }

  async function togglePublish(p: Product) {
    await fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, published: !x.published } : x));
  }

  async function deleteProduct(id: string) {
    if (!confirm("Obrisati proizvod?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(x => x.id !== id));
  }

  // Move product to another category
  async function moveProduct(productId: string, catId: string) {
    const maxOrder = products.filter(p => p.categoryId === catId).length;
    await fetch(`/api/products/${productId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: catId, order: maxOrder }),
    });
    await load();
  }

  // Add new category
  async function addCategory() {
    if (!newCatName.trim()) return;
    const slug = newCatSlug.trim() || newCatName.toLowerCase().trim()
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/[šš]/g, "s").replace(/[čć]/g, "c").replace(/ž/g, "z").replace(/đ/g, "d");
    setAddingCat(true);
    const res = await fetch("/api/products/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim(), slug }),
    });
    if (!res.ok) { const e = await res.json(); alert(e.error); setAddingCat(false); return; }
    const newCat = await res.json();
    setNewCatName(""); setNewCatSlug(""); setShowNewCat(false); setAddingCat(false);
    await load();
    setSelectedCat(newCat.id);
  }

  // Rename category
  async function renameCategory(id: string) {
    if (!renameCatName.trim()) return;
    await fetch("/api/products/categories", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: renameCatName.trim() }),
    });
    setRenamingCat(null); setRenameCatName("");
    await load();
  }

  // Delete category
  async function deleteCategory(id: string, name: string) {
    const count = products.filter(p => p.categoryId === id).length;
    if (count > 0) { alert(`Kategorija "${name}" ima ${count} proizvoda. Premjestite ih prije brisanja.`); return; }
    if (!confirm(`Obrisati praznu kategoriju "${name}"?`)) return;
    const res = await fetch("/api/products/categories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { const e = await res.json(); alert(e.error); return; }
    if (selectedCat === id) setSelectedCat(categories.find(c => c.id !== id)?.id ?? null);
    await load();
  }

  const catProducts = selectedCat
    ? products.filter(p => p.categoryId === selectedCat).sort((a, b) => a.order - b.order)
    : [];
  const selectedCatObj = categories.find(c => c.id === selectedCat);
  const allFiltered = products.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.series ?? "").toLowerCase().includes(search.toLowerCase()) ||
    p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Proizvodi</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{products.length} proizvoda u {categories.length} kategorija</p>
        </div>
        <Link href="/admin/products/new" style={{ padding: "11px 22px", background: "#0F766E", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          + Novi proizvod
        </Link>
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E2E8ED", marginBottom: 24 }}>
        {([["kategorije", "Po kategoriji"], ["svi", "Svi proizvodi"]] as [View, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setView(key)} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: view === key ? 700 : 400,
            color: view === key ? "#0F766E" : "#6B7B8A",
            borderBottom: view === key ? "2.5px solid #0F766E" : "2.5px solid transparent", marginBottom: -1,
          }}>{label}</button>
        ))}
        {saving && <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: 13, color: "#6B7B8A", paddingBottom: 10 }}>Čuvanje...</span>}
      </div>

      {/* ── PO KATEGORIJI ── */}
      {view === "kategorije" && (
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", position: "sticky", top: 80 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: 13, color: "#0B1D33" }}>Kategorije</strong>
              <button onClick={() => setShowNewCat(s => !s)} title="Dodaj novu kategoriju" style={{
                width: 26, height: 26, borderRadius: "50%", border: "none",
                background: showNewCat ? "#0F766E" : "#E6EEF2", color: showNewCat ? "#fff" : "#374151",
                cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
            </div>

            {/* New category form */}
            {showNewCat && (
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #E2E8ED", background: "#F0FDF4" }}>
                <input value={newCatName} onChange={e => { setNewCatName(e.target.value); setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }}
                  placeholder="Naziv kategorije *" autoFocus
                  onKeyDown={e => e.key === "Enter" && addCategory()}
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #0F766E", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
                <input value={newCatSlug} onChange={e => setNewCatSlug(e.target.value)}
                  placeholder="slug (auto)"
                  style={{ width: "100%", padding: "6px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 12, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: 8, color: "#6B7B8A" }} />
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={addCategory} disabled={addingCat || !newCatName.trim()} style={{ flex: 1, padding: "7px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
                    {addingCat ? "..." : "Dodaj"}
                  </button>
                  <button onClick={() => { setShowNewCat(false); setNewCatName(""); setNewCatSlug(""); }} style={{ padding: "7px 10px", background: "#fff", border: "1px solid #E2E8ED", borderRadius: 7, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              </div>
            )}

            {/* Category list */}
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              const active = selectedCat === cat.id;
              const isRenaming = renamingCat === cat.id;
              return (
                <div key={cat.id} style={{ borderBottom: "1px solid #F8FAFB" }}>
                  {isRenaming ? (
                    <div style={{ padding: "8px 10px", background: "#FFFBEB", display: "flex", gap: 5 }}>
                      <input value={renameCatName} onChange={e => setRenameCatName(e.target.value)}
                        autoFocus onKeyDown={e => { if (e.key === "Enter") renameCategory(cat.id); if (e.key === "Escape") setRenamingCat(null); }}
                        style={{ flex: 1, padding: "5px 8px", border: "1.5px solid #0F766E", borderRadius: 6, fontSize: 12, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
                      <button onClick={() => renameCategory(cat.id)} style={{ padding: "5px 8px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✓</button>
                      <button onClick={() => setRenamingCat(null)} style={{ padding: "5px 8px", background: "#E6EEF2", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button onClick={() => setSelectedCat(cat.id)} style={{
                        flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 14px", border: "none", textAlign: "left", cursor: "pointer",
                        background: active ? "#F0FDF4" : "transparent",
                        borderLeft: active ? "3px solid #0F766E" : "3px solid transparent",
                        fontFamily: "'Satoshi', sans-serif",
                      }}>
                        <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#0B1D33" : "#374151" }}>{cat.name}</span>
                        <span style={{ fontSize: 11, color: "#6B7B8A", background: "#F1F5F7", padding: "2px 7px", borderRadius: 20 }}>{count}</span>
                      </button>
                      {active && (
                        <div style={{ display: "flex", gap: 3, padding: "0 8px", flexShrink: 0 }}>
                          <button onClick={() => { setRenamingCat(cat.id); setRenameCatName(cat.name); }}
                            title="Preimenuj" style={{ padding: "3px 6px", background: "#E6EEF2", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11, color: "#374151" }}>✏</button>
                          <button onClick={() => deleteCategory(cat.id, cat.name)}
                            title="Obriši praznu kategoriju" style={{ padding: "3px 6px", background: "#FEF2F2", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11, color: "#DC2626" }}>🗑</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Product list */}
          <div>
            {selectedCatObj && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0B1D33", margin: 0 }}>{selectedCatObj.name}</h2>
                  <p style={{ fontSize: 13, color: "#6B7B8A", margin: "3px 0 0" }}>
                    {catProducts.length} proizvoda · prevuci za redoslijed · "Premjesti" prebacuje u drugu kategoriju
                  </p>
                </div>
                <Link href="/admin/products/new" style={{ padding: "8px 16px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                  + Novi u ovoj kategoriji
                </Link>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
              {catProducts.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: "#6B7B8A" }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>📦</div>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>Nema proizvoda u ovoj kategoriji</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Premjestite neke iz druge kategorije ili dodajte novi</div>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, catProducts)}>
                  <SortableContext items={catProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {catProducts.map(p => (
                      <SortableRow key={p.id} p={p} categories={categories}
                        onToggle={() => togglePublish(p)}
                        onDelete={() => deleteProduct(p.id)}
                        onMove={moveProduct} />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SVI PROIZVODI ── */}
      {view === "svi" && (
        <div>
          <div style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži po nazivu, seriji ili kategoriji..."
              style={{ padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, outline: "none", width: 340, fontFamily: "'Satoshi', sans-serif" }} />
            {search && <span style={{ fontSize: 13, color: "#6B7B8A" }}>{allFiltered.length} rezultata</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14 }}>
            {allFiltered.map(p => {
              const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
              return (
                <div key={p.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", opacity: p.published ? 1 : 0.6, display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 120, background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} /> : <span style={{ opacity: 0.2, fontSize: 28 }}>📦</span>}
                  </div>
                  <div style={{ padding: "10px 12px", flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#0F766E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{p.category.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3 }}>{p.title}</div>
                    {p.series && <div style={{ fontSize: 11, color: "#6B7B8A", marginTop: 2 }}>{p.series}</div>}
                  </div>
                  <div style={{ padding: "8px 10px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 5 }}>
                    <button onClick={() => togglePublish(p)} style={{ padding: "4px 8px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 500, background: p.published ? "#DCFCE7" : "#F1F5F7", color: p.published ? "#16A34A" : "#6B7B8A" }}>
                      {p.published ? "✓" : "○"}
                    </button>
                    <Link href={`/admin/products/${p.id}`} style={{ flex: 1, padding: "4px 6px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 6, fontSize: 11, fontWeight: 500, textDecoration: "none", textAlign: "center" }}>Uredi</Link>
                    <MoveDropdown product={p} categories={categories} onMove={moveProduct} />
                    <button onClick={() => deleteProduct(p.id)} style={{ padding: "4px 7px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>
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
