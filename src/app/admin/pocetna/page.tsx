"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type Stat = { num: string; label: string };
type HeroData = {
  eyebrow: string;
  h1: string;
  h1Highlight: string;
  subtitle: string;
  stats: Stat[];
  slides: string[];
};
type Client = { src: string; alt: string };

const DEFAULT_HERO: HeroData = {
  eyebrow: "Partner za opremanje na ključ",
  h1: "Vaš objekat, spreman",
  h1Highlight: "na dan otvaranja",
  subtitle: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora. Radimo s lancima koji ne trpe kašnjenje — Lidl, IKEA, Carrefour, SPAR.",
  stats: [
    { num: "200+", label: "Realizovanih projekata" },
    { num: "3", label: "Kontinenta" },
    { num: "15+", label: "Godina iskustva" },
  ],
  slides: [
    "/assets/images/hero/puglia-inox-1.jpg",
    "/assets/images/hero/puglia-inox-2.jpg",
    "/assets/images/hero/puglia-inox-3.jpg",
    "/assets/images/hero/esthederm.jpg",
    "/assets/images/hero/MINIEKOCOLORE.Leclerc2.jpg",
    "/assets/images/hero/ICASupermarketPelikan.jpg",
    "/assets/images/hero/PoppyBudapest2.jpg",
    "/assets/images/hero/1764661906919.jpg",
    "/assets/images/hero/ConadItaly1.jpg",
  ],
};

const DEFAULT_CLIENTS: Client[] = [
  { src: "/assets/images/clients/Logo-Lidl.webp", alt: "Lidl" },
  { src: "/assets/images/clients/IKEA-Logo-400x225.webp", alt: "IKEA" },
  { src: "/assets/images/clients/carrefour-logo-385x300.webp", alt: "Carrefour" },
  { src: "/assets/images/clients/Logo-Spar.webp", alt: "SPAR" },
  { src: "/assets/images/clients/Logo-Konzum-400x84.webp", alt: "Konzum" },
  { src: "/assets/images/clients/aldi-logo.webp", alt: "Aldi" },
  { src: "/assets/images/clients/Logo-Coop-400x159.webp", alt: "Coop" },
  { src: "/assets/images/clients/Logo-Knauf-400x83.webp", alt: "Kaufland" },
  { src: "/assets/images/clients/nestle-4-logo-png-transparent-300x300.webp", alt: "Nestlé" },
  { src: "/assets/images/clients/Logo-Loreal.webp", alt: "L'Oréal" },
  { src: "/assets/images/clients/InterContinentalLogo.svg-400x155.webp", alt: "InterContinental" },
  { src: "/assets/images/clients/Magyar_Telekom-Logo.wine_-400x267.webp", alt: "Magyar Telekom" },
];

export default function PocetnaAdmin() {
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [clients, setClients] = useState<Client[]>(DEFAULT_CLIENTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setHero(JSON.parse(s.homepage_hero)); } catch {}
      try { setClients(JSON.parse(s.homepage_clients)); } catch {}
    });
  }, []);

  async function save(key: string, value: unknown) {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: JSON.stringify(value) }),
    });
    setSaving(false);
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    if (!res.ok) { alert("Greška pri snimanju. Pokušajte ponovo."); return; }
    setSaved(key);
    setTimeout(() => setSaved(""), 4000);
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Početna stranica — Uređivač</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Hero tekst, statistike, slideshow slike i karousel klijenata.</p>
      </div>

      {/* ── HERO TEKST ── */}
      <Sec title="Hero — Tekst i statistike" saved={saved === "homepage_hero"}>
        <Row label="Eyebrow badge">
          <TI value={hero.eyebrow} set={v => setHero({ ...hero, eyebrow: v })} />
        </Row>
        <Row label="H1 naslov (prvi dio)">
          <TI value={hero.h1} set={v => setHero({ ...hero, h1: v })} />
        </Row>
        <Row label="H1 istaknuti dio (teal boja)">
          <TI value={hero.h1Highlight} set={v => setHero({ ...hero, h1Highlight: v })} />
        </Row>
        <Row label="Subtitle tekst">
          <TA value={hero.subtitle} set={v => setHero({ ...hero, subtitle: v })} rows={3} />
        </Row>
        <Row label="Statistike">
          {hero.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <TI placeholder="Broj (200+)" value={s.num} set={v => {
                const st = [...hero.stats]; st[i] = { ...st[i], num: v }; setHero({ ...hero, stats: st });
              }} />
              <TI placeholder="Labela" value={s.label} set={v => {
                const st = [...hero.stats]; st[i] = { ...st[i], label: v }; setHero({ ...hero, stats: st });
              }} />
            </div>
          ))}
        </Row>
        <Btn onClick={() => save("homepage_hero", hero)} saving={saving} />
      </Sec>

      {/* ── SLIDESHOW ── */}
      <Sec title="Hero slideshow — Pozadinske slike" saved={saved === "homepage_hero_slides"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 14px" }}>
          Slike se rotiraju automatski u pozadini hero sekcije. Preporučena veličina: 1920×1080px.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {hero.slides.map((slide, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              {slide && <img src={slide} alt="" style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <ImageUpload
                  value={slide}
                  onChange={url => {
                    const slides = [...hero.slides]; slides[i] = url; setHero({ ...hero, slides });
                  }}
                  maxWidthPx={1920}
                  qualityWebp={0.85}
                />
              </div>
              <button onClick={() => {
                const slides = hero.slides.filter((_, idx) => idx !== i);
                setHero({ ...hero, slides });
              }} style={{ padding: "8px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={() => setHero({ ...hero, slides: [...hero.slides, ""] })}
          style={{ marginTop: 12, padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
          + Dodaj sliku
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => save("homepage_hero", hero)} saving={saving} label="Sačuvaj slideshow" />
        </div>
      </Sec>

      {/* ── KLIJENTI KAROUSEL ── */}
      <Sec title="Karousel klijenata — Logotipi" saved={saved === "homepage_clients"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 14px" }}>
          Logotipi kompanija u traci ispod hero sekcije. Preporučena veličina: max 400×200px, transparentna pozadina (WebP/PNG).
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {clients.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              <div style={{ width: 80, height: 48, background: "#fff", border: "1px solid #E2E8ED", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                {c.src && <img src={c.src} alt={c.alt} style={{ maxWidth: 72, maxHeight: 40, objectFit: "contain" }} />}
              </div>
              <div style={{ flex: 1, display: "flex", gap: 8 }}>
                <div style={{ flex: 2 }}>
                  <label style={lbl}>URL logotipa</label>
                  <input value={c.src} onChange={e => {
                    const cl = [...clients]; cl[i] = { ...cl[i], src: e.target.value }; setClients(cl);
                  }} style={inp} placeholder="/assets/images/clients/..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Naziv kompanije</label>
                  <input value={c.alt} onChange={e => {
                    const cl = [...clients]; cl[i] = { ...cl[i], alt: e.target.value }; setClients(cl);
                  }} style={inp} placeholder="Lidl" />
                </div>
              </div>
              <button onClick={() => setClients(clients.filter((_, idx) => idx !== i))}
                style={{ padding: "8px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0, marginTop: 16 }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={() => setClients([...clients, { src: "", alt: "" }])}
          style={{ marginTop: 12, padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
          + Dodaj klijenta
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => save("homepage_clients", clients)} saving={saving} label="Sačuvaj karousel" />
        </div>
      </Sec>
    </div>
  );
}

function Sec({ title, children, saved }: { title: string; children: React.ReactNode; saved: boolean }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 20, overflow: "hidden" }}>
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
function TA({ value, set, rows = 3 }: { value: string; set: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => set(e.target.value)} rows={rows} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block", resize: "vertical" }} />;
}
function Btn({ onClick, saving, label = "Sačuvaj sekciju" }: { onClick: () => void; saving: boolean; label?: string }) {
  return <button onClick={onClick} disabled={saving} style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>{saving ? "Čuvanje..." : label}</button>;
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
