"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type Hero = { eyebrow: string; h1: string; h1Highlight: string; lead: string; heroBg: string; stats: { num: string; label: string }[] };
type Intro = { badge: string; h2: string; p1: string; p2: string; image: string; btnLabel: string; btnHref: string };
type Value = { title: string; desc: string };
type Step = { num: string; title: string; desc: string };
type Partner = { badge: string; h2: string; p: string; btnLabel: string; btnHref: string };
type Cta = { h2: string; p: string };

export default function ONamaAdmin() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [intro, setIntro] = useState<Intro | null>(null);
  const [values, setValues] = useState<Value[]>([]);
  const [process, setProcess] = useState<Step[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [cta, setCta] = useState<Cta | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setHero(JSON.parse(s.onama_hero)); } catch {}
      try { setIntro(JSON.parse(s.onama_intro)); } catch {}
      try { setValues(JSON.parse(s.onama_values)); } catch {}
      try { setProcess(JSON.parse(s.onama_process)); } catch {}
      try { setPartner(JSON.parse(s.onama_partner)); } catch {}
      try { setCta(JSON.parse(s.onama_cta)); } catch {}
    });
  }, []);

  async function saveSection(key: string, value: unknown) {
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

  if (!hero || !intro || !partner || !cta) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>O nama — Uređivač</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Sve izmjene se odmah vide na sajtu nakon snimanja.</p>
      </div>

      {/* HERO */}
      <Section title="Hero sekcija" saved={saved === "onama_hero"}>
        <Row label="Eyebrow tekst">
          <TInput value={hero.eyebrow} onChange={v => setHero({ ...hero, eyebrow: v })} />
        </Row>
        <Row label="H1 naslov">
          <TInput value={hero.h1} onChange={v => setHero({ ...hero, h1: v })} />
        </Row>
        <Row label="H1 istaknuti dio (teal)">
          <TInput value={hero.h1Highlight} onChange={v => setHero({ ...hero, h1Highlight: v })} />
        </Row>
        <Row label="Lead tekst">
          <TArea value={hero.lead} onChange={v => setHero({ ...hero, lead: v })} rows={3} />
        </Row>
        <Row label="Hero pozadinska slika (URL)">
          <ImageUpload value={hero.heroBg} onChange={v => setHero({ ...hero, heroBg: v })} maxWidthPx={1440} qualityWebp={0.85} />
        </Row>
        <Row label="Statistike">
          {hero.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <TInput placeholder="Broj (15+)" value={s.num} onChange={v => { const st = [...hero.stats]; st[i] = { ...st[i], num: v }; setHero({ ...hero, stats: st }); }} />
              <TInput placeholder="Labela" value={s.label} onChange={v => { const st = [...hero.stats]; st[i] = { ...st[i], label: v }; setHero({ ...hero, stats: st }); }} />
            </div>
          ))}
        </Row>
        <SaveBtn onClick={() => saveSection("onama_hero", hero)} saving={saving} />
      </Section>

      {/* INTRO */}
      <Section title="Ko smo (Uvodni tekst + slika)" saved={saved === "onama_intro"}>
        <Row label="Badge tekst"><TInput value={intro.badge} onChange={v => setIntro({ ...intro, badge: v })} /></Row>
        <Row label="Naslov (H2)"><TInput value={intro.h2} onChange={v => setIntro({ ...intro, h2: v })} /></Row>
        <Row label="Paragraf 1"><TArea value={intro.p1} onChange={v => setIntro({ ...intro, p1: v })} rows={3} /></Row>
        <Row label="Paragraf 2"><TArea value={intro.p2} onChange={v => setIntro({ ...intro, p2: v })} rows={3} /></Row>
        <Row label="Slika (URL)">
          <ImageUpload value={intro.image} onChange={v => setIntro({ ...intro, image: v })} maxWidthPx={900} qualityWebp={0.85} />
        </Row>
        <Row label="Dugme tekst"><TInput value={intro.btnLabel} onChange={v => setIntro({ ...intro, btnLabel: v })} /></Row>
        <Row label="Dugme URL"><TInput value={intro.btnHref} onChange={v => setIntro({ ...intro, btnHref: v })} /></Row>
        <SaveBtn onClick={() => saveSection("onama_intro", intro)} saving={saving} />
      </Section>

      {/* VALUES */}
      <Section title="Vrijednosti (4 kartice)" saved={saved === "onama_values"}>
        {values.map((v, i) => (
          <div key={i} style={{ padding: "16px", border: "1px solid #E2E8ED", borderRadius: 10, marginBottom: 12, background: "#F8FAFB" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F766E", marginBottom: 8 }}>Vrijednost {i + 1}</div>
            <Row label="Naslov"><TInput value={v.title} onChange={t => { const nv = [...values]; nv[i] = { ...nv[i], title: t }; setValues(nv); }} /></Row>
            <Row label="Opis"><TArea value={v.desc} onChange={t => { const nv = [...values]; nv[i] = { ...nv[i], desc: t }; setValues(nv); }} rows={2} /></Row>
          </div>
        ))}
        <SaveBtn onClick={() => saveSection("onama_values", values)} saving={saving} />
      </Section>

      {/* PROCESS */}
      <Section title="Proces (5 koraka)" saved={saved === "onama_process"}>
        {process.map((step, i) => (
          <div key={i} style={{ padding: "14px 16px", border: "1px solid #E2E8ED", borderRadius: 10, marginBottom: 10, background: "#F8FAFB", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, background: "#C7F1E6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#0F766E", flexShrink: 0, fontSize: 14 }}>{step.num}</div>
            <div style={{ flex: 1 }}>
              <Row label="Naslov koraka">
                <TInput value={step.title} onChange={t => { const ns = [...process]; ns[i] = { ...ns[i], title: t }; setProcess(ns); }} />
              </Row>
              <Row label="Opis">
                <TArea value={step.desc} onChange={t => { const ns = [...process]; ns[i] = { ...ns[i], desc: t }; setProcess(ns); }} rows={2} />
              </Row>
            </div>
          </div>
        ))}
        <SaveBtn onClick={() => saveSection("onama_process", process)} saving={saving} />
      </Section>

      {/* PARTNER */}
      <Section title="Partner sekcija (tamnI blok)" saved={saved === "onama_partner"}>
        <Row label="Badge"><TInput value={partner.badge} onChange={v => setPartner({ ...partner, badge: v })} /></Row>
        <Row label="Naslov"><TInput value={partner.h2} onChange={v => setPartner({ ...partner, h2: v })} /></Row>
        <Row label="Tekst"><TArea value={partner.p} onChange={v => setPartner({ ...partner, p: v })} rows={3} /></Row>
        <Row label="Dugme tekst"><TInput value={partner.btnLabel} onChange={v => setPartner({ ...partner, btnLabel: v })} /></Row>
        <Row label="Dugme URL"><TInput value={partner.btnHref} onChange={v => setPartner({ ...partner, btnHref: v })} /></Row>
        <SaveBtn onClick={() => saveSection("onama_partner", partner)} saving={saving} />
      </Section>

      {/* CTA */}
      <Section title="Završni CTA banner" saved={saved === "onama_cta"}>
        <Row label="Naslov"><TInput value={cta.h2} onChange={v => setCta({ ...cta, h2: v })} /></Row>
        <Row label="Opis"><TArea value={cta.p} onChange={v => setCta({ ...cta, p: v })} rows={2} /></Row>
        <SaveBtn onClick={() => saveSection("onama_cta", cta)} saving={saving} />
      </Section>
    </div>
  );
}

// ── Reusable sub-components ──────────────────────────────────────────────────

function Section({ title, children, saved }: { title: string; children: React.ReactNode; saved: boolean }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8ED", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFB" }}>
        <strong style={{ fontSize: 15, color: "#0B1D33" }}>{title}</strong>
        {saved && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function TInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" }} />
  );
}

function TArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block", resize: "vertical" }} />
  );
}

function SaveBtn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button onClick={onClick} disabled={saving}
      style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>
      {saving ? "Čuvanje..." : "Sačuvaj sekciju"}
    </button>
  );
}
