import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt | MIA Retail Solutions",
  description: "Kontaktirajte nas za besplatne konsultacije i ponudu opreme za vaš objekat.",
};

export default function KontaktPage() {
  return (
    <SiteLayout currentPage="/kontakt">
      <section className="solution-hero blog-index-hero">
        <div className="container">
          <div className="breadcrumb-container" style={{ border: "none", paddingBottom: 20, paddingTop: 0 }}>
            <nav className="breadcrumb" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Početna</Link>
              <span className="sep">/</span>
              <span className="current" style={{ color: "#fff" }}>Kontakt</span>
            </nav>
          </div>
          <div className="solution-hero-content">
            <span className="section-eyebrow" style={{ color: "var(--mint)", background: "rgba(255,255,255,0.1)" }}>Kontaktirajte nas</span>
            <h1>Razgovarajmo o<br /><em>vašem projektu</em></h1>
            <p className="hero-desc">Dostupni smo za sve upite — od prve konsultacije do isporuke i servisa.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            {/* Contact info */}
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--navy)", marginBottom: 32 }}>Kontakt informacije</h2>

              {[
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: "Adresa", value: "Cetinjski put bb\n81000 Podgorica, Crna Gora"
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6z"/></svg>,
                  label: "Telefon", value: "+382 67 038 777"
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                  label: "Email", value: "info@miaretailsolutions.com"
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: "Radno vrijeme", value: "Pon — Pet: 08:00 — 17:00"
                },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 28, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, background: "var(--mint)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--teal)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 16, color: "var(--navy)", whiteSpace: "pre-line" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--gray-200)", padding: 40, boxShadow: "0 8px 32px rgba(11,29,51,0.08)" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Pošaljite upit</h3>
              <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 28 }}>Odgovaramo u roku od 24 sata.</p>

              <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="form-group"><label htmlFor="cname">Ime i prezime</label><input type="text" id="cname" name="name" required /></div>
                  <div className="form-group"><label htmlFor="ccompany">Firma</label><input type="text" id="ccompany" name="company" /></div>
                </div>
                <div className="form-group"><label htmlFor="cemail">Email adresa *</label><input type="email" id="cemail" name="email" required /></div>
                <div className="form-group"><label htmlFor="cphone">Telefon</label><input type="tel" id="cphone" name="phone" /></div>
                <div className="form-group">
                  <label htmlFor="csubject">Predmet upita</label>
                  <select id="csubject" name="subject">
                    <option value="">Izaberite...</option>
                    <option>Ponuda za opremanje objekta</option>
                    <option>Konsultacije za projekat</option>
                    <option>Servis i održavanje</option>
                    <option>Informacije o proizvodima</option>
                    <option>Ostalo</option>
                  </select>
                </div>
                <div className="form-group"><label htmlFor="cmessage">Poruka</label><textarea id="cmessage" name="message" rows={5} placeholder="Opišite vaš projekat ili upit..." /></div>
                <button type="submit" className="btn-primary btn-full">Pošaljite upit</button>
                <p className="form-note">Bez obaveze · Odgovor za 24h · Besplatna procjena</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
