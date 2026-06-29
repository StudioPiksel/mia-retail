"use client";
import { useState } from "react";

export default function KontaktForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8,
    fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box",
    color: "#111827", background: "#fff",
  };

  if (status === "success") {
    return (
      <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 16, padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", marginBottom: 10 }}>Upit je poslan!</h3>
        <p style={{ color: "#6B7B8A", fontSize: 15, lineHeight: 1.6 }}>
          Hvala što ste nas kontaktirali. Naš tim će vam se javiti u roku od 24 sata.
        </p>
        <button onClick={() => setStatus("idle")} style={{ marginTop: 20, padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
          Pošaljite novi upit
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--gray-200)", padding: 40, boxShadow: "0 8px 32px rgba(11,29,51,0.08)" }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Pošaljite upit</h3>
      <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 28 }}>Odgovaramo u roku od 24 sata.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Ime i prezime *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inp} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Firma</label>
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inp} />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Email adresa *</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inp} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Telefon</label>
          <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inp} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Predmet upita</label>
          <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...inp, background: "#fff" }}>
            <option value="">Izaberite...</option>
            <option>Ponuda za opremanje objekta</option>
            <option>Konsultacije za projekat</option>
            <option>Servis i održavanje</option>
            <option>Informacije o proizvodima</option>
            <option>Ostalo</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Poruka</label>
          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5}
            placeholder="Opišite vaš projekat ili upit..."
            style={{ ...inp, resize: "vertical", width: "100%", boxSizing: "border-box" }} />
        </div>

        {status === "error" && (
          <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, color: "#DC2626", fontSize: 13 }}>
            Greška pri slanju. Pokušajte ponovo ili nas kontaktirajte direktno na info@miaretailsolutions.com
          </div>
        )}

        <button type="submit" disabled={status === "sending"} style={{
          padding: "13px", background: status === "sending" ? "#9CA3AF" : "#0F766E", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
          cursor: status === "sending" ? "not-allowed" : "pointer", fontFamily: "'Satoshi', sans-serif",
        }}>
          {status === "sending" ? "Slanje..." : "Pošaljite upit"}
        </button>
        <p style={{ fontSize: 12, color: "var(--gray-500)", textAlign: "center", margin: 0 }}>
          Bez obaveze · Odgovor za 24h · Besplatna procjena
        </p>
      </form>
    </div>
  );
}
