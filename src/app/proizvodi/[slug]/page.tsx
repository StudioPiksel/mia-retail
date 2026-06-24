import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";

const HERO: Record<string, { eyebrow: string; h1: string; highlight: string; lead: string; stats: { num: string; label: string }[] }> = {
  "rashladne-vitrine": {
    eyebrow: "Proizvodi",
    h1: "Rashladne", highlight: "vitrine",
    lead: "Vertikalne, samostojeće i stone vitrine za svjež i smrznut program. CURVE i CUBE serija sa zakrivljenim i ravnim staklom za supermarkete, mesnice i poslastičarnice.",
    stats: [{ num: "CURVE", label: "zakrivljeno staklo" }, { num: "LED", label: "ambijentalna rasvjeta" }, { num: "Energetski", label: "efikasno" }],
  },
  "frizideri-komore": {
    eyebrow: "Proizvodi",
    h1: "Frižideri &", highlight: "komore",
    lead: "Uspravni frižideri sa staklenim vratima, zamrzivači i modularne hladne komore za pouzdano čuvanje svježeg i smrznutog programa.",
    stats: [{ num: "Nadzor T", label: "kontrola temperature" }, { num: "Modularno", label: "komore po mjeri" }, { num: "Energ. klasa", label: "niska potrošnja" }],
  },
  "checkout-kase": {
    eyebrow: "Proizvodi",
    h1: "Checkout &", highlight: "Kasa pultovi",
    lead: "Zona naplate je posljednji utisak kupca. Projektujemo i isporučujemo kasa pultove (standard, premium, convenience) i self-checkout rješenja.",
    stats: [{ num: "3 modela", label: "standard/premium/conv." }, { num: "SmartPos", label: "Netris integracija" }, { num: "Impulsna", label: "zona prodaje" }],
  },
  "policni-sistemi": {
    eyebrow: "Proizvodi",
    h1: "Polični", highlight: "sistemi",
    lead: "Gondole, zidne police, pusheri, cjenovne šine i ESL elektronski cjenovnici. Polični sistemi koji čine vaš asortiman preglednim i prodajnim.",
    stats: [{ num: "Modularno", label: "promjenjiva visina" }, { num: "Pusheri", label: "auto-poravnavanje" }, { num: "ESL", label: "digitalni cjenovnici" }],
  },
  "kolica-korpe": {
    eyebrow: "Proizvodi",
    h1: "Kolica &", highlight: "Korpe",
    lead: "Samba kolica, žičana kolica, ručne korpe i trolley sistemi. Ergonomska i izdržljiva logistika kupca, dostupna u bojama vašeg brenda.",
    stats: [{ num: "Brend boja", label: "po izboru" }, { num: "Reciklirano", label: "eko opcije" }, { num: "Ergonomski", label: "lako vođenje" }],
  },
  "inox-kuhinja": {
    eyebrow: "Proizvodi",
    h1: "Inox &", highlight: "Kuhinjska oprema",
    lead: "Radni stolovi, sudopere, nape i termička linija od AISI 304/316 inoxa. Profesionalna oprema za HoReCa i maloprodajne objekte.",
    stats: [{ num: "AISI 316", label: "za vlažne zone" }, { num: "Po mjeri", label: "izrada" }, { num: "Pro linija", label: "termička oprema" }],
  },
  "usmjeravanje": {
    eyebrow: "Proizvodi",
    h1: "Sistemi za", highlight: "usmjeravanje kupaca",
    lead: "Ulazno-izlazne barijere, turniketi i ITAB automatske kapije koje usmjeravaju tok kupaca, štite zonu naplate i modernizuju ulaz u objekat.",
    stats: [{ num: "Porta / ITAB", label: "dvije linije" }, { num: "Automatske", label: "i mehaničke kapije" }, { num: "Bezbjedno", label: "usmjeravanje toka" }],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.productCategory.findUnique({ where: { slug } });
  const h = HERO[slug];
  if (!cat) return {};
  return {
    title: `${h?.h1 ?? cat.name} ${h?.highlight ?? ""} | MIA Retail Solutions`,
    description: h?.lead,
  };
}

export default async function ProizvodiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.productCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, published: true },
    orderBy: [{ subGroupOrder: "asc" }, { order: "asc" }],
  });

  // Group by subGroup (preserving order via subGroupOrder)
  const groupMap = new Map<string, typeof products>();
  for (const p of products) {
    const key = p.subGroup ?? "Ostalo";
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(p);
  }
  const groups = Array.from(groupMap.entries());

  const allCategories = await prisma.productCategory.findMany({ orderBy: { order: "asc" } });
  const hero = HERO[slug];

  return (
    <SiteLayout currentPage={`/proizvodi/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* ── HERO ── */}
      <section className="solution-hero solution-hero--slim">
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb" aria-label="Putanja">
                <Link href="/">Početna</Link> <span>/</span>{" "}
                <span>Proizvodi</span> <span>/</span>{" "}
                <span className="breadcrumb-current">{category.name}</span>
              </nav>
              <span className="solution-hero-eyebrow">{hero?.eyebrow ?? "Proizvodi"}</span>
              <h1>
                {hero?.h1 ?? category.name}{" "}
                {hero?.highlight && <span className="highlight">{hero.highlight}</span>}
              </h1>
              {hero?.lead && <p className="solution-hero-lead">{hero.lead}</p>}
              {hero?.stats && (
                <div className="solution-hero-stats">
                  {hero.stats.map((s) => (
                    <div key={s.label} className="stat-item">
                      <span className="stat-num">{s.num}</span>
                      <span className="stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY NAV ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8ED", position: "sticky", top: 60, zIndex: 40 }}>
        <div className="container" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 24px" }}>
          {allCategories.map((cat) => (
            <Link key={cat.slug} href={`/proizvodi/${cat.slug}`} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13,
              fontWeight: cat.slug === slug ? 600 : 400,
              background: cat.slug === slug ? "#C7F1E6" : "#F8FAFB",
              color: cat.slug === slug ? "#0A5C56" : "#374151",
              border: cat.slug === slug ? "1.5px solid #0F766E" : "1.5px solid #E2E8ED",
              textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── PRODUCT GROUPS ── */}
      <section className="product-groups rjesenje-rows" style={{ paddingTop: 40 }}>
        <div className="container">
          {groups.length > 0 ? (
            groups.map(([groupName, groupProducts]) => (
              <div key={groupName} className="product-group">
                <div className="product-group-head">
                  <h2>{groupName}</h2>
                </div>
                <div className="pcard-grid pcard-grid--4">
                  {groupProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7B8A" }}>
              Nema objavljenih proizvoda u ovoj kategoriji.
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="solution-cta">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band-text">
              <h2>Tražite specifičan model ili prilagođeno rješenje?</h2>
              <p>Naš tim vam stoji na raspolaganju — javite se za ponudu i besplatnu konsultaciju.</p>
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

      <Script src="/script.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
