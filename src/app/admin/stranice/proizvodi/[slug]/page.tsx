"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

type Stat = { num: string; label: string };
type Hero = { eyebrow: string; h1: string; h1Highlight: string; lead: string; heroBg: string; stats: Stat[]; ghostLabel: string; ghostHref: string };
type Feature = { badge: string; h2: string; p: string; li: string[]; img: string };
type Cta = { h2: string; p: string };
type Tab = "hero" | "feature" | "cta";

export default function ProizvodiPageEditor() {
  const { slug } = useParams<{ slug: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [feature, setFeature] = useState<Feature | null>(null);
  const [cta, setCta] = useState<Cta | null>(null);
  const [tab, setTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setHero(JSON.parse(s[`proizvodi_${slug}_hero`])); } catch {}
      try { setFeature(JSON.parse(s[`proizvodi_${slug}_feature`])); } catch {}
      try { setCta(JSON.parse(s[`proizvodi_${slug}_cta`])); } catch {}
    });
  }, [slug]);

  async function save(section: string, value: unknown) {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [`proizvodi_${slug}_${section}`]: JSON.stringify(value) }),
    });
    setSaving(false); setSaved(section);
    setTimeout(() => setSaved(""), 2000);
  }

  if (!hero || !feature || !cta) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  const TABS: { key: Tab; label: string }[] = [
    { key: "hero", label: "Hero sekcija" },
    { key: "feature", label: "Feature (slika + lista)" },
    { key: "cta", label: "CTA banner" },
  ];

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#6B7B8A", marginBottom: 6 }}>
          <Link href="/admin/stranice/proizvodi" style={{ color: "#6B7B8A", textDecoration: "none" }}>Proizvodi stranice</Link> › {slug}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", margin: 0 }}>/proizvodi/{slug}</h1>
          <a href={`/proizvodi/${slug}`} target="_blank" style={{ fontSize: 13, color: "#0F766E", textDecoration: "none" }}>Pogledaj stranicu →</a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8ED", marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: tab === t.key ? 700 : 400,
            color: tab === t.key ? "#0F766E" : "#6B7B8A",
            borderBottom: tab === t.key ? "2.5px solid #0F766E" : "2.5px solid transparent", marginBottom: -1,
          }}>{t.label}</button>
        ))}
        {saved && <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: 13, color: "#16A34A", fontWeight: 500, paddingBottom: 10 }}>✓ Sačuvano</span>}
      </div>

      {/* HERO */}
      {tab === "hero" && (
        <Card>
          <Row label="Eyebrow"><TI value={hero.eyebrow} set={v => setHero({ ...hero, eyebrow: v })} /></Row>
          <Row label="H1 tekst"><TI value={hero.h1} set={v => setHero({ ...hero, h1: v })} /></Row>
          <Row label="H1 istaknuti (teal)"><TI value={hero.h1Highlight} set={v => setHero({ ...hero, h1Highlight: v })} /></Row>
          <Row label="Lead paragraf"><TA value={hero.lead} set={v => setHero({ ...hero, lead: v })} /></Row>
          <Row label="Hero pozadinska slika">
            <ImageUpload value={hero.heroBg} onChange={v => setHero({ ...hero, heroBg: v })} maxWidthPx={1440} qualityWebp={0.85} />
          </Row>
          <Row label="Statistike (3)">
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

      {/* FEATURE */}
      {tab === "feature" && (
        <Card>
          <Row label="Badge tekst"><TI value={feature.badge} set={v => setFeature({ ...feature, badge: v })} /></Row>
          <Row label="Naslov (H2)"><TI value={feature.h2} set={v => setFeature({ ...feature, h2: v })} /></Row>
          <Row label="Paragraf"><TA value={feature.p} set={v => setFeature({ ...feature, p: v })} /></Row>
          <Row label="Slika (lijeva strana)">
            <ImageUpload value={feature.img} onChange={v => setFeature({ ...feature, img: v })} maxWidthPx={900} qualityWebp={0.85} />
          </Row>
          <Row label="Bullet točke (5)">
            {feature.li.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                <span style={{ color: "#0F766E", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <input value={item} onChange={e => { const nl = [...feature.li]; nl[i] = e.target.value; setFeature({ ...feature, li: nl }); }}
                  style={{ flex: 1, padding: "8px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none" }} />
                <button onClick={() => setFeature({ ...feature, li: feature.li.filter((_, idx) => idx !== i) })}
                  style={{ padding: "6px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => setFeature({ ...feature, li: [...feature.li, ""] })}
              style={{ padding: "6px 14px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'Satoshi', sans-serif", marginTop: 4 }}>
              + Dodaj stavku
            </button>
          </Row>
          <Btn onClick={() => save("feature", feature)} saving={saving} />
        </Card>
      )}

      {/* CTA */}
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
