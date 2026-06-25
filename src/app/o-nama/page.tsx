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
        <section className="about-process">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Kako radimo</span>
              <h2>Od ideje do otvaranja u {process.length} koraka</h2>
              <p>Jasan i predvidiv proces u kojem znate šta se dešava u svakoj fazi.</p>
            </div>
            <div className="process-steps">
              {process.map((step) => (
                <div key={step.num} className="process-step">
                  <span className="process-num">{step.num}</span>
                  <div className="process-body">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
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
            <div className="about-partner-inner">
              <div className="about-partner-text">
                {partner.badge && <span className="section-badge">{partner.badge}</span>}
                <h2>{partner.h2}</h2>
                <p>{partner.p}</p>
                <Link href={partner.btnHref} className="btn-primary">
                  {partner.btnLabel}{" "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
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
