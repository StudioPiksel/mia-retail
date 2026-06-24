"use client";
import { useEffect, useState } from "react";

type User = { id: string; email: string; name: string; role: string; createdAt: string; };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "admin" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ email: "", name: "", password: "", role: "admin" });
    setMsg("Korisnik dodan!");
    await load();
    setSaving(false);
    setTimeout(() => setMsg(""), 2000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Obrisati korisnika?")) return;
    await fetch("/api/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", marginBottom: 8 }}>Korisnici</h1>
      <p style={{ color: "#6B7B8A", fontSize: 14, marginBottom: 28 }}>Upravljanje admin korisnicima.</p>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 24, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFB" }}>
              {["Ime", "Email", "Rola", "Dodan", "Akcija"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#6B7B8A", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderTop: "1px solid #F1F5F7" }}>
                <td style={{ padding: "14px 20px", fontWeight: 500, fontSize: 14, color: "#111827" }}>{user.name}</td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: "#6B7B8A" }}>{user.email}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ background: "#C7F1E6", color: "#0A5C56", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{user.role}</span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6B7B8A" }}>
                  {new Date(user.createdAt).toLocaleDateString("sr-Latn")}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button onClick={() => handleDelete(user.id)} style={{
                    background: "#FEF2F2", color: "#DC2626", border: "none",
                    padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500
                  }}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", padding: 24 }}>
        <strong style={{ fontSize: 15, color: "#0B1D33", display: "block", marginBottom: 20 }}>Dodaj novog korisnika</strong>
        <form onSubmit={handleAdd}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              { key: "name", label: "Ime i prezime", type: "text", ph: "Miroslav Jovanović" },
              { key: "email", label: "Email", type: "email", ph: "korisnik@miaretailsolutions.com" },
              { key: "password", label: "Lozinka", type: "password", ph: "••••••••" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.ph} required
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827" }} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Rola</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff" }}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button type="submit" disabled={saving} style={{
              padding: "11px 28px", background: "#0F766E", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Satoshi', sans-serif"
            }}>
              {saving ? "Dodavanje..." : "Dodaj korisnika"}
            </button>
            {msg && <span style={{ color: "#16A34A", fontWeight: 500, fontSize: 14 }}>✓ {msg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
