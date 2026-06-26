"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

type RjesenjaPage = { slug: string; label: string; bg: string };

const DEFAULT_HERO = (slug: string, label: string, bg: string) => ({
  eyebrow: "Rješenja po industriji",
  h1: label.split("&")[0].trim() + " &",
  h1Highlight: label.split("&")[1]?.trim() ?? label,
  lead: "Opremamo objekte ovog tipa — od prvog tlocrta do otvaranja vrata.",
  heroBg: bg,
  stats: [{ num: "15+", label: "opremljenih objekata" }, { num: "Na ključ", label: "projekat → montaža" }, { num: "Besplatno", label: "savjetovanje" }],
  ghostLabel: "Pogledajte realizacije", ghostHref: "/realizacije",
});

export default function RjesenjaListAdmin() {
  const [pages, setPages] = useState<RjesenjaPage[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newBg, setNewBg] = useState("/assets/images/megamenu/supermarketi.jpg");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const s = await fetch("/api/settings").then(r => r.json());
    try { setPages(JSON.parse(s.rjesenja_pages ?? "[]")); } catch {}
  }
  useEffect(() => { load(); }, []);

  async function addPage() {
    if (!newSlug.trim() || !newLabel.trim()) return;
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (pages.find(p => p.slug === slug)) return alert("Slug već postoji.");
    setSaving(true);

    const newPages = [...pages, { slug, label: newLabel.trim(), bg: newBg }];
    // Save pages list
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rjesenja_pages: JSON.stringify(newPages) }) });

    // Seed default content for new page
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [`rjesenja_${slug}_hero`]: JSON.stringify(DEFAULT_HERO(slug, newLabel.trim(), newBg)),
        [`rjesenja_${slug}_zones`]: JSON.stringify({ badge: "Obim opremanja", h2: `Šta opremamo u ${newLabel}`, desc: "Pokrivamo svaku zonu objekta.", items: [] }),
        [`rjesenja_${slug}_realizacije`]: JSON.stringify({ items: [] }),
        [`rjesenja_${slug}_cta`]: JSON.stringify({ h2: `Opremate ${newLabel} objekat?`, p: "Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju." }),
      }) });

    setPages(newPages);
    setNewSlug(""); setNewLabel(""); setShowAdd(false); setSaving(false);
  }

  async function deletePage(slug: string) {
    if (!confirm(`Obrisati stranicu "${slug}"? Ovo briše i sve proizvode sa nje.`)) return;
    setDeleting(slug);
    const newPages = pages.filter(p => p.slug !== slug);

    // Delete rjesenja items
    const items = await fetch(`/api/rjesenja-items?slug=${slug}`).then(r => r.json());
    for (const item of items) {
      await fetch("/api/rjesenja-items", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) });
    }

    // Save updated pages list
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rjesenja_pages: JSON.stringify(newPages) }) });

    setPages(newPages);
    setDeleting(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Rješenja stranice</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{pages.length} stranica · klikni za uređivanje svake sekcije</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: "11px 22px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" }}>
          + Nova stranica
        </button>
      </div>

      {/* Pages grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {pages.map(page => (
          <div key={page.slug} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
            {/* Thumbnail */}
            <div style={{ height: 120, backgroundImage: `url('${page.bg}')`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(11,29,51,0.55)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{page.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>/rjesenja/{page.slug}</div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ padding: "14px 16px", display: "flex", gap: 8 }}>
              <Link href={`/admin/rjesenja/${page.slug}`} style={{ flex: 1, padding: "9px 14px", background: "#0F766E", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                ✏️ Uredi
              </Link>
              <a href={`/rjesenja/${page.slug}`} target="_blank" style={{ padding: "9px 12px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                👁
              </a>
              <button onClick={() => deletePage(page.slug)} disabled={deleting === page.slug}
                style={{ padding: "9px 12px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                {deleting === page.slug ? "..." : "🗑"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add modal */}
      {showAdd && (
        <>
          <div onClick={() => setShowAdd(false)} style={{ position: "fixed", inset: 0, background: "rgba(11,29,51,0.5)", zIndex: 9998 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 28, width: 480, zIndex: 9999, fontFamily: "'Satoshi', sans-serif", boxShadow: "0 24px 64px rgba(11,29,51,0.25)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0B1D33", margin: "0 0 20px" }}>Nova rješenja stranica</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={lbl}>Naziv stranice *</label>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="npr. Gas stanice & Benzinska" style={inp} />
              </div>
              <div>
                <label style={lbl}>URL slug * <span style={{ fontWeight: 400, color: "#6B7B8A" }}>(automatski iz naziva)</span></label>
                <input value={newSlug || newLabel.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")} onChange={e => setNewSlug(e.target.value)} placeholder="gas-stanice" style={inp} />
                <p style={{ fontSize: 12, color: "#6B7B8A", marginTop: 4 }}>Stranica će biti dostupna na: /rjesenja/{newSlug || "slug"}</p>
              </div>
              <div>
                <ImageUpload label="Hero pozadinska slika" value={newBg} onChange={setNewBg} maxWidthPx={1440} qualityWebp={0.85} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", border: "1.5px solid #E2E8ED", borderRadius: 8, background: "#fff", cursor: "pointer", fontFamily: "'Satoshi', sans-serif" }}>Odustani</button>
              <button onClick={addPage} disabled={saving} style={{ flex: 2, padding: "10px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
                {saving ? "Kreiranje..." : "Kreiraj stranicu"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
