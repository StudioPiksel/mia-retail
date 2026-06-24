"use client";
import { useEffect, useState } from "react";

type MenuItem = {
  id: string; label: string; url: string;
  type: string; subtitle?: string; thumbnail?: string; order: number;
};

const emptyForm = { label: "", url: "", type: "link", subtitle: "", thumbnail: "" };

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/menu");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: items.length + 1 }) });
    setForm(emptyForm);
    setMsg("Stavka dodana!");
    await load();
    setSaving(false);
    setTimeout(() => setMsg(""), 2000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Obrisati stavku?")) return;
    await fetch("/api/menu", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  const typeLabels: Record<string, string> = {
    link: "Link", "mega-rjesenja": "Mega — Rješenja", "mega-proizvodi": "Mega — Proizvodi"
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", marginBottom: 8 }}>Upravljanje menijem</h1>
      <p style={{ color: "#6B7B8A", fontSize: 14, marginBottom: 28 }}>Dodajte, uklonite i uredite stavke glavne navigacije.</p>

      {/* Current items */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 28, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8ED" }}>
          <strong style={{ fontSize: 15, color: "#0B1D33" }}>Trenutne stavke</strong>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFB" }}>
              {["Redoslijed", "Naziv", "URL", "Tip", "Akcija"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#6B7B8A", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #F1F5F7" }}>
                <td style={{ padding: "12px 20px", color: "#6B7B8A", fontSize: 14 }}>#{item.order}</td>
                <td style={{ padding: "12px 20px", fontWeight: 500, color: "#111827", fontSize: 14 }}>{item.label}</td>
                <td style={{ padding: "12px 20px", color: "#6B7B8A", fontSize: 13 }}>{item.url}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ background: "#C7F1E6", color: "#0A5C56", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    {typeLabels[item.type] ?? item.type}
                  </span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <button onClick={() => handleDelete(item.id)} style={{
                    background: "#FEF2F2", color: "#DC2626", border: "none", padding: "6px 14px",
                    borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500
                  }}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add form */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
        <strong style={{ fontSize: 15, color: "#0B1D33", display: "block", marginBottom: 20 }}>Dodaj novu stavku</strong>
        <form onSubmit={handleAdd}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Naziv stavke *</label>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                required placeholder="npr. Reference" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>URL *</label>
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                required placeholder="/reference" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tip</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="link">Obični link</option>
                <option value="mega-rjesenja">Mega meni — Rješenja</option>
                <option value="mega-proizvodi">Mega meni — Proizvodi</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Podnaslov (opcionalno)</label>
              <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Kratki opis" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button type="submit" disabled={saving} style={{
              padding: "11px 28px", background: "#0F766E", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Satoshi', sans-serif"
            }}>
              {saving ? "Čuvanje..." : "Dodaj stavku"}
            </button>
            {msg && <span style={{ color: "#16A34A", fontSize: 14, fontWeight: 500 }}>✓ {msg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8,
  fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none",
  boxSizing: "border-box", color: "#111827", background: "#fff"
};
