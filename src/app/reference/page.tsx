import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Reference | MIA Retail Solutions",
  description: "Naša rješenja u vodećim svjetskim trgovinama. 37+ realizacija u 15+ zemalja.",
};

const BRANDS = [
  { img: "WinCo_Foods_US.jpg", name: "WinCo Foods", country: "SAD", cats: "supermarketi police" },
  { img: "Carrefour_France.jpg", name: "Carrefour", country: "Francuska", cats: "supermarketi police" },
  { img: "Conad_Italy.jpg", name: "Conad", country: "Italija", cats: "supermarketi police" },
  { img: "EDEKA_Germany.jpg", name: "EDEKA", country: "Njemačka", cats: "supermarketi police" },
  { img: "Globus_Pilsen.jpg", name: "Globus", country: "Češka", cats: "supermarketi police" },
  { img: "IGA_Drummoyne.jpg", name: "IGA Drummoyne", country: "Australija", cats: "supermarketi police" },
  { img: "ICA_Supermarket_Pelikan.jpg", name: "ICA Supermarket", country: "Švedska", cats: "supermarketi police" },
  { img: "ASDA_England.jpg", name: "ASDA", country: "Engleska", cats: "supermarketi police" },
  { img: "Tesco.jpg", name: "Tesco", country: "UK", cats: "supermarketi police" },
  { img: "Sephora.jpg", name: "Sephora", country: "Francuska", cats: "horeca police" },
  { img: "PoppyBudapest.jpg", name: "Poppy Store", country: "Mađarska", cats: "supermarketi police" },
  { img: "LeclercFrance.jpg", name: "Leclerc", country: "Francuska", cats: "supermarketi police korpe" },
  { img: "AromaCG.jpg", name: "Aroma marketi", country: "Crna Gora", cats: "supermarketi police" },
  { img: "MesaraPlana.jpg", name: "Mesara Plana", country: "Srbija", cats: "horeca" },
  { img: "KafeSoljica.jpg", name: "Kafe Šoljica", country: "Crna Gora", cats: "horeca" },
];

export default function ReferencePage() {
  return (
    <SiteLayout currentPage="/reference" extraCss={["/reference.css"]}>
      {/* HERO */}
      <section className="reference-hero">
        <div className="reference-hero-bg" style={{ backgroundImage: "url('/assets/images/realizacije/EDEKAGermany2.jpg')" }}></div>
        <div className="reference-hero-overlay"></div>
        <div className="container">
          <div className="reference-hero-content">
            <nav className="breadcrumb" aria-label="Putanja" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Početna</Link>
              <span className="sep"> / </span>
              <span style={{ color: "#fff" }}>Reference</span>
            </nav>
            <span className="hero-eyebrow">REFERENCE</span>
            <h1>Naša rješenja u vodećim <span className="highlight">svjetskim trgovinama</span></h1>
            <p className="hero-desc">Oprema koju nudimo ugrađena je u objekte vodećih svjetskih maloprodajnih lanaca. Pogledajte realizacije naših provjerenih partnera — grupisane po brendu i tipu objekta.</p>
            <div className="reference-stats">
              <div className="stat-item"><span className="stat-number">37+</span><span className="stat-label">Realizacija</span></div>
              <div className="stat-item"><span className="stat-number">15+</span><span className="stat-label">Zemalja</span></div>
              <div className="stat-item"><span className="stat-number">Top</span><span className="stat-label">Svjetski brendovi</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="reference-gallery-section">
        <div className="container">
          <div className="gallery-filters">
            <button className="filter-btn active" data-filter="all">Sve realizacije</button>
            <button className="filter-btn" data-filter="supermarketi">Supermarketi</button>
            <button className="filter-btn" data-filter="police">Police i opremanje</button>
            <button className="filter-btn" data-filter="korpe">Korpe i kolica</button>
            <button className="filter-btn" data-filter="horeca">HoReCa & specijalizovano</button>
          </div>

          <div className="brand-grid">
            {BRANDS.map((brand, i) => (
              <article key={i} className={`brand-card ${brand.cats}`} data-brand-index={i} tabIndex={0}>
                <div className="brand-card-media">
                  <img src={`/assets/images/reference/${brand.img}`} alt={`${brand.name} — ${brand.country}`} loading="lazy" decoding="async" />
                  <span className="card-zoom" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </span>
                </div>
                <div className="brand-card-body">
                  <h3 className="brand-card-name">{brand.name}</h3>
                  <span className="brand-card-country">{brand.country}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Vaš objekat, sljedeći na listi?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Kontaktirajte nas i razgovarajmo o vašem projektu.
          </p>
          <Link href="/kontakt" className="btn-primary">Zatražite besplatnu procjenu →</Link>
        </div>
      </section>

      <Script src="/reference.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
