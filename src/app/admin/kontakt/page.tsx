"use client";
import { useEffect, useState } from "react";

type KontaktPage = {
  hero: { eyebrow: string; h1: string; h1Highlight: string; lead: string };
  info: { address: string; phone: string; email: string; hours: string };
  cta: { h2: string; p: string };
};

export default function KontaktAdmin() {
  const [page, setPage] = useState<KontaktPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setPage(JSON.parse(s.kontakt_page)); } catch {}
    });
  }, []);

  async function save(key: keyof KontaktPage, value: unknown) {
    if (!page) return;
    setSaving(true);
    const updated = { ...page, [key]: value };
    setPage(updated);
    await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kontakt_page: JSON.stringify(updated) }),
    });
    setSaving(false); setSaved(key);
    setTimeout(() => setSaved(""), 2000);
  }

  if (!page) return <div style={{ padding: 40, color: "#6B7B8A" }}>Učitavanje...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Kontakt stranica</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Upravljajte sadržajem /kontakt stranice.</p>
      </div>

      {/* Hero */}
      <Sec title="Hero sekcija" saved={saved === "hero"}>
        <Row label="Eyebrow"><TI value={page.hero.eyebrow} set={v => save("hero", { ...page.hero, eyebrow: v })} /></Row>
        <Row label="H1 naslov"><TI value={page.hero.h1} set={v => save("hero", { ...page.hero, h1: v })} /></Row>
        <Row label="H1 istaknuti (teal)"><TI value={page.hero.h1Highlight} set={v => save("hero", { ...page.hero, h1Highlight: v })} /></Row>
        <Row label="Lead tekst"><TA value={page.hero.lead} set={v => save("hero", { ...page.hero, lead: v })} /></Row>
      </Sec>

      {/* Contact info */}
      <Sec title="Kontakt informacije" saved={saved === "info"}>
        <Row label="Adresa (novi red = Enter)"><TA value={page.info.address} set={v => save("info", { ...page.info, address: v })} rows={2} /></Row>
        <Row label="Telefon"><TI value={page.info.phone} set={v => save("info", { ...page.info, phone: v })} /></Row>
        <Row label="Email"><TI value={page.info.email} set={v => save("info", { ...page.info, email: v })} /></Row>
        <Row label="Radno vrijeme"><TI value={page.info.hours} set={v => save("info", { ...page.info, hours: v })} /></Row>
      </Sec>

      {/* CTA/Form */}
      <Sec title="Forma — naslov" saved={saved === "cta"}>
        <Row label="Naslov forme"><TI value={page.cta.h2} set={v => save("cta", { ...page.cta, h2: v })} /></Row>
        <Row label="Podnaslov"><TI value={page.cta.p} set={v => save("cta", { ...page.cta, p: v })} /></Row>
      </Sec>

      {saving && <div style={{ fontSize: 13, color: "#6B7B8A", marginTop: 8 }}>Čuvanje...</div>}
    </div>
  );
}

function Sec({ title, children, saved }: { title: string; children: React.ReactNode; saved: boolean }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8ED", background: "#F8FAFB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: 14, color: "#0B1D33" }}>{title}</strong>
        {saved && <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano automatski</span>}
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>{label}</label>{children}</div>;
}
function TI({ value, set }: { value: string; set: (v: string) => void }) {
  return <input value={value} onChange={e => set(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827" }} />;
}
function TA({ value, set, rows = 3 }: { value: string; set: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => set(e.target.value)} rows={rows} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", resize: "vertical" }} />;
}
