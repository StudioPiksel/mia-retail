"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Types ──────────────────────────────────────────────────────────────────
type Stat = { num: string; label: string };
type Hero = { eyebrow: string; h1: string; h1Highlight: string; lead: string; heroBg: string; stats: Stat[]; ghostLabel: string; ghostHref: string };
type Zone = { title: string; desc: string };
type Zones = { badge: string; h2: string; desc: string; items: Zone[] };
type RealizItem = { img: string; label: string };
type Realizacije = { items: RealizItem[] };
type Cta = { h2: string; p: string };
type Product = { id: string; title: string; series?: string; images: string; category: { id: string; name: string; slug: string } };
type RjesenjaItem = { id: string; order: number; zoneLabel?: string | null; product: Product };
type RjesenjaPage = { slug: string; label: string; bg: string };
type ProductCategory = { id: string; name: string; slug: string };

type Tab = "hero" | "zone" | "realizacije" | "cta" | "proizvodi";

// ── Sortable product card ──────────────────────────────────────────────────
function SortablePCard({ item, onRemove }: { item: RjesenjaItem; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const img = (() => { try { return JSON.parse(item.product.images)[0]; } catch { return null; } })();
  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : 1,
      background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED",
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div {...attributes} {...listeners} style={{ height: 100, background: "#F8FAFB", cursor: "grab", position: "relative", overflow: "hidden" }}>
        {img && <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />}
        <div style={{ position: "absolute", top: 5, left: 5, background: "rgba(11,29,51,0.5)", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>⠿</div>
      </div>
      <div style={{ padding: "8px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#0F766E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.product.category.name}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3, marginTop: 2 }}>{item.product.title}</div>
        {item.product.series && <div style={{ fontSize: 11, color: "#6B7B8A" }}>{item.product.series}</div>}
      </div>
      <div style={{ padding: "6px 10px", borderTop: "1px solid #F1F5F7" }}>
        <button onClick={() => onRemove(item.id)} style={{ width: "100%", padding: "4px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11, fontFamily: "'Satoshi', sans-serif" }}>Ukloni</button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function RjesenjaEditor() {
  const { slug } = useParams<{ slug: string }>();
  const [tab, setTab] = useState<Tab>("hero");
  const [hero, setHero] = useState<Hero | null>(null);
  const [zones, setZones] = useState<Zones | null>(null);
  const [realizacije, setRealizacije] = useState<Realizacije | null>(null);
  const [cta, setCta] = useState<Cta | null>(null);
  const [items, setItems] = useState<RjesenjaItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [pages, setPages] = useState<RjesenjaPage[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = useCallback(async () => {
    const [settings, rjItems, prods, cats] = await Promise.all([
      fetch("/api/settings").then(r => r.json()),
      fetch(`/api/rjesenja-items?slug=${slug}`).then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
      fetch("/api/products/categories").then(r => r.json()),
    ]);
    try { setHero(JSON.parse(settings[`rjesenja_${slug}_hero`])); } catch {}
    try { setZones(JSON.parse(settings[`rjesenja_${slug}_zones`])); } catch {}
    try { setRealizacije(JSON.parse(settings[`rjesenja_${slug}_realizacije`])); } catch {}
    try { setCta(JSON.parse(settings[`rjesenja_${slug}_cta`])); } catch {}
    try { setPages(JSON.parse(settings.rjesenja_pages ?? "[]")); } catch {}
    setItems(rjItems);
    setAllProducts(prods);
    setAllCategories(cats);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  async function saveSetting(section: string, value: unknown) {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [`rjesenja_${slug}_${section}`]: JSON.stringify(value) }),
    });
    setSaving(false);
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    if (!res.ok) { alert("Greška pri snimanju. Pokušajte ponovo."); return; }
    setSaved(section);
    setTimeout(() => setSaved(""), 2000);
  }

  // ── Products: group by category ──────────────────────────────────────────
  const grouped = items.reduce<Record<string, { name: string; items: RjesenjaItem[] }>>((acc, item) => {
    const catId = item.product.category.name;
    if (!acc[catId]) acc[catId] = { name: catId, items: [] };
    acc[catId].items.push(item);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  async function handleDragEnd(e: DragEndEvent, groupItems: RjesenjaItem[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = groupItems.findIndex(i => i.id === active.id);
    const ni = groupItems.findIndex(i => i.id === over.id);
    const reordered = arrayMove(groupItems, oi, ni);
    // Merge back into items
    const ids = new Set(reordered.map(i => i.id));
    const newItems = [...items.filter(i => !ids.has(i.id)), ...reordered];
    setItems(newItems);
    await fetch("/api/rjesenja-items", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map((it, idx) => ({ id: it.id, order: idx })) }),
    });
  }

  async function addProduct(productId: string) {
    if (items.find(i => i.product.id === productId)) return;
    await fetch("/api/rjesenja-items", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rjesenjaSlug: slug, productId }),
    });
    await load();
  }

  async function removeItem(id: string) {
    await fetch("/api/rjesenja-items", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  // Delete all products from a category section
  async function deleteSection(categoryName: string) {
    if (!confirm(`Obrisati cijelu sekciju "${categoryName}" sa ove stranice?`)) return;
    const sectionItems = items.filter(i => i.product.category.name === categoryName);
    for (const item of sectionItems) {
      await fetch("/api/rjesenja-items", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
    }
    await load();
  }

  // Add all products from a category
  async function addCategorySection(catId: string) {
    const catProducts = allProducts.filter(p => p.category.id === catId && !assignedIds.has(p.id));
    for (const prod of catProducts.slice(0, 4)) {
      await fetch("/api/rjesenja-items", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rjesenjaSlug: slug, productId: prod.id }),
      });
    }
    await load();
  }

  const assignedIds = new Set(items.map(i => i.product.id));
  const assignedCatIds = new Set(items.map(i => i.product.category.id));
  const available = allProducts.filter(p =>
    !assignedIds.has(p.id) &&
    (catFilter === "all" || p.category.id === catFilter) &&
    (!prodSearch || p.title.toLowerCase().includes(prodSearch.toLowerCase()))
  );

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "hero", label: "Hero", icon: "🖼" },
    { key: "zone", label: "Zone", icon: "📋" },
    { key: "realizacije", label: "Realizacije", icon: "🏪" },
    { key: "cta", label: "CTA", icon: "📣" },
    { key: "proizvodi", label: `Proizvodi (${items.length})`, icon: "📦" },
  ];

  if (!hero || !zones || !realizacije || !cta) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 8 }}>
          <a href="/admin" style={{ color: "#6B7B8A", textDecoration: "none" }}>Admin</a>
          {" › "}
          <a href="/admin/rjesenja" style={{ color: "#6B7B8A", textDecoration: "none" }}>Rješenja</a>
          {" › "}
          <span style={{ color: "#0B1D33", fontWeight: 500 }}>{pages.find(p => p.slug === slug)?.label ?? slug}</span>
        </div>

        {/* Page switcher */}
        {pages.length > 1 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {pages.map(p => (
              <a key={p.slug} href={`/admin/rjesenja/${p.slug}`} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, textDecoration: "none",
                background: p.slug === slug ? "#0B1D33" : "#F8FAFB",
                color: p.slug === slug ? "#C7F1E6" : "#6B7B8A",
                border: p.slug === slug ? "1.5px solid #0B1D33" : "1.5px solid #E2E8ED",
              }}>{p.label}</a>
            ))}
            <a href="/admin/rjesenja" style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, color: "#0F766E", border: "1.5px solid #0F766E", textDecoration: "none", fontWeight: 600 }}>
              + Nova
            </a>
          </div>
        )}

        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", margin: 0 }}>
          {pages.find(p => p.slug === slug)?.label ?? slug}
        </h1>
        <p style={{ color: "#6B7B8A", fontSize: 13, marginTop: 4 }}>
          Uređivač svake sekcije — promjene su odmah vidljive na sajtu
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid #E2E8ED", paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 18px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: tab === t.key ? 700 : 400,
            color: tab === t.key ? "#0F766E" : "#6B7B8A",
            borderBottom: tab === t.key ? "2.5px solid #0F766E" : "2.5px solid transparent",
            marginBottom: -1,
          }}>{t.icon} {t.label}</button>
        ))}
        <a href={`/rjesenja/${slug}`} target="_blank" style={{ marginLeft: "auto", fontSize: 13, color: "#0F766E", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, paddingBottom: 10 }}>
          Pogledaj stranicu →
        </a>
      </div>

      {/* ── TAB: HERO ── */}
      {tab === "hero" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
          <Card title="Hero sekcija" saved={saved === "hero"}>
            <Row label="Eyebrow badge"><TI value={hero.eyebrow} set={v => setHero({ ...hero, eyebrow: v })} /></Row>
            <Row label="Naslov H1"><TI value={hero.h1} set={v => setHero({ ...hero, h1: v })} /></Row>
            <Row label="H1 istaknuti tekst (teal)"><TI value={hero.h1Highlight} set={v => setHero({ ...hero, h1Highlight: v })} /></Row>
            <Row label="Lead paragraf"><TA value={hero.lead} set={v => setHero({ ...hero, lead: v })} /></Row>
            <Row label="Pozadinska slika (URL)">
              <ImageUpload value={hero.heroBg} onChange={v => setHero({ ...hero, heroBg: v })} maxWidthPx={1440} qualityWebp={0.85} />
            </Row>
            <Row label="Statistike (3)">
              {hero.stats.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <TI placeholder="Broj/tekst" value={s.num} set={v => { const st = [...hero.stats]; st[i] = { ...st[i], num: v }; setHero({ ...hero, stats: st }); }} />
                  <TI placeholder="Labela" value={s.label} set={v => { const st = [...hero.stats]; st[i] = { ...st[i], label: v }; setHero({ ...hero, stats: st }); }} />
                </div>
              ))}
            </Row>
            <Row label="Ghost dugme (Pogledajte realizacije)">
              <div style={{ display: "flex", gap: 8 }}>
                <TI placeholder="Tekst" value={hero.ghostLabel} set={v => setHero({ ...hero, ghostLabel: v })} />
                <TI placeholder="URL" value={hero.ghostHref} set={v => setHero({ ...hero, ghostHref: v })} />
              </div>
            </Row>
            <Btn onClick={() => saveSetting("hero", hero)} saving={saving} />
          </Card>
        </div>
      )}

      {/* ── TAB: ZONE ── */}
      {tab === "zone" && (
        <div>
          {/* Section header settings */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: 14, color: "#0B1D33" }}>Naslov sekcije</strong>
              {saved === "zones" && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
            </div>
            <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Badge</label><TI value={zones.badge} set={v => setZones({ ...zones, badge: v })} /></div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Naslov H2</label><TI value={zones.h2} set={v => setZones({ ...zones, h2: v })} /></div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Opis</label><TI value={zones.desc} set={v => setZones({ ...zones, desc: v })} /></div>
            </div>
          </div>

          {/* Zone cards with inline product management — sortable */}
          <DndContext sensors={sensors} collisionDetection={closestCenter}
            onDragEnd={e => {
              const { active, over } = e;
              if (!over || active.id === over.id) return;
              const oi = zones.items.findIndex((_, idx) => `zone-${idx}` === active.id);
              const ni = zones.items.findIndex((_, idx) => `zone-${idx}` === over.id);
              if (oi === -1 || ni === -1) return;
              setZones({ ...zones, items: arrayMove(zones.items, oi, ni) });
            }}>
            <SortableContext items={zones.items.map((_, i) => `zone-${i}`)} strategy={rectSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {zones.items.map((z, i) => {
              const zoneItems = items.filter(it => it.zoneLabel === z.title);
              const notInZone = allProducts.filter(p =>
                !items.find(it => it.product.id === p.id && it.zoneLabel === z.title) &&
                (!prodSearch || p.title.toLowerCase().includes(prodSearch.toLowerCase()))
              );

              // eslint-disable-next-line react-hooks/rules-of-hooks
              const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `zone-${i}` });

              return (
                <div key={i} ref={setNodeRef}
                  style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden",
                    transform: transform ? `translate(${transform.x}px,${transform.y}px)` : undefined,
                    transition, opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 10 : undefined,
                  }}>
                  {/* Zone header */}
                  <div style={{ padding: "12px 16px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", gap: 10, alignItems: "center" }}>
                    {/* Drag handle */}
                    <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#CBD5DC", fontSize: 18, flexShrink: 0, userSelect: "none", touchAction: "none" }}>⠿</div>
                    <div style={{ width: 24, height: 24, background: "#C7F1E6", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#0F766E" }}>✓</div>
                    <div style={{ flex: 1, display: "flex", gap: 10 }}>
                      <TI placeholder="Naziv zone *" value={z.title} set={v => { const ni = [...zones.items]; ni[i] = { ...ni[i], title: v }; setZones({ ...zones, items: ni }); }} />
                      <TI placeholder="Kratki opis zone" value={z.desc} set={v => { const ni = [...zones.items]; ni[i] = { ...ni[i], desc: v }; setZones({ ...zones, items: ni }); }} />
                    </div>
                    <button onClick={() => setZones({ ...zones, items: zones.items.filter((_, idx) => idx !== i) })}
                      style={{ padding: "5px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 }}>✕</button>
                  </div>

                  <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
                    {/* Assigned products */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Dodani proizvodi ({zoneItems.length})
                      </div>
                      {zoneItems.length === 0 ? (
                        <div style={{ padding: "16px", background: "#F8FAFB", borderRadius: 8, border: "1.5px dashed #E2E8ED", color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>
                          Nema dodanih — dodajte iz panela desno
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {zoneItems.map(it => {
                            const img = (() => { try { return JSON.parse(it.product.images)[0]; } catch { return null; } })();
                            return (
                              <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#F8FAFB", borderRadius: 8, border: "1px solid #E2E8ED" }}>
                                <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 6, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.product.title}</div>
                                  <div style={{ fontSize: 11, color: "#6B7B8A" }}>{it.product.category.name}</div>
                                </div>
                                <button onClick={async () => {
                                  await fetch(`/api/rjesenja-items`, {
                                    method: "DELETE", headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: it.id }),
                                  });
                                  await load();
                                }} style={{ padding: "4px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, flexShrink: 0 }}>✕</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Product picker for this zone */}
                    <div style={{ background: "#F8FAFB", borderRadius: 10, border: "1px solid #E2E8ED", overflow: "hidden" }}>
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid #E2E8ED", background: "#fff" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1D33", marginBottom: 6 }}>Dodaj u "{z.title}"</div>
                        <input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="Pretraži..."
                          style={{ width: "100%", padding: "6px 10px", border: "1.5px solid #E2E8ED", borderRadius: 6, fontSize: 12, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        {notInZone.slice(0, 20).map(prod => {
                          const img = (() => { try { return JSON.parse(prod.images)[0]; } catch { return null; } })();
                          const alreadyOnPage = !!items.find(it => it.product.id === prod.id);
                          return (
                            <button key={prod.id} onClick={async () => {
                              if (alreadyOnPage) {
                                // Just update zoneLabel on existing item
                                const existingItem = items.find(it => it.product.id === prod.id);
                                if (existingItem) {
                                  await fetch(`/api/rjesenja-items`, {
                                    method: "PUT", headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: existingItem.id, zoneLabel: z.title }),
                                  });
                                }
                              } else {
                                // Add new item with zone label
                                await fetch("/api/rjesenja-items", {
                                  method: "POST", headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ rjesenjaSlug: slug, productId: prod.id, zoneLabel: z.title }),
                                });
                              }
                              await load();
                            }} style={{
                              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                              border: "none", borderBottom: "1px solid #F1F5F7", background: "#fff",
                              cursor: "pointer", textAlign: "left", fontFamily: "'Satoshi', sans-serif",
                            }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#F0FDF4")}
                              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                            >
                              <div style={{ width: 28, height: 28, background: "#F8FAFB", borderRadius: 5, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3, fontSize: 10 }}>📦</span>}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.title}</div>
                                <div style={{ fontSize: 10, color: "#6B7B8A" }}>{prod.category.name}</div>
                              </div>
                              <span style={{ color: "#0F766E", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>+</span>
                            </button>
                          );
                        })}
                        {notInZone.length === 0 && <div style={{ padding: 16, textAlign: "center", color: "#9CA3AF", fontSize: 12 }}>Nema rezultata</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </SortableContext>
          </DndContext>

          {/* Add zone + save */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => setZones({ ...zones, items: [...zones.items, { title: "", desc: "" }] })}
              style={{ padding: "10px 20px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
              + Dodaj zonu
            </button>
            <Btn onClick={() => saveSetting("zones", zones)} saving={saving} />
          </div>
        </div>
      )}

      {/* ── TAB: REALIZACIJE ── */}
      {tab === "realizacije" && (
        <div style={{ maxWidth: 720 }}>
          <Card title="Realizacije slider" saved={saved === "realizacije"}>
            <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 16px" }}>Slike u slideru ispod proizvoda. Prva slika = početna.</p>
            {realizacije.items.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center", padding: "10px 12px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
                {r.img && <img src={r.img} alt="" style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                <div style={{ flex: 1, display: "flex", gap: 8 }}>
                  <ImageUpload value={r.img} onChange={v => { const ni = [...realizacije.items]; ni[i] = { ...ni[i], img: v }; setRealizacije({ ...realizacije, items: ni }); }} maxWidthPx={1280} qualityWebp={0.82} />
                  <TI placeholder="Labela (slider naslov)" value={r.label} set={v => { const ni = [...realizacije.items]; ni[i] = { ...ni[i], label: v }; setRealizacije({ ...realizacije, items: ni }); }} />
                </div>
                <button onClick={() => setRealizacije({ ...realizacije, items: realizacije.items.filter((_, idx) => idx !== i) })}
                  style={{ padding: "6px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 }}>✕</button>
              </div>
            ))}
            <button onClick={() => setRealizacije({ ...realizacije, items: [...realizacije.items, { img: "", label: "" }] })}
              style={{ padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif", marginBottom: 8 }}>
              + Dodaj sliku
            </button>
            <br />
            <Btn onClick={() => saveSetting("realizacije", realizacije)} saving={saving} />
          </Card>
        </div>
      )}

      {/* ── TAB: CTA ── */}
      {tab === "cta" && (
        <div style={{ maxWidth: 720 }}>
          <Card title="Završni CTA banner" saved={saved === "cta"}>
            <Row label="Naslov"><TI value={cta.h2} set={v => setCta({ ...cta, h2: v })} /></Row>
            <Row label="Opis"><TA value={cta.p} set={v => setCta({ ...cta, p: v })} rows={2} /></Row>
            <Btn onClick={() => saveSetting("cta", cta)} saving={saving} />
          </Card>
        </div>
      )}

      {/* ── TAB: PROIZVODI ── */}
      {tab === "proizvodi" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
          {/* Left: grouped product sections */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong style={{ fontSize: 15, color: "#0B1D33" }}>Sekcije proizvoda ({groups.length})</strong>
              <p style={{ fontSize: 13, color: "#6B7B8A", margin: "4px 0 0" }}>Svaka sekcija = jedna kategorija prikazana na stranici. Prevuci kartice za redoslijed unutar sekcije.</p>
            </div>

            {/* Add section by category */}
            {allCategories.filter(c => !assignedCatIds.has(c.id)).length > 0 && (
              <div style={{ marginBottom: 20, padding: "12px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>+ Dodaj sekciju:</span>
                {allCategories.filter(c => !assignedCatIds.has(c.id)).map(cat => (
                  <button key={cat.id} onClick={() => addCategorySection(cat.id)} style={{
                    padding: "5px 12px", background: "#fff", border: "1.5px solid #16A34A", borderRadius: 20,
                    cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#16A34A", fontFamily: "'Satoshi', sans-serif",
                  }}>
                    {cat.name} →
                  </button>
                ))}
              </div>
            )}

            {groups.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", background: "#F8FAFB", borderRadius: 12, border: "1.5px dashed #E2E8ED", color: "#6B7B8A" }}>
                Nema sekcija. Dodajte sekciju gore ili pojedinačne proizvode iz panela desno.
              </div>
            ) : (
              groups.map(group => (
                <div key={group.name} style={{ marginBottom: 24, background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
                  {/* Section header */}
                  <div style={{ padding: "12px 16px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0B1D33" }}>{group.name}</span>
                      <span style={{ fontSize: 12, color: "#6B7B8A", marginLeft: 8 }}>{group.items.length} proizvoda</span>
                    </div>
                    <button onClick={() => deleteSection(group.name)} style={{
                      padding: "5px 12px", background: "#FEF2F2", color: "#DC2626", border: "none",
                      borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "'Satoshi', sans-serif",
                    }}>
                      🗑 Obriši sekciju
                    </button>
                  </div>

                  {/* Products grid */}
                  <div style={{ padding: 14 }}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, group.items)}>
                      <SortableContext items={group.items.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                          {group.items.map(item => (
                            <SortablePCard key={item.id} item={item} onRemove={removeItem} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: product picker */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", position: "sticky", top: 80 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8ED" }}>
              <strong style={{ fontSize: 13, color: "#0B1D33" }}>Dodaj pojedinačni proizvod</strong>
              <input value={prodSearch} onChange={e => setProdSearch(e.target.value)}
                placeholder="Pretraži po nazivu..." style={{ display: "block", width: "100%", marginTop: 8, padding: "8px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 12, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box" }} />
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 6, padding: "7px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 12, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", background: "#fff" }}>
                <option value="all">Sve kategorije</option>
                {allCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ maxHeight: 440, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 5 }}>
              {available.slice(0, 40).map(prod => {
                const img = (() => { try { return JSON.parse(prod.images)[0]; } catch { return null; } })();
                return (
                  <button key={prod.id} onClick={() => addProduct(prod.id)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 8px",
                    border: "1px solid #E2E8ED", borderRadius: 7, background: "#fff",
                    cursor: "pointer", textAlign: "left", fontFamily: "'Satoshi', sans-serif",
                  }}>
                    <div style={{ width: 36, height: 36, background: "#F8FAFB", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.title}</div>
                      <div style={{ fontSize: 10, color: "#6B7B8A" }}>{prod.category.name}</div>
                    </div>
                    <span style={{ color: "#0F766E", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>+</span>
                  </button>
                );
              })}
              {available.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#6B7B8A", fontSize: 12 }}>Nema rezultata.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────
function Card({ title, children, saved }: { title: string; children: React.ReactNode; saved: boolean }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8ED", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFB" }}>
        <strong style={{ fontSize: 15, color: "#0B1D33" }}>{title}</strong>
        {saved && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>{children}</div>;
}
function TI({ value, set, placeholder }: { value: string; set: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" }} />;
}
function TA({ value, set, rows = 3, placeholder }: { value: string; set: (v: string) => void; rows?: number; placeholder?: string }) {
  return <textarea value={value} onChange={e => set(e.target.value)} rows={rows} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block", resize: "vertical" }} />;
}
function Btn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return <button onClick={onClick} disabled={saving} style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>{saving ? "Čuvanje..." : "Sačuvaj sekciju"}</button>;
}
