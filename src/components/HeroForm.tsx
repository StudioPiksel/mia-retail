"use client";
import { useState } from "react";

export default function HeroForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", objectType: "", area: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          subject: `Brza konsultacija — ${form.objectType || "Upit"}`,
          message: `Tip objekta: ${form.objectType || "—"}\nPovršina: ${form.area || "—"}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="hero-form-card" style={{ textAlign: "center", padding: "40px 28px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", marginBottom: 10 }}>Upit je poslan!</h3>
        <p style={{ color: "#6B7B8A", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Javićemo vam se u roku od 24 sata na email adresu koju ste naveli.
        </p>
        <button onClick={() => { setStatus("idle"); setForm({ name: "", company: "", email: "", objectType: "", area: "" }); }}
          style={{ padding: "10px 22px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
          Pošalji novi upit
        </button>
      </div>
    );
  }

  return (
    <div className="hero-form-card">
      <div className="form-header">
        <span className="form-badge">Besplatna procjena</span>
        <h3>Brza konsultacija</h3>
        <p>Opišite projekat — javljamo se za 24h</p>
      </div>
      <form className="hero-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ime i prezime</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Naziv firme</label>
          <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Email adresa</label>
          <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Tip objekta</label>
          <select value={form.objectType} onChange={e => setForm({ ...form, objectType: e.target.value })}>
            <option value="">Izaberite...</option>
            <option value="Supermarket / Maloprodaja">Supermarket / Maloprodaja</option>
            <option value="Mesnica / Ribarnica">Mesnica / Ribarnica</option>
            <option value="HoReCa / Ugostiteljstvo">HoReCa / Ugostiteljstvo</option>
            <option value="Pekara / Poslastičarnica">Pekara / Poslastičarnica</option>
            <option value="Apoteka / Drogerija">Apoteka / Drogerija</option>
            <option value="Ostalo">Ostalo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Površina objekta (m²)</label>
          <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
            <option value="">Izaberite...</option>
            <option value="Do 200 m²">Do 200 m²</option>
            <option value="200 — 500 m²">200 — 500 m²</option>
            <option value="500 — 1.500 m²">500 — 1.500 m²</option>
            <option value="1.500 m² +">1.500 m² +</option>
          </select>
        </div>

        {status === "error" && (
          <p style={{ color: "#DC2626", fontSize: 12, margin: "4px 0", textAlign: "center" }}>
            Greška — pokušajte ponovo ili nas nazovite.
          </p>
        )}

        <button type="submit" className="btn-primary btn-full" disabled={status === "sending"}>
          {status === "sending" ? "Slanje..." : "Pošaljite upit"}
        </button>
        <p className="form-note">Bez obaveze · Besplatna procjena · Odgovor za 24h</p>
      </form>
    </div>
  );
}
