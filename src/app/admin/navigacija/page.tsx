"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type NavItem = { id: string; label: string; url: string; type: string; subtitle?: string; thumbnail?: string; order: number };
type RjesenjaItem = { slug: string; title: string; sub: string; img: string; desc: string };
type ProizvodiItem = { slug: string; title: string; sub: string; img: string };
type RjesenjaPage = { slug: string; label: string; bg: string };

type Section = "nav" | "rjesenja" | "proizvodi" | "stranice";

export default function NavigacijaAdmin() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [rjesenja, setRjesenja] = useState<RjesenjaItem[]>([]);
  const [proizvodi, setProizvodi] = useState<ProizvodiItem[]>([]);
  const [pages, setPages] = useState<RjesenjaPage[]>([]);
  const [section, setSection] = useState<Section>("nav");
  const [allCategories, setAllCategories] = useState<{ slug: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [newItem, setNewItem] = useState({ label: "", url: "", type: "link" });
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameLabel, setRenameLabel] = useState("");

  async function load() {
    const [menuRes, settingsRes] = await Promise.all([
      fetch("/api/menu").then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
    ]);
    setNavItems(menuRes);
    try { setRjesenja(JSON.parse(settingsRes.megamenu_rjesenja ?? "[]")); } catch {}
    try { setProizvodi(JSON.parse(settingsRes.megamenu_proizvodi ?? "[]")); } catch {}
    try { setPages(JSON.parse(settingsRes.rjesenja_pages ?? "[]")); } catch {}
    const cats = await fetch("/api/admin/categories").then(r => r.json()).catch(() => []);
    setAllCategories(Array.isArray(cats) ? cats : []);
  }
  useEffect(() => { load(); }, []);

  async function saveSetting(key: string, value: unknown, label: string) {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: JSON.stringify(value) }),
    });
    setSaving(false);
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    if (!res.ok) { alert("Greška pri snimanju. Pokušajte ponovo."); return; }
    setSaved(label);
    setTimeout(() => setSaved(""), 4000);
  }

  // Nav CRUD
  async function addNavItem() {
    if (!newItem.label || !newItem.url) return;
    await fetch("/api/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newItem, order: navItems.length + 1 }) });
    setNewItem({ label: "", url: "", type: "link" });
    await load();
  }
  async function deleteNavItem(id: string) {
    if (!confirm("Obrisati stavku?")) return;
    await fetch("/api/menu", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  // Rename page
  async function renamePage(slug: string, newLabel: string) {
    const newPages = pages.map(p => p.slug === slug ? { ...p, label: newLabel } : p);
    const newR = rjesenja.map(r => r.slug === slug ? { ...r, title: newLabel } : r);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rjesenja_pages: JSON.stringify(newPages), megamenu_rjesenja: JSON.stringify(newR) }) });
    setPages(newPages); setRjesenja(newR); setRenaming(null);
    setSaved("rename"); setTimeout(() => setSaved(""), 4000);
  }

  async function addToMegaMenu(page: RjesenjaPage) {
    if (rjesenja.find(r => r.slug === page.slug)) return;
    const updated = [...rjesenja, { slug: page.slug, title: page.label, sub: "Opremanje · Na ključ", img: page.bg, desc: `Opremanje ${page.label} objekta.` }];
    setRjesenja(updated);
    await saveSetting("megamenu_rjesenja", updated, "rjesenja");
  }

  const TABS: { key: Section; label: string }[] = [
    { key: "nav", label: "Glavna navigacija" },
    { key: "rjesenja", label: "Mega — Rješenja" },
    { key: "proizvodi", label: "Mega — Proizvodi" },
    { key: "stranice", label: "Stranice & nazivi" },
  ];

  const typeLabels: Record<string, string> = { link: "Link", "mega-rjesenja": "Mega Rješenja", "mega-proizvodi": "Mega Proizvodi" };

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Navigacija</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Upravljanje svim navigacijskim elementima sajta na jednom mjestu.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E2E8ED", marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setSection(t.key)} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: section === t.key ? 700 : 400,
            color: section === t.key ? "#0F766E" : "#6B7B8A",
            borderBottom: section === t.key ? "2.5px solid #0F766E" : "2.5px solid transparent",
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
        {saved && <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", fontSize: 13, color: "#16A34A", fontWeight: 500, paddingBottom: 10 }}>✓ Sačuvano</span>}
      </div>

      {/* ── TAB: GLAVNA NAVIGACIJA ── */}
      {section === "nav" && (
        <div>
          <p style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 16 }}>Redoslijed stavki u glavnoj navigaciji (header). "Mega" tipovi otvaraju dropdown.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {navItems.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED" }}>
                <div style={{ width: 6, height: 32, background: "#C7F1E6", borderRadius: 3, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0B1D33" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7B8A" }}>{item.url} · <span style={{ color: "#0F766E", fontWeight: 500 }}>{typeLabels[item.type] ?? item.type}</span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>#{item.order}</span>
                  <button onClick={() => deleteNavItem(item.id)} style={{ padding: "5px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 20 }}>
            <strong style={{ fontSize: 14, color: "#0B1D33", display: "block", marginBottom: 14 }}>Dodaj stavku</strong>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={lbl}>Naziv *</label>
                <input value={newItem.label} onChange={e => setNewItem({ ...newItem, label: e.target.value })} placeholder="npr. Reference" style={inp} />
              </div>
              <div>
                <label style={lbl}>URL *</label>
                <input value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} placeholder="/reference" style={inp} />
              </div>
              <div>
                <label style={lbl}>Tip</label>
                <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })} style={inp}>
                  <option value="link">Obični link</option>
                  <option value="mega-rjesenja">Mega — Rješenja</option>
                  <option value="mega-proizvodi">Mega — Proizvodi</option>
                </select>
              </div>
            </div>
            <button onClick={addNavItem} style={btnPrimary}>+ Dodaj</button>
          </div>
        </div>
      )}

      {/* ── TAB: MEGA RJEŠENJA ── */}
      {section === "rjesenja" && (
        <div>
          <p style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 16 }}>Stavke u Rješenja dropdownu. Svaka ima thumbnail, podnaslov i opis za feature panel desno.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rjesenja.map((item, i) => (
              <div key={item.slug} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, background: "#0B1D33", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#C7F1E6", fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0B1D33" }}>{item.title}</span>
                    <span style={{ fontSize: 11, color: "#6B7B8A" }}>/rjesenja/{item.slug}</span>
                  </div>
                  <button onClick={() => { const u = rjesenja.filter((_, idx) => idx !== i); setRjesenja(u); }}
                    style={{ padding: "4px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Ukloni</button>
                </div>
                <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <ImageUpload label="Thumbnail slika" value={item.img}
                      onChange={v => { const u = [...rjesenja]; u[i] = { ...u[i], img: v }; setRjesenja(u); }}
                      maxWidthPx={800} qualityWebp={0.85} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={lbl}>Podnaslov (mali tekst)</label>
                      <input value={item.sub} onChange={e => { const u = [...rjesenja]; u[i] = { ...u[i], sub: e.target.value }; setRjesenja(u); }} style={inp} placeholder="Rashlada · Checkout · Police" />
                    </div>
                    <div>
                      <label style={lbl}>Feature panel opis (desno u mega meniju)</label>
                      <textarea value={item.desc} onChange={e => { const u = [...rjesenja]; u[i] = { ...u[i], desc: e.target.value }; setRjesenja(u); }} rows={3}
                        style={{ ...inp, resize: "vertical" }} placeholder="Kratki opis..." />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pages not in mega menu yet */}
          {pages.filter(p => !rjesenja.find(r => r.slug === p.slug)).length > 0 && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0" }}>
              <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>Stranice koje nisu u mega meniju: </span>
              {pages.filter(p => !rjesenja.find(r => r.slug === p.slug)).map(page => (
                <button key={page.slug} onClick={() => addToMegaMenu(page)} style={{ padding: "4px 12px", background: "#fff", border: "1.5px solid #16A34A", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#16A34A", fontFamily: "'Satoshi', sans-serif", marginLeft: 8 }}>
                  {page.label} +
                </button>
              ))}
            </div>
          )}

          <button onClick={() => saveSetting("megamenu_rjesenja", rjesenja, "rjesenja")} disabled={saving}
            style={{ ...btnPrimary, marginTop: 20 }}>
            {saving ? "Čuvanje..." : "Sačuvaj Rješenja meni"}
          </button>
        </div>
      )}

      {/* ── TAB: MEGA PROIZVODI ── */}
      {section === "proizvodi" && (
        <div>
          <p style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 16 }}>Kartice u Proizvodi dropdownu — svaka sa thumbnail i podnaslovom.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
            {proizvodi.map((item, i) => (
              <div key={item.slug} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", background: "#F8FAFB", borderBottom: "1px solid #E2E8ED", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0B1D33" }}>{item.title}</span>
                    <span style={{ fontSize: 11, color: "#6B7B8A", marginLeft: 8 }}>/proizvodi/{item.slug}</span>
                  </div>
                  <button
                    onClick={() => { if (!confirm(`Ukloniti "${item.title}" iz menija?`)) return; setProizvodi(proizvodi.filter((_, idx) => idx !== i)); }}
                    style={{ padding: "4px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                  >✕ Ukloni</button>
                </div>
                <div style={{ padding: "14px" }}>
                  <ImageUpload label="Thumbnail" value={item.img}
                    onChange={v => { const u = [...proizvodi]; u[i] = { ...u[i], img: v }; setProizvodi(u); }}
                    maxWidthPx={600} qualityWebp={0.80} />
                  <div style={{ marginTop: 10 }}>
                    <label style={lbl}>Podnaslov</label>
                    <input value={item.sub} onChange={e => { const u = [...proizvodi]; u[i] = { ...u[i], sub: e.target.value }; setProizvodi(u); }} style={inp} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dodaj karticu */}
          {allCategories.filter(c => !proizvodi.find(p => p.slug === c.slug)).length > 0 && (
            <div style={{ marginTop: 20, padding: "16px 18px", background: "#F0FDF4", borderRadius: 10, border: "1.5px solid #BBF7D0" }}>
              <strong style={{ fontSize: 14, color: "#0B1D33", display: "block", marginBottom: 10 }}>+ Dodaj karticu u meni</strong>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <select
                  id="new-prod-select"
                  style={{ ...inp, flex: 1, minWidth: 200, cursor: "pointer" }}
                  defaultValue=""
                >
                  <option value="" disabled>Odaberite kategoriju...</option>
                  {allCategories
                    .filter(c => !proizvodi.find(p => p.slug === c.slug))
                    .map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)
                  }
                </select>
                <button
                  onClick={() => {
                    const sel = (document.getElementById("new-prod-select") as HTMLSelectElement).value;
                    if (!sel) return;
                    const cat = allCategories.find(c => c.slug === sel);
                    if (!cat) return;
                    setProizvodi([...proizvodi, { slug: cat.slug, title: cat.name, sub: "", img: "" }]);
                  }}
                  style={btnPrimary}
                >Dodaj</button>
              </div>
            </div>
          )}

          <button onClick={() => saveSetting("megamenu_proizvodi", proizvodi, "proizvodi")} disabled={saving}
            style={{ ...btnPrimary, marginTop: 16 }}>
            {saving ? "Čuvanje..." : "Sačuvaj Proizvodi meni"}
          </button>
        </div>
      )}

      {/* ── TAB: STRANICE & NAZIVI ── */}
      {section === "stranice" && (
        <div>
          <p style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 16 }}>Preimenujte rješenja stranice. Promjena naziva automatski updateuje meni i mega meni.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pages.map(page => (
              <div key={page.slug} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED" }}>
                <ImageUpload value={page.bg} onChange={v => setPages(pages.map(p => p.slug === page.slug ? { ...p, bg: v } : p))}
                  maxWidthPx={800} qualityWebp={0.82} label="" />
                {renaming === page.slug ? (
                  <div style={{ flex: 1, display: "flex", gap: 8 }}>
                    <input value={renameLabel} onChange={e => setRenameLabel(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && renamePage(page.slug, renameLabel)}
                      style={{ flex: 1, ...inp }} autoFocus />
                    <button onClick={() => renamePage(page.slug, renameLabel)} style={btnPrimary}>✓</button>
                    <button onClick={() => setRenaming(null)} style={btnGhost}>✕</button>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0B1D33" }}>{page.label}</div>
                      <div style={{ fontSize: 12, color: "#6B7B8A" }}>/rjesenja/{page.slug}</div>
                    </div>
                    <button onClick={() => { setRenaming(page.slug); setRenameLabel(page.label); }}
                      style={{ padding: "5px 12px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'Satoshi', sans-serif" }}>
                      ✏️ Preimenuj
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {saved === "rename" && <div style={{ marginTop: 12, fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Preimenovano — updateovano u meniju i mega meniju</div>}
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
const btnPrimary: React.CSSProperties = { padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
const btnGhost: React.CSSProperties = { padding: "9px 14px", border: "1.5px solid #E2E8ED", background: "#fff", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
