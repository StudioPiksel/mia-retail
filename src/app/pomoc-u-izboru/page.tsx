export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pomoć u izboru | MIA Retail Solutions",
  description: "Provedemo vas kroz 4 pitanja do prave opreme za vaš objekat. Besplatno, bez obaveze.",
};

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const s = await prisma.settings.findUnique({ where: { key } });
  if (!s) return fallback;
  try { return JSON.parse(s.value) as T; } catch { return fallback; }
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default async function PomocUizboruPage() {
  const [hero, steps, help] = await Promise.all([
    getSetting("pomoc_hero", {
      eyebrow: "Pomoć u izboru", h1: "Ne znate odakle da", h1Highlight: "krenete?",
      lead: "", heroBg: "/assets/images/megamenu/supermarketi.jpg",
      stats: [] as { num: string; label: string }[],
      ctaLabel: "Zatražite konsultaciju", ctaHref: "/kontakt",
    }),
    getSetting("pomoc_steps", [] as { num: string; title: string; desc: string; chips: { label: string; href: string }[] }[]),
    getSetting("pomoc_help", {
      badge: "", h2: "", p: "",
      btn1Label: "Zatražite konsultaciju", btn1Href: "/kontakt",
      btn2Label: "Pogledajte realizacije", btn2Href: "/realizacije",
    }),
  ]);

  return (
    <SiteLayout currentPage="/pomoc-u-izboru" extraCss={["/rjesenja.css"]}>
      {/* ── HERO ── */}
      <section className="solution-hero solution-hero--photo">
        <div className="solution-hero-bg" style={{ backgroundImage: `url('${hero.heroBg}')` }} />
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb" aria-label="Putanja">
                <Link href="/">Početna</Link> <span>/</span>{" "}
                <span className="breadcrumb-current">Pomoć u izboru</span>
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
                <Link href={hero.ctaHref} className="btn-primary">
                  {hero.ctaLabel} <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POMOC STEPS ── */}
      {steps.length > 0 && (
        <section className="pomoc-section">
          <div className="container">
            <div className="section-header section-header--left">
              <span className="section-badge">Vodič kroz {steps.length} pitanja</span>
              <h2>Pravu opremu biramo zajedno</h2>
              <p>Odgovorom na ova {steps.length} pitanja brzo sužavamo izbor na rješenje koje odgovara baš vašem objektu.</p>
            </div>

            <div className="pomoc-steps">
              {steps.map((step) => (
                <div key={step.num} className="pomoc-step">
                  <span className="pomoc-step-num">{step.num}</span>
                  <div className="pomoc-step-body">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                    {step.chips && step.chips.length > 0 && (
                      <div className="pomoc-chips">
                        {step.chips.map((chip) => (
                          <Link key={chip.href} href={chip.href} className="pomoc-chip">
                            {chip.label} <ArrowIcon />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── POMOC HELP ── */}
      {help.h2 && (
        <section className="pomoc-help">
          <div className="container">
            <div className="pomoc-help-inner">
              <div className="pomoc-help-text">
                {help.badge && <span className="section-badge">{help.badge}</span>}
                <h2>{help.h2}</h2>
                <p>{help.p}</p>
                <div className="pomoc-help-cta">
                  <Link href={help.btn1Href} className="btn-primary">
                    {help.btn1Label} <ArrowIcon />
                  </Link>
                  <Link href={help.btn2Href} className="btn-ghost btn-ghost--dark">
                    {help.btn2Label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
