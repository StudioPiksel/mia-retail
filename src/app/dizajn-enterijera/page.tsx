import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Dizajn enterijera | MIA Retail Solutions",
  description: "Dizajn enterijera za retail i HoReCa — od ideje do realizacije. 2 partnerska studija, 21 idejni koncept.",
};

const SUPPLIERS = [
  { src: "/assets/images/partners/ITAB.jpg", name: "ITAB" },
  { src: "/assets/images/partners/HLLogotype100CMYKWhiteBlueBackground.jpg", name: "HL Display" },
  { src: "/assets/images/partners/Rabtrolley.png", name: "Rabtrolley" },
  { src: "/assets/images/partners/GOST.png", name: "Go-St" },
  { src: "/assets/images/partners/WISECOOLING.webp", name: "Wise Cooling" },
  { src: "/assets/images/partners/Plastimark.webp", name: "Plastimark" },
  { src: "/assets/images/partners/d&k-logo(1).png", name: "DK Technology" },
  { src: "/assets/images/partners/IdeamInox_PugliaInox_logo-1(1).png", name: "Ideam Inox" },
  { src: "/assets/images/partners/Promming.png", name: "Promming" },
  { src: "/assets/images/partners/damix_logo(2).jpg", name: "Damix" },
];

export default async function DizajnEnterijeraPage() {
  const studios = await prisma.designStudio.findMany({
    orderBy: { order: "asc" },
    include: {
      projects: { where: { published: true }, orderBy: { order: "asc" } },
    },
  });

  const totalProjects = studios.reduce((sum, s) => sum + s.projects.length, 0);

  return (
    <SiteLayout currentPage="/dizajn-enterijera">
      {/* ── HERO — isti stil kao realizacije (navy + teal glow) ── */}
      <section style={{
        position: "relative",
        background: "linear-gradient(120deg, #0B1D33 0%, #0d2237 100%)",
        color: "#fff",
        padding: "120px 0 72px",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -80, top: -80,
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,118,110,0.35), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 860 }}>
            <nav className="breadcrumb" style={{ marginBottom: 20 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Početna</Link>
              <span style={{ color: "rgba(255,255,255,0.45)", margin: "0 8px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.45)" }}>Dizajn enterijera</span>
            </nav>

            <span style={{
              display: "inline-block", padding: "6px 14px",
              background: "rgba(199,241,230,0.15)", border: "1px solid rgba(199,241,230,0.4)",
              color: "#C7F1E6", fontSize: 13, fontWeight: 600,
              borderRadius: 100, letterSpacing: "0.05em", marginBottom: 20,
            }}>PROJEKTOVANJE I DIZAJN</span>

            <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
              Dizajn enterijera za <span style={{ color: "#0F766E" }}>retail i HoReCa</span> — od ideje do realizacije
            </h1>

            <p style={{ fontSize: "1.075rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
              Uz isporuku i montažu opreme, kreiramo i kompletna dizajnerska rješenja prostora. Kroz saradnju sa renomiranim retail i HoReCa design studijima razvijamo funkcionalne i prepoznatljive enterijere — prilagođene identitetu brenda, budžetu i specifičnostima svakog projekta.
            </p>

            <div className="reference-stats">
              <div className="stat-item"><span className="stat-number">{studios.length}</span><span className="stat-label">Partnerska studija</span></div>
              <div className="stat-item"><span className="stat-number">{totalProjects}</span><span className="stat-label">Idejnih koncepata</span></div>
              <div className="stat-item"><span className="stat-number">Na ključ</span><span className="stat-label">Od ideje do otvaranja</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESIGN CONTENT ── */}
      <section className="design-section" id="dizajn" style={{ paddingTop: 80 }}>
        <div className="container">
          {/* Intro */}
          <div className="design-intro">
            <span className="section-eyebrow">Naš pristup</span>
            <h2>Jedan partner za <span className="highlight">dizajn, projektovanje i opremanje</span></h2>
            <p className="lead">
              Od početne ideje do finalne realizacije kreiramo prostore koji prodaju — spajajući estetiku, funkcionalnost i provjerenu opremu. Naš tim koordinira cijeli proces, tako da kroz jednog partnera dobijate idejni koncept, tehnički projekat i montažu na ključ.
            </p>
            <div className="design-services">
              {[
                "Razvoj novih koncepata i dizajnerskih rješenja enterijera",
                "Adaptacija postojećih koncepata za različita tržišta i formate",
                "Optimizacija i unapređenje postojećih prodajnih prostora",
                "Kompletna koordinacija od koncepta do implementacije na ključ",
              ].map(s => (
                <div key={s} className="service-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Studio blocks — dinamički iz DB */}
          {studios.map(studio => (
            <div key={studio.id} className="studio-block">
              <div className="studio-head">
                <div className="studio-head-left">
                  <span className="studio-badge">{studio.badge}</span>
                  <div>
                    <h3>{studio.name}</h3>
                    <span className="studio-tag">{studio.tag}</span>
                  </div>
                </div>
                <span className="studio-count">{studio.projects.length} projekata</span>
              </div>

              <div className="studio-grid">
                {studio.projects.map(p => (
                  <div key={p.id} className="studio-item" data-caption={p.caption}>
                    <img src={p.image} alt={p.caption} loading="lazy" decoding="async" />
                    <span className="studio-item-zoom">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                    <div className="studio-item-overlay"><span>{p.overlayLabel}</span></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUPPLIERS ── */}
      <section className="suppliers" id="suppliers">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Naši dobavljači</span>
            <h2>Biramo brendove kao <span className="highlight">i naše klijente</span></h2>
            <p className="section-desc">Radimo isključivo sa verifikovanim svjetskim proizvođačima — pouzdanost, servis, dugovječnost.</p>
          </div>
          <div className="suppliers-grid">
            {SUPPLIERS.map(s => (
              <div key={s.name} className="supplier-card">
                <img src={s.src} alt={s.name} loading="lazy" decoding="async" />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="design-cta">
            <h3>Planirate novi objekat ili redizajn postojećeg?</h3>
            <p>Spajamo dizajn enterijera, projektovanje i opremanje na ključ — jedan partner od ideje do otvaranja. Zatražite konsultaciju i idejni koncept za vaš prostor.</p>
            <Link href="/kontakt" className="btn-primary">
              Zatražite idejni koncept{" "}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Script src="/design.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
