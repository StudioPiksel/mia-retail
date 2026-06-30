"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type Hero = { eyebrow: string; h1: string; h1Highlight: string; lead: string; heroBg: string; stats: { num: string; label: string }[]; ctaLabel: string; ctaHref: string };
type Chip = { label: string; href: string };
type Step = { num: string; title: string; desc: string; chips: Chip[] };
type Help = { badge: string; h2: string; p: string; btn1Label: string; btn1Href: string; btn2Label: string; btn2Href: string };

export default function PomocAdmin() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [help, setHelp] = useState<Help | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setHero(JSON.parse(s.pomoc_hero)); } catch {}
      try { setSteps(JSON.parse(s.pomoc_steps)); } catch {}
      try { setHelp(JSON.parse(s.pomoc_help)); } catch {}
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
    setTimeout(() => setSaved(""), 2000);
  }

  if (!hero || !help) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Pomoć u izboru — Uređivač</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Svaka sekcija se snima zasebno. Izmjene su odmah vidljive na sajtu.</p>
      </div>

      {/* HERO */}
      <Sec title="Hero sekcija" saved={saved === "pomoc_hero"}>
        <Row label="Eyebrow"><TI value={hero.eyebrow} set={v => setHero({ ...hero, eyebrow: v })} /></Row>
        <Row label="H1 tekst"><TI value={hero.h1} set={v => setHero({ ...hero, h1: v })} /></Row>
        <Row label="H1 istaknuti dio (teal)"><TI value={hero.h1Highlight} set={v => setHero({ ...hero, h1Highlight: v })} /></Row>
        <Row label="Lead tekst"><TA value={hero.lead} set={v => setHero({ ...hero, lead: v })} /></Row>
        <Row label="Hero pozadinska slika"><ImageUpload value={hero.heroBg} onChange={v => setHero({ ...hero, heroBg: v })} maxWidthPx={1440} qualityWebp={0.85} /></Row>
        <Row label="Statistike">
          {hero.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <TI placeholder="Broj/tekst" value={s.num} set={v => { const st = [...hero.stats]; st[i] = { ...st[i], num: v }; setHero({ ...hero, stats: st }); }} />
              <TI placeholder="Labela" value={s.label} set={v => { const st = [...hero.stats]; st[i] = { ...st[i], label: v }; setHero({ ...hero, stats: st }); }} />
            </div>
          ))}
        </Row>
        <Row label="CTA dugme">
          <div style={{ display: "flex", gap: 8 }}>
            <TI placeholder="Tekst" value={hero.ctaLabel} set={v => setHero({ ...hero, ctaLabel: v })} />
            <TI placeholder="URL" value={hero.ctaHref} set={v => setHero({ ...hero, ctaHref: v })} />
          </div>
        </Row>
        <Btn onClick={() => save("pomoc_hero", hero)} saving={saving} />
      </Sec>

      {/* STEPS */}
      <Sec title="Koraci — 4 pitanja" saved={saved === "pomoc_steps"}>
        {steps.map((step, i) => (
          <div key={step.num} style={{ padding: "18px 20px", border: "1px solid #E2E8ED", borderRadius: 12, marginBottom: 14, background: "#F8FAFB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, background: "#0F766E", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{step.num}</div>
              <strong style={{ fontSize: 14, color: "#0B1D33" }}>Korak {step.num}</strong>
            </div>
            <Row label="Pitanje (naslov)">
              <TI value={step.title} set={v => { const ns = [...steps]; ns[i] = { ...ns[i], title: v }; setSteps(ns); }} />
            </Row>
            <Row label="Opis">
              <TA value={step.desc} set={v => { const ns = [...steps]; ns[i] = { ...ns[i], desc: v }; setSteps(ns); }} rows={2} />
            </Row>
            {/* Chips */}
            <Row label="Chip linkovi (opciono)">
              {step.chips.map((chip, ci) => (
                <div key={ci} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <TI placeholder="Naziv" value={chip.label} set={v => { const ns = [...steps]; ns[i].chips[ci] = { ...ns[i].chips[ci], label: v }; setSteps(ns); }} />
                  <TI placeholder="URL (/rjesenja/...)" value={chip.href} set={v => { const ns = [...steps]; ns[i].chips[ci] = { ...ns[i].chips[ci], href: v }; setSteps(ns); }} />
                  <button onClick={() => { const ns = [...steps]; ns[i].chips = ns[i].chips.filter((_, idx) => idx !== ci); setSteps(ns); }}
                    style={{ padding: "8px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 }}>✕</button>
                </div>
              ))}
              <button onClick={() => { const ns = [...steps]; ns[i].chips = [...(ns[i].chips || []), { label: "", href: "" }]; setSteps(ns); }}
                style={{ padding: "6px 14px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif", marginTop: 4 }}>
                + Dodaj chip
              </button>
            </Row>
          </div>
        ))}
        <Btn onClick={() => save("pomoc_steps", steps)} saving={saving} />
      </Sec>

      {/* HELP */}
      <Sec title="Blok 'Još uvijek niste sigurni?'" saved={saved === "pomoc_help"}>
        <Row label="Badge"><TI value={help.badge} set={v => setHelp({ ...help, badge: v })} /></Row>
        <Row label="Naslov"><TI value={help.h2} set={v => setHelp({ ...help, h2: v })} /></Row>
        <Row label="Tekst"><TA value={help.p} set={v => setHelp({ ...help, p: v })} rows={3} /></Row>
        <Row label="Dugme 1">
          <div style={{ display: "flex", gap: 8 }}>
            <TI placeholder="Tekst" value={help.btn1Label} set={v => setHelp({ ...help, btn1Label: v })} />
            <TI placeholder="URL" value={help.btn1Href} set={v => setHelp({ ...help, btn1Href: v })} />
          </div>
        </Row>
        <Row label="Dugme 2 (ghost)">
          <div style={{ display: "flex", gap: 8 }}>
            <TI placeholder="Tekst" value={help.btn2Label} set={v => setHelp({ ...help, btn2Label: v })} />
            <TI placeholder="URL" value={help.btn2Href} set={v => setHelp({ ...help, btn2Href: v })} />
          </div>
        </Row>
        <Btn onClick={() => save("pomoc_help", help)} saving={saving} />
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
function Btn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return <button onClick={onClick} disabled={saving} style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>{saving ? "Čuvanje..." : "Sačuvaj sekciju"}</button>;
}
