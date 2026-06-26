"use client";
import { useEffect, useState } from "react";

type Settings = Record<string, string>;

const fields = [
  { section: "Utility bar (gornja traka)", items: [
    { key: "utility_phone", label: "Telefon" },
    { key: "utility_email", label: "Email" },
    { key: "utility_location", label: "Lokacija" },
    { key: "utility_hours", label: "Radno vrijeme" },
  ]},
  { section: "Logo & Brend", items: [
    { key: "site_name", label: "Naziv sajta" },
    { key: "logo_url", label: "Logo URL" },
  ]},
  { section: "Footer", items: [
    { key: "footer_tagline", label: "Footer tagline" },
    { key: "footer_address", label: "Adresa" },
  ]},
  { section: "WhatsApp dugme (donje desno)", items: [
    { key: "whatsapp_number", label: "WhatsApp broj (npr. +38267038777)" },
    { key: "whatsapp_message", label: "Poruka koja se šalje pri kliku" },
  ]},
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setMsg("Sačuvano!");
    setSaving(false);
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", marginBottom: 8 }}>Generalne postavke</h1>
      <p style={{ color: "#6B7B8A", fontSize: 14, marginBottom: 28 }}>Podešavanja utility bara, footera i brend informacija.</p>

      <form onSubmit={handleSave}>
        {fields.map(section => (
          <div key={section.section} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24, marginBottom: 20 }}>
            <strong style={{ fontSize: 15, color: "#0B1D33", display: "block", marginBottom: 20 }}>
              {section.section}
            </strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {section.items.map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    value={settings[field.key] ?? ""}
                    onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8,
                      fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none",
                      boxSizing: "border-box", color: "#111827"
                    }}
                  />
                  {field.key === "logo_url" && settings.logo_url && (
                    <div style={{ marginTop: 10, padding: 12, background: "#0B1D33", borderRadius: 8, display: "inline-block" }}>
                      <img src={settings.logo_url} alt="Logo preview" style={{ height: 32 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="submit" disabled={saving} style={{
            padding: "12px 28px", background: "#0F766E", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Satoshi', sans-serif"
          }}>
            {saving ? "Čuvanje..." : "Sačuvaj postavke"}
          </button>
          {msg && <span style={{ color: "#16A34A", fontWeight: 500, fontSize: 14 }}>✓ {msg}</span>}
        </div>
      </form>
    </div>
  );
}
