"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Stat = { num: string; label: string };
type Hero = { eyebrow: string; h1: string; h1Highlight: string; lead: string; heroBg: string; stats: Stat[]; ghostLabel: string; ghostHref: string };
type Feature = { badge: string; h2: string; p: string; li: string[]; img: string };
type Cta = { h2: string; p: string };
type Product = { id: string; title: string; series?: string; images: string; subGroup?: string | null; subGroupOrder: number; order: number; category: { name: string; slug: string } };
type Tab = "hero" | "feature" | "cta" | "sekcije";

// ── Sortable section header (drag to reorder sections) ────────────────────────
function SortableSectionHeader({ groupName, realProds, renamingGroup, renameVal, setRenamingGroup, setRenameVal, onRename }: {
  groupName: string; realProds: Product[];
  renamingGroup: string | null; renameVal: string;
  setRenamingGroup: (v: string | null) => void; setRenameVal: (v: string) => void;
  onRename: (old: string, newName: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: groupName });
  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1,
      background: "#fff", borderRadius: 12, border: isDragging ? "2px solid #0F766E" : "1px solid #E2E8ED",
      overflow: "hidden", marginBottom: 0,
    }}>
      <div style={{ padding: "11px 16px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", alignItems: "center", gap: 10 }}>
        <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#CBD5DC", fontSize: 18, flexShrink: 0, userSelect: "none", touchAction: "none" }}>⠿</div>
        {renamingGroup === groupName ? (
          <>
            <input value={renameVal} onChange={e => setRenameVal(e.target.value)} autoFocus
              onKeyDown={e => { if (e.key === "Enter") onRename(groupName, renameVal); if (e.key === "Escape") setRenamingGroup(null); }}
              style={{ flex: 1, padding: "5px 10px", border: "1.5px solid #0F766E", borderRadius: 6, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
            <button onClick={() => onRename(groupName, renameVal)} style={{ padding: "5px 10px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✓</button>
            <button onClick={() => setRenamingGroup(null)} style={{ padding: "5px 8px", background: "#E6EEF2", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0B1D33", flex: 1 }}>{groupName}</span>
            <span style={{ fontSize: 11, color: "#6B7B8A", background: "#E6EEF2", padding: "2px 8px", borderRadius: 20 }}>{realProds.length}</span>
            <button onClick={() => { setRenamingGroup(groupName); setRenameVal(groupName); }}
              style={{ padding: "4px 8px", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#6B7B8A" }}>✏ Preimenuj</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sortable product row ──────────────────────────────────────────────────────
function SortableProductRow({ p, onRemove }: { p: Product; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : 1,
      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
      background: isDragging ? "#F0FDF4" : "#fff", borderBottom: "1px solid #F1F5F7",
    }}>
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#CBD5DC", fontSize: 16, flexShrink: 0 }}>⠿</div>
      <div style={{ width: 36, height: 36, background: "#F8FAFB", borderRadius: 6, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
        {p.series && <div style={{ fontSize: 11, color: "#6B7B8A" }}>{p.series}</div>}
      </div>
      <button onClick={onRemove} style={{ padding: "4px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, flexShrink: 0 }}>✕</button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProizvodiPageEditor() {
  const { slug } = useParams<{ slug: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [feature, setFeature] = useState<Feature | null>(null);
  const [cta, setCta] = useState<Cta | null>(null);
  const [tab, setTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  // Sekcije state
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [renamingGroup, setRenamingGroup] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      const defaultHero: Hero = { eyebrow: "Proizvodi", h1: slug.replace(/-/g, " "), h1Highlight: "", lead: "", heroBg: "", stats: [], ghostLabel: "Pogledajte realizacije", ghostHref: "/realizacije" };
      const defaultFeature: Feature = { badge: "", h2: "", p: "", li: [], img: "" };
      const defaultCta: Cta = { h2: "Trebate ponudu?", p: "Kontaktirajte nas za besplatnu konsultaciju." };
      try { setHero(JSON.parse(s[`proizvodi_${slug}_hero`])); } catch { setHero(defaultHero); }
      try { setFeature(JSON.parse(s[`proizvodi_${slug}_feature`])); } catch { setFeature(defaultFeature); }
      try { setCta(JSON.parse(s[`proizvodi_${slug}_cta`])); } catch { setCta(defaultCta); }
      // If settings exist but are null/empty, still set defaults
      if (!s[`proizvodi_${slug}_hero`]) setHero(defaultHero);
      if (!s[`proizvodi_${slug}_feature`]) setFeature(defaultFeature);
      if (!s[`proizvodi_${slug}_cta`]) setCta(defaultCta);
    });
  }, [slug]);

  const loadProducts = useCallback(async () => {
    const [catRes, allRes] = await Promise.all([
      fetch(`/api/products?category=${slug}`).then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
    ]);
    setProducts(catRes);
    setAllProducts(allRes);
  }, [slug]);

  useEffect(() => { if (tab === "sekcije") loadProducts(); }, [tab, loadProducts]);

  async function save(section: string, value: unknown) {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [`proizvodi_${slug}_${section}`]: JSON.stringify(value) }),
    });
    setSaving(false);
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    if (!res.ok) { alert("Greška pri snimanju. Pokušajte ponovo."); return; }
    setSaved(section);
    setTimeout(() => setSaved(""), 4000);
  }

  // Groups from current category products
  const groupMap = new Map<string, Product[]>();
  for (const p of [...products].sort((a, b) => (a.subGroupOrder ?? 0) - (b.subGroupOrder ?? 0) || a.order - b.order)) {
    const key = p.subGroup ?? "Bez sekcije";
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(p);
  }
  const groups = Array.from(groupMap.entries());

  // Drag & drop reorder within a group
  async function handleDragEnd(groupName: string, groupProducts: Product[], e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = groupProducts.findIndex(p => p.id === active.id);
    const ni = groupProducts.findIndex(p => p.id === over.id);
    const reordered = arrayMove(groupProducts, oi, ni);
    // Update local state
    setProducts(prev => {
      const others = prev.filter(p => (p.subGroup ?? "Bez sekcije") !== groupName);
      return [...others, ...reordered];
    });
    setSavingOrder(true);
    await Promise.all(reordered.map((p, idx) =>
      fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: idx }) })
    ));
    setSavingOrder(false);
  }

  // Move product to another group (change subGroup)
  async function moveToGroup(productId: string, targetGroup: string) {
    const maxOrder = products.filter(p => (p.subGroup ?? "Bez sekcije") === targetGroup).length;
    await fetch(`/api/products/${productId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subGroup: targetGroup === "Bez sekcije" ? null : targetGroup, order: maxOrder }),
    });
    await loadProducts();
  }

  // Remove product from section (set subGroup to null — still in category, just ungrouped)
  async function removeFromGroup(productId: string) {
    await fetch(`/api/products/${productId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subGroup: null, order: 999 }),
    });
    await loadProducts();
  }

  // Add product to this category + subgroup
  async function addProductToGroup(prod: Product, groupName: string) {
    const maxOrder = products.filter(p => (p.subGroup ?? "Bez sekcije") === groupName).length;
    // If product is already in this category, just update its subGroup
    const existing = products.find(p => p.id === prod.id);
    if (existing) {
      await fetch(`/api/products/${prod.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subGroup: groupName, order: maxOrder }),
      });
    } else {
      // Move to this category + set subGroup
      await fetch(`/api/products/${prod.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: prod.category.slug, subGroup: groupName, order: maxOrder }),
      });
    }
    await loadProducts();
  }

  // Reorder sections (update subGroupOrder on all products per group)
  async function handleSectionDragEnd(e: DragEndEvent, sectionNames: string[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = sectionNames.indexOf(active.id as string);
    const ni = sectionNames.indexOf(over.id as string);
    if (oi === -1 || ni === -1) return;
    const reordered = arrayMove(sectionNames, oi, ni);
    await Promise.all(
      reordered.flatMap((groupName, newOrder) =>
        products
          .filter(p => (p.subGroup ?? "Bez sekcije") === groupName && !p.id.startsWith("__empty__"))
          .map(p => fetch(`/api/products/${p.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subGroupOrder: newOrder }),
          }))
      )
    );
    await loadProducts();
  }

  // Rename group (updates all products in that group)
  async function renameGroup(oldName: string, newName: string) {
    if (!newName.trim() || newName === oldName) { setRenamingGroup(null); return; }
    const inGroup = products.filter(p => (p.subGroup ?? "Bez sekcije") === oldName);
    await Promise.all(inGroup.map(p =>
      fetch(`/api/products/${p.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subGroup: newName }),
      })
    ));
    setRenamingGroup(null); setRenameVal("");
    await loadProducts();
  }

  // Add new empty group
  function addGroup() {
    if (!newGroupName.trim()) return;
    // Groups are implicit — just set the name so user can add products to it
    setShowNewGroup(false);
    setNewGroupName("");
    // We'll show it as an empty group by adding a placeholder
    setProducts(prev => [...prev, { id: `__empty__${Date.now()}`, title: "__EMPTY__", images: "[]", subGroup: newGroupName.trim(), subGroupOrder: groups.length, order: 0, series: undefined, category: { name: "", slug } }]);
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "hero", label: "Hero" },
    { key: "feature", label: "Feature sekcija" },
    { key: "sekcije", label: "Sekcije & Proizvodi" },
    { key: "cta", label: "CTA" },
  ];

  const notInCat = allProducts.filter(p =>
    p.category.slug !== slug &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.name.toLowerCase().includes(search.toLowerCase()))
  );
  const inCatUngrp = products.filter(p => !p.subGroup || p.subGroup === "Bez sekcije").filter(p => p.id && !p.id.startsWith("__empty__"));

  if (!hero || !feature || !cta) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 6 }}>
          <Link href="/admin/stranice/proizvodi" style={{ color: "#6B7B8A", textDecoration: "none" }}>Proizvodi stranice</Link> › {slug}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", margin: 0 }}>/proizvodi/{slug}</h1>
          <div style={{ display: "flex", gap: 10 }}>
            {savingOrder && <span style={{ fontSize: 13, color: "#6B7B8A" }}>Čuvanje redoslijeda...</span>}
            <a href={`/proizvodi/${slug}`} target="_blank" style={{ fontSize: 13, color: "#0F766E", textDecoration: "none" }}>Pogledaj stranicu →</a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8ED", marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 18px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: tab === t.key ? 700 : 400,
            color: tab === t.key ? "#0F766E" : "#6B7B8A",
            borderBottom: tab === t.key ? "2.5px solid #0F766E" : "2.5px solid transparent", marginBottom: -1,
          }}>{t.label}</button>
        ))}
        {saved && <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: 13, color: "#16A34A", fontWeight: 500, paddingBottom: 10 }}>✓ Sačuvano</span>}
      </div>

      {/* ── HERO ── */}
      {tab === "hero" && (
        <Card>
          <Row label="Eyebrow"><TI value={hero.eyebrow} set={v => setHero({ ...hero, eyebrow: v })} /></Row>
          <Row label="H1 tekst"><TI value={hero.h1} set={v => setHero({ ...hero, h1: v })} /></Row>
          <Row label="H1 istaknuti (teal)"><TI value={hero.h1Highlight} set={v => setHero({ ...hero, h1Highlight: v })} /></Row>
          <Row label="Lead paragraf"><TA value={hero.lead} set={v => setHero({ ...hero, lead: v })} /></Row>
          <Row label="Hero pozadinska slika">
            <ImageUpload value={hero.heroBg} onChange={v => setHero({ ...hero, heroBg: v })} maxWidthPx={1440} qualityWebp={0.85} />
          </Row>
          <Row label="Statistike">
            {hero.stats.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <TI placeholder="Broj/tekst" value={s.num} set={v => { const ns = [...hero.stats]; ns[i] = { ...ns[i], num: v }; setHero({ ...hero, stats: ns }); }} />
                <TI placeholder="Labela" value={s.label} set={v => { const ns = [...hero.stats]; ns[i] = { ...ns[i], label: v }; setHero({ ...hero, stats: ns }); }} />
              </div>
            ))}
          </Row>
          <Row label="Ghost dugme">
            <div style={{ display: "flex", gap: 8 }}>
              <TI placeholder="Tekst" value={hero.ghostLabel} set={v => setHero({ ...hero, ghostLabel: v })} />
              <TI placeholder="URL" value={hero.ghostHref} set={v => setHero({ ...hero, ghostHref: v })} />
            </div>
          </Row>
          <Btn onClick={() => save("hero", hero)} saving={saving} />
        </Card>
      )}

      {/* ── FEATURE ── */}
      {tab === "feature" && (
        <Card>
          <Row label="Badge tekst"><TI value={feature.badge} set={v => setFeature({ ...feature, badge: v })} /></Row>
          <Row label="Naslov (H2)"><TI value={feature.h2} set={v => setFeature({ ...feature, h2: v })} /></Row>
          <Row label="Paragraf"><TA value={feature.p} set={v => setFeature({ ...feature, p: v })} /></Row>
          <Row label="Slika">
            <ImageUpload value={feature.img} onChange={v => setFeature({ ...feature, img: v })} maxWidthPx={900} qualityWebp={0.85} />
          </Row>
          <Row label="Bullet točke">
            {feature.li.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#0F766E", fontWeight: 700, lineHeight: "36px" }}>✓</span>
                <input value={item} onChange={e => { const nl = [...feature.li]; nl[i] = e.target.value; setFeature({ ...feature, li: nl }); }}
                  style={{ flex: 1, padding: "8px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
                <button onClick={() => setFeature({ ...feature, li: feature.li.filter((_, idx) => idx !== i) })}
                  style={{ padding: "6px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => setFeature({ ...feature, li: [...feature.li, ""] })}
              style={{ padding: "6px 14px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'Satoshi', sans-serif" }}>
              + Dodaj
            </button>
          </Row>
          <Btn onClick={() => save("feature", feature)} saving={saving} />
        </Card>
      )}

      {/* ── SEKCIJE & PROIZVODI ── */}
      {tab === "sekcije" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <strong style={{ fontSize: 15, color: "#0B1D33" }}>Sekcije i proizvodi</strong>
              <p style={{ fontSize: 13, color: "#6B7B8A", margin: "3px 0 0" }}>
                Svaka sekcija = subGroup. Prevuci za redoslijed unutar sekcije. Prikazuje se na /proizvodi/{slug}
              </p>
            </div>
            <button onClick={() => setShowNewGroup(s => !s)} style={{
              padding: "8px 16px", background: "#0F766E", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Satoshi', sans-serif",
            }}>+ Nova sekcija</button>
          </div>

          {/* New group form */}
          {showNewGroup && (
            <div style={{ marginBottom: 16, padding: "12px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0", display: "flex", gap: 8 }}>
              <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Naziv nove sekcije..."
                autoFocus onKeyDown={e => e.key === "Enter" && addGroup()}
                style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #0F766E", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
              <button onClick={addGroup} style={{ padding: "8px 16px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>Dodaj</button>
              <button onClick={() => setShowNewGroup(false)} style={{ padding: "8px 12px", border: "1px solid #E2E8ED", background: "#fff", borderRadius: 7, cursor: "pointer", fontSize: 13 }}>✕</button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
            {/* Sekcije — D&D za sekcije + unutar sekcija */}
            <div>
              <DndContext sensors={sensors} collisionDetection={closestCenter}
                onDragEnd={e => handleSectionDragEnd(e, groups.filter(([n]) => n !== "Bez sekcije").map(([n]) => n))}>
                <SortableContext
                  items={groups.filter(([n]) => n !== "Bez sekcije").map(([n]) => n)}
                  strategy={verticalListSortingStrategy}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {groups.filter(([name]) => name !== "Bez sekcije").map(([groupName, groupProds]) => {
                      const realProds = groupProds.filter(p => !p.id.startsWith("__empty__"));
                      return (
                        <div key={groupName} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
                          <SortableSectionHeader
                            groupName={groupName}
                            realProds={realProds}
                            renamingGroup={renamingGroup}
                            renameVal={renameVal}
                            setRenamingGroup={setRenamingGroup}
                            setRenameVal={setRenameVal}
                            onRename={renameGroup}
                          />
                          {realProds.length === 0 ? (
                            <div style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                              Prazna sekcija — dodajte proizvode iz panela desno
                            </div>
                          ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(groupName, realProds, e)}>
                              <SortableContext items={realProds.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                {realProds.map(p => (
                                  <SortableProductRow key={p.id} p={p} onRemove={() => removeFromGroup(p.id)} />
                                ))}
                              </SortableContext>
                            </DndContext>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Bez sekcije */}
              {inCatUngrp.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 12, border: "1.5px dashed #E2E8ED", overflow: "hidden", opacity: 0.7 }}>
                  <div style={{ padding: "10px 16px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7B8A" }}>Bez sekcije ({inCatUngrp.length})</span>
                  </div>
                  {inCatUngrp.map(p => {
                    const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
                    return (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: "1px solid #F8FAFB" }}>
                        <div style={{ width: 32, height: 32, background: "#F8FAFB", borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
                        </div>
                        <span style={{ flex: 1, fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                        {groups.filter(([n]) => n !== "Bez sekcije").map(([gn]) => (
                          <button key={gn} onClick={() => moveToGroup(p.id, gn)} style={{ padding: "3px 8px", background: "#C7F1E6", color: "#0A5C56", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "'Satoshi', sans-serif", whiteSpace: "nowrap" }}>
                            → {gn.slice(0, 14)}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product picker */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden", position: "sticky", top: 80 }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB" }}>
                <strong style={{ fontSize: 13, color: "#0B1D33", display: "block", marginBottom: 8 }}>Dodaj iz baze proizvoda</strong>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži..."
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 12, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ maxHeight: 480, overflowY: "auto" }}>
                {/* Already in category — can reassign to group */}
                {products.filter(p => !p.id.startsWith("__empty__") && (!search || p.title.toLowerCase().includes(search.toLowerCase()))).map(p => {
                  const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
                  return (
                    <div key={p.id} style={{ padding: "8px 12px", borderBottom: "1px solid #F1F5F7", display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 28, height: 28, flexShrink: 0, background: "#F8FAFB", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3, fontSize: 10 }}>📦</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: p.subGroup ? "#0F766E" : "#9CA3AF" }}>{p.subGroup ?? "Bez sekcije"}</div>
                      </div>
                      <select onChange={e => { if (e.target.value) moveToGroup(p.id, e.target.value); e.target.value = ""; }}
                        style={{ fontSize: 10, border: "1px solid #E2E8ED", borderRadius: 5, padding: "3px 5px", fontFamily: "'Satoshi', sans-serif", cursor: "pointer", background: "#fff" }}>
                        <option value="">↔ Premjesti</option>
                        {groups.filter(([n]) => n !== (p.subGroup ?? "Bez sekcije") && !n.startsWith("Bez")).map(([gn]) => (
                          <option key={gn} value={gn}>{gn.slice(0, 18)}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}

                {/* Separator */}
                {notInCat.length > 0 && (
                  <div style={{ padding: "6px 12px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Iz drugih kategorija
                  </div>
                )}

                {notInCat.slice(0, 20).map(p => {
                  const img = (() => { try { return JSON.parse(p.images)[0]; } catch { return null; } })();
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid #F8FAFB" }}>
                      <div style={{ width: 28, height: 28, flexShrink: 0, background: "#F8FAFB", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ opacity: 0.3, fontSize: 10 }}>📦</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#0B1D33", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF" }}>{p.category.name}</div>
                      </div>
                      <select onChange={e => { if (e.target.value) addProductToGroup(p, e.target.value); e.target.value = ""; }}
                        style={{ fontSize: 10, border: "1px solid #0F766E", borderRadius: 5, padding: "3px 5px", fontFamily: "'Satoshi', sans-serif", cursor: "pointer", background: "#fff", color: "#0F766E" }}>
                        <option value="">+ Dodaj</option>
                        {groups.filter(([n]) => !n.startsWith("Bez")).map(([gn]) => (
                          <option key={gn} value={gn}>{gn.slice(0, 18)}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      {tab === "cta" && (
        <Card>
          <Row label="Naslov"><TI value={cta.h2} set={v => setCta({ ...cta, h2: v })} /></Row>
          <Row label="Opis"><TA value={cta.p} set={v => setCta({ ...cta, p: v })} rows={2} /></Row>
          <Btn onClick={() => save("cta", cta)} saving={saving} />
        </Card>
      )}
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>{children}</div>;
}
function TI({ value, set, placeholder }: { value: string; set: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827" }} />;
}
function TA({ value, set, rows = 3 }: { value: string; set: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => set(e.target.value)} rows={rows} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", resize: "vertical" }} />;
}
function Btn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return <button onClick={onClick} disabled={saving} style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>{saving ? "Čuvanje..." : "Sačuvaj"}</button>;
}
