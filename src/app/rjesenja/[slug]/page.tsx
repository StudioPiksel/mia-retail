import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";

const SLUGS = ["supermarketi", "mesnice-ribarnice", "horeca", "pekare", "apoteke-drogerije"];

async function getPageData(slug: string) {
  const keys = ["hero", "zones", "realizacije", "cta"].map(s => `rjesenja_${slug}_${s}`);
  const settings = await prisma.settings.findMany({ where: { key: { in: keys } } });
  const map = Object.fromEntries(settings.map(s => [s.key.replace(`rjesenja_${slug}_`, ""), s.value]));

  function parse<T>(key: string, fallback: T): T {
    try { return JSON.parse(map[key] ?? "null") ?? fallback; } catch { return fallback; }
  }

  return {
    hero: parse("hero", null as null | { eyebrow: string; h1: string; h1Highlight: string; lead: string; heroBg: string; stats: { num: string; label: string }[]; ghostLabel: string; ghostHref: string }),
    zones: parse("zones", null as null | { badge: string; h2: string; desc: string; items: { title: string; desc: string }[] }),
    realizacije: parse("realizacije", null as null | { items: { img: string; label: string }[] }),
    cta: parse("cta", null as null | { h2: string; p: string }),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) return {};
  const { hero } = await getPageData(slug);
  if (!hero) return {};
  return {
    title: `${hero.h1} ${hero.h1Highlight} | MIA Retail Solutions`,
    description: hero.lead,
  };
}

const CAT_DESCRIPTIONS: Record<string, Record<string, string>> = {
  "mesnice-ribarnice": { "rashladne-vitrine": "Izložbene i servisne vitrine sa preciznim temperaturnim režimom za meso i ribu.", "inox-kuhinja": "Radni stolovi, sudopere i oprema za pripremu od AISI 304/316 nerđajućeg čelika.", "frizideri-komore": "Komore i frižideri za čuvanje svježeg i smrznutog programa.", "policni-sistemi": "Cjenovne šine i polični elementi za uredan i čitljiv asortiman." },
  horeca: { "inox-kuhinja": "Termička oprema, rerne, radni stolovi i oprema za profesionalnu kuhinju.", "frizideri-komore": "Rashladne jedinice za šank, pripremnu zonu i skladište." },
  pekare: { "rashladne-vitrine": "Panoramske i rashladne vitrine za torte, kolače i pakovani pekarski program.", "inox-kuhinja": "Mješalice za tijesto, radni stolovi i prateća inox oprema.", "policni-sistemi": "Police i regali za hljeb i pakovani pekarski program.", "checkout-kase": "Kompaktni kasa pultovi sa impulsnom zonom za pekare." },
  "apoteke-drogerije": { "policni-sistemi": "Police sa cjenovnim šinama, ESL i rasvjetom za pregledan asortiman.", "checkout-kase": "Apotekarski pultovi sa radnom i kasa zonom.", "frizideri-komore": "Frižideri za temperaturno osjetljive lijekove i preparate.", "kolica-korpe": "Ručne korpe i mala kolica za drogerijski asortiman." },
};

export default async function RjesenjaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();

  const { hero, zones, realizacije, cta } = await getPageData(slug);
  if (!hero) notFound();

  const rjesenjaItems = await prisma.rjesenjaItem.findMany({
    where: { rjesenjaSlug: slug },
    include: { product: { include: { category: true } } },
    orderBy: { order: "asc" },
  });

  // Group by zone label (if set) OR by product category (fallback)
  const hasZones = rjesenjaItems.some(it => it.zoneLabel);

  const grouped = rjesenjaItems.reduce<Record<string, { catName: string; catSlug: string; desc: string; isZone: boolean; products: typeof rjesenjaItems[0]["product"][] }>>((acc, item) => {
    const key = hasZones && item.zoneLabel ? `zone:${item.zoneLabel}` : `cat:${item.product.categoryId}`;
    if (!acc[key]) {
      if (hasZones && item.zoneLabel) {
        acc[key] = { catName: item.zoneLabel, catSlug: item.product.category.slug, desc: "", isZone: true, products: [] };
      } else {
        const desc = (CAT_DESCRIPTIONS[slug] ?? {})[item.product.category.slug] ?? "";
        acc[key] = { catName: item.product.category.name, catSlug: item.product.category.slug, desc, isZone: false, products: [] };
      }
    }
    acc[key].products.push(item.product);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  return (
    <SiteLayout currentPage={`/rjesenja/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* ── HERO ── */}
      {hero && (
        <section className="solution-hero solution-hero--photo">
          <div className="solution-hero-bg" style={{ backgroundImage: `url('${hero.heroBg}')` }} />
          <div className="container">
            <div className="solution-hero-inner">
              <div className="solution-hero-text">
                <nav className="breadcrumb" aria-label="Putanja">
                  <Link href="/">Početna</Link> <span>/</span>{" "}
                  <Link href="#">Rješenja</Link> <span>/</span>{" "}
                  <span className="breadcrumb-current">{hero.h1} {hero.h1Highlight}</span>
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
                    Zatražite ponudu <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                  {hero.ghostLabel && (
                    <Link href={hero.ghostHref ?? "/realizacije"} className="btn-ghost">{hero.ghostLabel}</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ZONES ── */}
      {zones && (
        <section className="solution-zones">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">{zones.badge}</span>
              <h2>{zones.h2}</h2>
              {zones.desc && <p>{zones.desc}</p>}
            </div>
            <div className="zones-grid">
              {zones.items.map((z) => (
                <div key={z.title} className="zone-card">
                  <div className="zone-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="zone-text"><h3>{z.title}</h3><p>{z.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCT GROUPS ── */}
      {groups.length > 0 && (
        <section className="product-groups rjesenje-rows">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Preporučena oprema</span>
              <h2>Oprema za ovu industriju</h2>
              <p>Izbor proizvoda koje najčešće ugrađujemo u objekte ovog tipa.</p>
            </div>
            {groups.map((group) => (
              <div key={group.catSlug} className="product-group">
                <div className="product-group-head rjesenje-row-head">
                  <div className="rjesenje-row-head-text">
                    <h2>{group.catName}</h2>
                    {group.desc && <p>{group.desc}</p>}
                  </div>
                  <Link href={`/proizvodi/${group.catSlug}`} className="rjesenje-row-link">
                    Pogledajte sve <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
                <div className="pcard-grid pcard-grid--4">
                  {group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── REALIZACIJE ── */}
      {realizacije && realizacije.items.length > 0 && (
        <section className="realizacije" id="realizacije">
          <div className="realizacije-bg">
            {realizacije.items.map((r, i) => (
              <div key={r.img} className={`slider-slide${i === 0 ? " active" : ""}`} data-index={i}>
                <img src={r.img} alt={r.label} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
          <div className="realizacije-overlay" />
          <div className="realizacije-content">
            <div className="realizacije-text">
              <span className="section-eyebrow">Realizacije</span>
              <h2>Realizacije u <span className="highlight">ovoj industriji</span></h2>
              <p>Dio objekata koje smo opremili širom Evrope — od projektovanja do montaže na ključ.</p>
              <div className="realizacije-stats">
                <div className="real-stat"><strong>12+</strong><span>Zemalja</span></div>
                <div className="real-stat"><strong>200+</strong><span>Projekata</span></div>
                <div className="real-stat"><strong>98%</strong><span>Na vrijeme</span></div>
              </div>
              <Link href="/realizacije" className="btn-primary btn-shine">
                Pogledajte sve realizacije <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="realizacije-slider-info">
              <span className="slider-title">{realizacije.items[0].label}</span>
              {realizacije.items.length > 1 && (
                <div className="slider-dots">
                  {realizacije.items.map((_, i) => (
                    <button key={i} className={`slider-dot${i === 0 ? " active" : ""}`} data-slide={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {cta && (
        <section className="solution-cta">
          <div className="container">
            <div className="cta-band">
              <div className="cta-band-text">
                <h2>{cta.h2}</h2>
                <p>{cta.p}</p>
              </div>
              <Link href="/kontakt" className="btn-primary btn-lg">
                Zatražite ponudu <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Script src="/script.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
