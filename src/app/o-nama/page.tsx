import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "O nama | MIA Retail Solutions",
  description: "15+ godina iskustva u opremanju maloprodajnih i HoReCa prostora. 200+ realizovanih projekata na 3 kontinenta.",
};

export default async function ONamaPage() {
  const settings = await prisma.settings.findMany();
  const s = Object.fromEntries(settings.map((x) => [x.key, x.value]));

  return (
    <SiteLayout currentPage="/o-nama">
      <section className="solution-hero blog-index-hero">
        <div className="container">
          <div className="breadcrumb-container" style={{ border: "none", paddingBottom: 20, paddingTop: 0 }}>
            <nav className="breadcrumb" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Početna</Link>
              <span className="sep">/</span>
              <span className="current" style={{ color: "#fff" }}>O nama</span>
            </nav>
          </div>
          <div className="solution-hero-content">
            <span className="section-eyebrow" style={{ color: "var(--mint)", background: "rgba(255,255,255,0.1)" }}>Ko smo mi</span>
            <h1>{s.site_name ?? "MIA Retail Solutions"}</h1>
            <p className="hero-desc">{s.footer_tagline ?? "Partner za opremanje maloprodajnih i HoReCa objekata na ključ."}</p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span className="section-eyebrow">Naša priča</span>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "var(--navy)", marginBottom: 20, lineHeight: 1.3 }}>
                15+ godina iskustva u <span className="highlight">opremanju prostora</span>
              </h2>
              <p style={{ color: "var(--gray-700)", lineHeight: 1.8, marginBottom: 16 }}>
                MIA Retail Solutions je specijalizovana kompanija za projektovanje, isporuku i montažu opreme za maloprodajne i HoReCa objekte. Osnivač ima više od 15 godina iskustva u radu sa vodećim svjetskim lancima.
              </p>
              <p style={{ color: "var(--gray-700)", lineHeight: 1.8, marginBottom: 16 }}>
                Radili smo sa Lidl, IKEA, Carrefour, SPAR i stotinama manjih objekata — od malih convenience radnji do hipermarketa od 5.000 m².
              </p>
              <p style={{ color: "var(--gray-700)", lineHeight: 1.8 }}>
                Naša prednost je jedan partner za cijeli projekat — od prve konsultacije i idejnog rješenja do isporuke, montaže i servisa.
              </p>
            </div>
            <div>
              <img src="/assets/images/projects/Aromamarketi2.jpg" alt="MIA Retail Solutions realizacija" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-number">200+</span><span className="stat-text">Realizovanih projekata<br />na 3 kontinenta</span></div>
            <div className="stat-item"><span className="stat-number">15+</span><span className="stat-text">Godina iskustva<br />u industriji</span></div>
            <div className="stat-item"><span className="stat-number">12+</span><span className="stat-text">Zemalja u kojima<br />smo radili</span></div>
            <div className="stat-item"><span className="stat-number">24h</span><span className="stat-text">Garancija odgovora<br />na svaki upit</span></div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values" id="values" style={{ paddingBottom: 80 }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Naše vrijednosti</span>
            <h2>Zašto klijenti <span className="highlight">biraju MIA</span></h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E6F7F3"/><path d="M24 14v20M14 24h20" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <h3>Jedan partner</h3>
              <p>Jedna firma, jedan voditelj projekta — od prve linije na papiru do dana otvaranja. Nema koordinacije između više izvođača.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E6F7F3"/><path d="M16 32l6-6 4 4 8-8" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3>Pouzdanost rokova</h3>
              <p>98% projekata završeno na dogovoreni datum. Naši klijenti znaju: kažemo rok, održavamo rok.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E6F7F3"/><circle cx="24" cy="24" r="10" stroke="#0F766E" strokeWidth="2"/><path d="M24 18v6l4 2" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <h3>Dugoročna podrška</h3>
              <p>Servisni tim dostupan 24/7, garantovan odgovor unutar 24h, rezervni dijelovi na lageru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Razgovarajmo o vašem projektu</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Besplatna konsultacija bez obaveze.
          </p>
          <Link href="/kontakt" className="btn-primary">Kontaktirajte nas →</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
