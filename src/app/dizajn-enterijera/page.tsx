import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Dizajn enterijera | MIA Retail Solutions",
  description: "Dizajn enterijera za retail i HoReCa — od ideje do realizacije. 2 partnerska studija, 21 idejni koncept.",
};

const DZYUBA = [
  { src: "/assets/images/design/dzyuba/Foxi_supermarket.webp", caption: "Foxi supermarket" },
  { src: "/assets/images/design/dzyuba/Vinoteca.webp", caption: "Vinoteca" },
  { src: "/assets/images/design/dzyuba/Magnum_Ukraine.webp", caption: "Magnum · Ukrajina" },
  { src: "/assets/images/design/dzyuba/Agrohub_Tbilisi.webp", caption: "Agrohub · Tbilisi" },
  { src: "/assets/images/design/dzyuba/Galmart_Uzbekistan.webp", caption: "Galmart · Uzbekistan" },
  { src: "/assets/images/design/dzyuba/Selecto.webp", caption: "Selecto" },
  { src: "/assets/images/design/dzyuba/Smako_market.webp", caption: "Smako market" },
  { src: "/assets/images/design/dzyuba/Ultramarket.webp", caption: "Ultramarket" },
  { src: "/assets/images/design/dzyuba/Agrohub_Kutaisi.webp", caption: "Agrohub · Kutaisi" },
  { src: "/assets/images/design/dzyuba/Maesto_Moldova.webp", caption: "Maesto · Moldavija" },
  { src: "/assets/images/design/dzyuba/Foxi_cafe_market.webp", caption: "Foxi cafe & market" },
  { src: "/assets/images/design/dzyuba/Medik8_pharmacy_Ukraine.webp", caption: "Medik 8 · apoteka" },
  { src: "/assets/images/design/dzyuba/fruits_vegs.webp", caption: "Fruits & vegetables" },
];

const WITT = [
  { src: "/assets/images/design/witt/Aroma_marketi.jpg", caption: "Aroma marketi" },
  { src: "/assets/images/design/witt/Aroma_marketi_2.jpg", caption: "Aroma marketi" },
  { src: "/assets/images/design/witt/Aroma_marketi_4.jpg", caption: "Aroma marketi" },
  { src: "/assets/images/design/witt/Mesara_Plana.jpg", caption: "Mesara Plana" },
  { src: "/assets/images/design/witt/Mesara_Plana_2.jpg", caption: "Mesara Plana" },
  { src: "/assets/images/design/witt/Kafe_Soljica_projektovanje.jpg", caption: "Kafe Šoljica" },
  { src: "/assets/images/design/witt/Restoran_Vojvode_Stepe.jpg", caption: "Restoran Vojvode Stepe" },
  { src: "/assets/images/design/witt/Restoran_Flamingo.jpg", caption: "Restoran Flamingo" },
];

const StudioGrid = ({ items }: { items: { src: string; caption: string }[] }) => (
  <div className="studio-grid">
    {items.map((item, i) => (
      <div key={i} className="studio-item" data-caption={item.caption}>
        <img src={item.src} alt={item.caption} loading="lazy" decoding="async" />
        <span className="studio-item-zoom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <div className="studio-item-overlay"><span>{item.caption}</span></div>
      </div>
    ))}
  </div>
);

export default function DizajnEnterijera() {
  return (
    <SiteLayout currentPage="/dizajn-enterijera">
      {/* HERO */}
      <section className="reference-hero" style={{ minHeight: 400 }}>
        <div className="reference-hero-bg" style={{ backgroundImage: "url('/assets/images/design/dzyuba/Foxi_supermarket.webp')" }}></div>
        <div className="reference-hero-overlay"></div>
        <div className="container">
          <div className="reference-hero-content">
            <nav className="breadcrumb" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Početna</Link>
              <span className="sep"> / </span>
              <span style={{ color: "#fff" }}>Dizajn enterijera</span>
            </nav>
            <span className="hero-eyebrow">PROJEKTOVANJE I DIZAJN</span>
            <h1>Dizajn enterijera za <span className="highlight">retail i HoReCa</span></h1>
            <p className="hero-desc">Od ideje do realizacije — 2 partnerska studija, 21 idejni koncept za supermarkete, markete, apoteke i ugostiteljske objekte.</p>
            <div className="reference-stats">
              <div className="stat-item"><span className="stat-number">2</span><span className="stat-label">Partnerska studija</span></div>
              <div className="stat-item"><span className="stat-number">21</span><span className="stat-label">Idejnih koncepata</span></div>
              <div className="stat-item"><span className="stat-number">Na ključ</span><span className="stat-label">Od ideje do otvaranja</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="design-section" id="dizajn" style={{ paddingTop: 80 }}>
        <div className="container">
          <div className="design-intro">
            <span className="section-eyebrow">Naš pristup</span>
            <h2>Jedan partner za <span className="highlight">dizajn, projektovanje i opremanje</span></h2>
            <p className="lead">Od početne ideje do finalne realizacije kreiramo prostore koji prodaju — spajajući estetiku, funkcionalnost i provjerenu opremu.</p>
            <div className="design-services">
              {[
                "Razvoj novih koncepata i dizajnerskih rješenja enterijera",
                "Adaptacija postojećih koncepata za različita tržišta i formate",
                "Optimizacija i unapređenje postojećih prodajnih prostora",
                "Kompletna koordinacija od koncepta do implementacije na ključ",
              ].map((s) => (
                <div key={s} className="service-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STUDIO 1 */}
          <div className="studio-block">
            <div className="studio-head">
              <div className="studio-head-left">
                <span className="studio-badge">DZ</span>
                <div>
                  <h3>DZYUBA DESIGN</h3>
                  <span className="studio-tag">Internacionalni retail design studio · supermarketi, marketi i apoteke širom Evrope i Azije</span>
                </div>
              </div>
              <span className="studio-count">13 projekata</span>
            </div>
            <StudioGrid items={DZYUBA} />
          </div>

          {/* STUDIO 2 */}
          <div className="studio-block">
            <div className="studio-head">
              <div className="studio-head-left">
                <span className="studio-badge">WD</span>
                <div>
                  <h3>WITT DESIGN</h3>
                  <span className="studio-tag">Projektovanje enterijera za markete, mesnice i ugostiteljske objekte u regionu</span>
                </div>
              </div>
              <span className="studio-count">8 projekata</span>
            </div>
            <StudioGrid items={WITT} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Razgovarajmo o dizajnu vašeg prostora</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Besplatna konsultacija za sve projekte enterijera retail i HoReCa prostora.
          </p>
          <Link href="/kontakt" className="btn-primary">Zatražite konsultaciju →</Link>
        </div>
      </section>

      <Script src="/design.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
