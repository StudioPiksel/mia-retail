import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama | MIA Retail Solutions",
  description: "MIA Retail Solutions — vaš partner za opremanje maloprodajnih i HoReCa objekata na ključ.",
};

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const s = await prisma.settings.findUnique({ where: { key } });
  if (!s) return fallback;
  try { return JSON.parse(s.value) as T; } catch { return fallback; }
}

export default async function ONamaPage() {
  const [hero, intro, values, process, partner, cta] = await Promise.all([
    getSetting("onama_hero", {
      eyebrow: "O nama", h1: "Vaš partner za opremanje", h1Highlight: "na ključ",
      lead: "", heroBg: "/assets/images/megamenu/supermarketi.jpg",
      stats: [] as { num: string; label: string }[],
    }),
    getSetting("onama_intro", { badge: "Ko smo", h2: "", p1: "", p2: "", image: "", btnLabel: "Pogledajte realizacije", btnHref: "/realizacije" }),
    getSetting("onama_values", [] as { title: string; desc: string }[]),
    getSetting("onama_process", [] as { num: string; title: string; desc: string }[]),
    getSetting("onama_partner", { badge: "", h2: "", p: "", btnLabel: "", btnHref: "/dizajn-enterijera" }),
    getSetting("onama_cta", { h2: "", p: "" }),
  ]);

  return (
    <SiteLayout currentPage="/o-nama" extraCss={["/rjesenja.css"]}>
      {/* ── HERO ── */}
      <section className="solution-hero solution-hero--photo">
        <div className="solution-hero-bg" style={{ backgroundImage: `url('${hero.heroBg}')` }} />
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb" aria-label="Putanja">
                <Link href="/">Početna</Link> <span>/</span>{" "}
                <span className="breadcrumb-current">O nama</span>
              </nav>
              <span className="solution-hero-eyebrow">{hero.eyebrow}</span>
              <h1>{hero.h1} <span className="highlight">{hero.h1Highlight}</span></h1>
              <p className="solution-hero-lead">{hero.lead}</p>
              <div className="solution-hero-stats">
                {hero.stats.map((s) => (
                  <div key={s.label} className="stat-item">
                    <span className="stat-num">{s.num}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="solution-hero-cta">
                <Link href="/kontakt" className="btn-primary">
                  Zatražite ponudu{" "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT INTRO ── */}
      <section className="about-intro">
        <div className="container">
          <div className="about-intro-grid">
            <div className="about-intro-text">
              <span className="section-badge">{intro.badge}</span>
              <h2>{intro.h2}</h2>
              {intro.p1 && <p>{intro.p1}</p>}
              {intro.p2 && <p>{intro.p2}</p>}
              <Link href={intro.btnHref} className="btn-ghost btn-ghost--dark">
                {intro.btnLabel}{" "}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
            <div className="about-intro-media">
              {intro.image && <img src={intro.image} alt="MIA Retail Solutions realizacija" decoding="async" loading="lazy" />}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      {values.length > 0 && (
        <section className="about-values">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Naše vrijednosti</span>
              <h2>Na čemu gradimo svaki projekat</h2>
            </div>
            <div className="values-grid">
              {values.map((v) => (
                <div key={v.title} className="value-card">
                  <div className="value-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ── */}
      {process.length > 0 && (
        <section style={{ padding: "72px 0", background: "#fff" }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 48 }}>
              <span className="section-badge">Kako radimo</span>
              <h2>Od ideje do otvaranja u {process.length} koraka</h2>
              <p>Jasan i predvidiv proces u kojem znate šta se dešava u svakoj fazi.</p>
            </div>

            {/* Clean grid — bez CSS konflikata */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${process.length}, 1fr)`,
              gap: 0,
              position: "relative",
            }}>
              {/* Connector line */}
              <div style={{
                position: "absolute", top: 22, left: "calc(10% + 4px)", right: "calc(10% + 4px)",
                height: 2, background: "linear-gradient(90deg, #C7F1E6 0%, #0F766E 50%, #C7F1E6 100%)",
                zIndex: 0,
              }} />

              {process.map((step, i) => (
                <div key={step.num} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "0 16px", position: "relative", zIndex: 1,
                }}>
                  {/* Number badge */}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: i === 0 || i === process.length - 1 ? "#0F766E" : "#fff",
                    border: "2px solid #0F766E",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14,
                    color: i === 0 || i === process.length - 1 ? "#fff" : "#0F766E",
                    marginBottom: 20, flexShrink: 0,
                    boxShadow: "0 0 0 4px #fff",
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0B1D33", margin: "0 0 8px", lineHeight: 1.3 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PARTNER ── */}
      {partner.h2 && (
        <section className="about-partner">
          <div className="container">
            <div className="about-partner-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, alignItems: "stretch", minHeight: 340 }}>
              {/* Tekst lijevo */}
              <div className="about-partner-text" style={{ maxWidth: "100%", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {partner.badge && <span className="section-badge">{partner.badge}</span>}
                <h2>{partner.h2}</h2>
                <p>{partner.p}</p>
                <Link href={partner.btnHref} className="btn-primary" style={{ alignSelf: "flex-start" }}>
                  {partner.btnLabel}{" "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Slika desno sa overlay efektom */}
              <div style={{ position: "relative", overflow: "hidden", borderRadius: "0 22px 22px 0" }}>
                <img
                  src="/assets/images/design/dzyuba/Foxi_supermarket.webp"
                  alt="Dizajn enterijera"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Gradient overlay — lijevo da se stopi sa navy */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg, #0B1D33 0%, rgba(11,29,51,0.3) 50%, transparent 100%)",
                }} />
                {/* Teal glow u desnom uglu */}
                <div style={{
                  position: "absolute", right: -40, bottom: -40,
                  width: 200, height: 200, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(15,118,110,0.4), transparent 70%)",
                  pointerEvents: "none",
                }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="solution-cta">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band-text">
              <h2>{cta.h2}</h2>
              <p>{cta.p}</p>
            </div>
            <Link href="/kontakt" className="btn-primary btn-lg">
              Zatražite ponudu{" "}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
