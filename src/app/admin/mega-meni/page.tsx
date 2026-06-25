"use client";
import { useEffect, useState } from "react";

type RjesenjaItem = { slug: string; title: string; sub: string; img: string; desc: string };
type ProizvodiItem = { slug: string; title: string; sub: string; img: string };
type RjesenjaPage = { slug: string; label: string; bg: string };

export default function MegaMeniAdmin() {
  const [rjesenja, setRjesenja] = useState<RjesenjaItem[]>([]);
  const [proizvodi, setProizvodi] = useState<ProizvodiItem[]>([]);
  const [pages, setPages] = useState<RjesenjaPage[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  // Rename state
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameLabel, setRenameLabel] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setRjesenja(JSON.parse(s.megamenu_rjesenja ?? "[]")); } catch {}
      try { setProizvodi(JSON.parse(s.megamenu_proizvodi ?? "[]")); } catch {}
      try { setPages(JSON.parse(s.rjesenja_pages ?? "[]")); } catch {}
    });
  }, []);

  async function save(key: string, value: unknown, label: string) {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: JSON.stringify(value) }),
    });
    setSaving(false); setSaved(label);
    setTimeout(() => setSaved(""), 2000);
  }

  async function renamePage(slug: string, newLabel: string) {
    // Update rjesenja_pages
    const newPages = pages.map(p => p.slug === slug ? { ...p, label: newLabel } : p);
    // Update megamenu_rjesenja title
    const newRjesenja = rjesenja.map(r => r.slug === slug ? { ...r, title: newLabel } : r);
    // Update hero eyebrow for that page
    await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rjesenja_pages: JSON.stringify(newPages),
        megamenu_rjesenja: JSON.stringify(newRjesenja),
      }),
    });
    setPages(newPages);
    setRjesenja(newRjesenja);
    setRenaming(null);
    setRenameLabel("");
    setSaved("rename");
    setTimeout(() => setSaved(""), 2000);
  }

  // Add new page to mega menu rjesenja
  async function addToMegaMenu(page: RjesenjaPage) {
    if (rjesenja.find(r => r.slug === page.slug)) return;
    const newItem: RjesenjaItem = {
      slug: page.slug,
      title: page.label,
      sub: "Opremanje · Montaža · Na ključ",
      img: page.bg,
      desc: `Opremanje ${page.label} objekta — od tlocrta do otvaranja.`,
    };
    const updated = [...rjesenja, newItem];
    setRjesenja(updated);
    await save("megamenu_rjesenja", updated, "rjesenja");
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Mega meni uređivač</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>
          Upravljajte thumbnail slikama i tekstom u dropdown menijima. Promjene se odmah vide na sajtu.
        </p>
      </div>

      {/* ── RENAME PAGES ── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 15, color: "#0B1D33" }}>Nazivi rješenja stranica</strong>
          {saved === "rename" && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Preimenovano</span>}
        </div>
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {pages.map(page => (
            <div key={page.slug} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              {page.bg && <img src={page.bg} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                {renaming === page.slug ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={renameLabel} onChange={e => setRenameLabel(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && renamePage(page.slug, renameLabel)}
                      style={{ flex: 1, padding: "7px 10px", border: "1.5px solid #0F766E", borderRadius: 7, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
                    <button onClick={() => renamePage(page.slug, renameLabel)} style={btnGreen}>✓ Sačuvaj</button>
                    <button onClick={() => setRenaming(null)} style={btnGhost}>Odustani</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0B1D33" }}>{page.label}</span>
                    <span style={{ fontSize: 12, color: "#6B7B8A" }}>/rjesenja/{page.slug}</span>
                    <button onClick={() => { setRenaming(page.slug); setRenameLabel(page.label); }}
                      style={{ padding: "4px 12px", background: "#E6EEF2", color: "#0B1D33", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'Satoshi', sans-serif" }}>
                      ✏️ Preimenuj
                    </button>
                  </div>
                )}
              </div>
              {/* Add to mega menu if not already there */}
              {!rjesenja.find(r => r.slug === page.slug) && (
                <button onClick={() => addToMegaMenu(page)} style={{ padding: "5px 12px", background: "#DCFCE7", color: "#16A34A", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'Satoshi', sans-serif", flexShrink: 0 }}>
                  + Dodaj u meni
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MEGA RJEŠENJA ── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ fontSize: 15, color: "#0B1D33" }}>Mega meni — Rješenja</strong>
            <span style={{ fontSize: 12, color: "#6B7B8A", marginLeft: 8 }}>Thumbnail + subtitle tekst za svaku stavku u dropdawnu</span>
          </div>
          {saved === "rjesenja" && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
        </div>
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {rjesenja.map((item, i) => (
            <div key={item.slug} style={{ padding: "14px 16px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {item.img && <img src={item.img} alt="" style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1D33" }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#6B7B8A" }}>/rjesenja/{item.slug}</div>
                </div>
                <button onClick={() => { const u = rjesenja.filter((_, idx) => idx !== i); setRjesenja(u); }}
                  style={{ marginLeft: "auto", padding: "4px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={lbl}>Thumbnail URL</label>
                  <input value={item.img} onChange={e => { const u = [...rjesenja]; u[i] = { ...u[i], img: e.target.value }; setRjesenja(u); }} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Subtitle (mali tekst)</label>
                  <input value={item.sub} onChange={e => { const u = [...rjesenja]; u[i] = { ...u[i], sub: e.target.value }; setRjesenja(u); }} style={inp} placeholder="Rashlada · Checkout · Police" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Feature panel opis (pojavljuje se desno u mega meniju)</label>
                  <input value={item.desc} onChange={e => { const u = [...rjesenja]; u[i] = { ...u[i], desc: e.target.value }; setRjesenja(u); }} style={inp} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => save("megamenu_rjesenja", rjesenja, "rjesenja")} disabled={saving}
            style={{ ...btnGreen, alignSelf: "flex-start" }}>
            {saving ? "Čuvanje..." : "Sačuvaj Rješenja meni"}
          </button>
        </div>
      </div>

      {/* ── MEGA PROIZVODI ── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ fontSize: 15, color: "#0B1D33" }}>Mega meni — Proizvodi</strong>
            <span style={{ fontSize: 12, color: "#6B7B8A", marginLeft: 8 }}>7 kategorija sa thumbnail karticama</span>
          </div>
          {saved === "proizvodi" && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
        </div>
        <div style={{ padding: "16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 14 }}>
            {proizvodi.map((item, i) => (
              <div key={item.slug} style={{ padding: "12px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {item.img && <img src={item.img} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1D33" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7B8A" }}>/proizvodi/{item.slug}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <label style={lbl}>Thumbnail URL</label>
                    <input value={item.img} onChange={e => { const u = [...proizvodi]; u[i] = { ...u[i], img: e.target.value }; setProizvodi(u); }} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Subtitle</label>
                    <input value={item.sub} onChange={e => { const u = [...proizvodi]; u[i] = { ...u[i], sub: e.target.value }; setProizvodi(u); }} style={inp} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => save("megamenu_proizvodi", proizvodi, "proizvodi")} disabled={saving}
            style={{ ...btnGreen, marginTop: 16 }}>
            {saving ? "Čuvanje..." : "Sačuvaj Proizvodi meni"}
          </button>
        </div>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
const btnGreen: React.CSSProperties = { padding: "10px 22px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
const btnGhost: React.CSSProperties = { padding: "7px 14px", border: "1.5px solid #E2E8ED", background: "#fff", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
