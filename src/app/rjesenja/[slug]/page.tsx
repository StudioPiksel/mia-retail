import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const RJESENJA: Record<string, {
  title: string; highlight: string; lead: string; bg: string;
  stats: { num: string; label: string }[];
  zones: { title: string; desc: string }[];
}> = {
  supermarketi: {
    title: "Supermarketi &", highlight: "Maloprodaja",
    lead: "Od malih convenience radnji do hipermarketa od 5.000 m² — projektujemo i opremamo prodajni prostor koji prodaje.",
    bg: "/assets/images/megamenu/supermarketi.jpg",
    stats: [{ num: "12+", label: "opremljenih objekata" }, { num: "15+", label: "zemalja isporuke" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Rashladni lanac", desc: "Rashladne vitrine, frižideri sa staklenim vratima i hladne komore." },
      { title: "Zona naplate", desc: "Kasa pultovi i self-checkout rješenja za bržu naplatu." },
      { title: "Polični sistemi", desc: "Gondole, zidne police, pusheri, cjenovne šine i ESL." },
      { title: "Kolica i korpe", desc: "Samba kolica, žičana kolica i ručne korpe u boji brenda." },
      { title: "Svjež program", desc: "Vage, vitrine za voće i povrće, izložbeni stolovi." },
      { title: "Inox i back-office", desc: "Radni stolovi, sudopere i oprema za pripremne zone." },
    ],
  },
  "mesnice-ribarnice": {
    title: "Mesnice &", highlight: "Ribarnice",
    lead: "Rashladne vitrine, inox oprema i radne površine za svjež program. HACCP standardi, AISI 316 čelik.",
    bg: "/assets/images/megamenu/mesnice.jpg",
    stats: [{ num: "HACCP", label: "kompatibilna oprema" }, { num: "AISI 316", label: "nerđajući čelik" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Rashladne vitrine", desc: "Otvorene i zatvorene vitrine za svježe meso i ribu." },
      { title: "Inox oprema", desc: "Radni stolovi, sudopere i blokovi od AISI 316 čelika." },
      { title: "Hladne komore", desc: "Modularne komore za skladištenje svježeg programa." },
      { title: "Vakuum pakovanje", desc: "Oprema za vakuum pakovanje i produžavanje roka trajanja." },
      { title: "Vage i etiketiranje", desc: "Profesionalne vage sa štampačima etiketa." },
      { title: "Ambijentalna rasvjeta", desc: "Specijalna rasvjeta koja naglašava boje svježeg mesa." },
    ],
  },
  horeca: {
    title: "HoReCa &", highlight: "Ugostiteljstvo",
    lead: "Profesionalne kuhinje, šankovi i rashladni sistemi za restorane i hotele.",
    bg: "/assets/images/megamenu/horeca.jpg",
    stats: [{ num: "200+", label: "opremljenih objekata" }, { num: "15+", label: "godina iskustva" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Profesionalna kuhinja", desc: "Termička linija, rashladni ormari, radni stolovi." },
      { title: "Šankovi i barovi", desc: "Custom šankovi i rashladna oprema za piće." },
      { title: "Rashladni sistemi", desc: "Vitrine za desert i piće, frižideri i zamrzivači." },
      { title: "Sala i servis", desc: "Oprema za servis i prezentaciju jela u sali." },
      { title: "Dostava i transport", desc: "Kolica, GN posude i termos posude." },
      { title: "Higijenska oprema", desc: "Perilice posuđa i dezinfekcija prema HACCP." },
    ],
  },
  pekare: {
    title: "Pekare &", highlight: "Poslastičarnice",
    lead: "Vitrine za pekarski i poslastičarski program uz toplu prezentaciju.",
    bg: "/assets/images/megamenu/pekare-v2.jpg",
    stats: [{ num: "Tople", label: "i rashladne vitrine" }, { num: "Custom", label: "dizajn po mjeri" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Izložbene vitrine", desc: "Tople i rashladne vitrine za pekarski program." },
      { title: "Rashladni regali", desc: "Police za čuvanje i izlaganje svježih proizvoda." },
      { title: "Oprema za pripremu", desc: "Radni stolovi i lampe za grijanje." },
      { title: "Kasa i naplatni pult", desc: "Kompaktni kasa pultovi za manje objekte." },
      { title: "Ambijentalna rasvjeta", desc: "Topla rasvjeta za pekarske proizvode." },
      { title: "Ambalažna oprema", desc: "Vrećice, kutije i oprema za pakovanje." },
    ],
  },
  "apoteke-drogerije": {
    title: "Apoteke &", highlight: "Drogerije",
    lead: "Polični sistemi, pultovi i rasvjeta za uredan i pregledan prostor.",
    bg: "/assets/images/megamenu/apoteke.jpg",
    stats: [{ num: "Modularni", label: "polični sistemi" }, { num: "Custom", label: "boje i dimenzije" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Polični sistemi", desc: "Modularni polični sistemi prilagodljivi boji brenda." },
      { title: "Prodajni pultovi", desc: "Pultovi za savjetovanje i prodaju." },
      { title: "Rashladna oprema", desc: "Vitrine za termolabilne preparate." },
      { title: "Izlozi i prezentatori", desc: "Stalci za kozmetičke i OTC proizvode." },
      { title: "Kasa i naplatni sistem", desc: "Kompaktni kasa pultovi." },
      { title: "Rasvjeta", desc: "Profesionalna rasvjeta za ugodnu atmosferu." },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = RJESENJA[slug];
  if (!page) return {};
  return { title: `${page.title} ${page.highlight} | MIA Retail Solutions`, description: page.lead };
}

export default async function RjesenjaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = RJESENJA[slug];
  if (!page) notFound();

  // Dohvati proizvode za ovu rješenja stranicu iz DB, grupisane po kategoriji
  const rjesenjaItems = await prisma.rjesenjaItem.findMany({
    where: { rjesenjaSlug: slug },
    include: { product: { include: { category: true } } },
    orderBy: { order: "asc" },
  });

  // Grupiši po kategoriji
  const grouped = rjesenjaItems.reduce<Record<string, { catName: string; catSlug: string; products: typeof rjesenjaItems[0]["product"][] }>>((acc, item) => {
    const catId = item.product.categoryId;
    if (!acc[catId]) acc[catId] = { catName: item.product.category.name, catSlug: item.product.category.slug, products: [] };
    acc[catId].products.push(item.product);
    return acc;
  }, {});

  const otherRjesenja = Object.entries(RJESENJA).filter(([s]) => s !== slug);

  return (
    <SiteLayout currentPage={`/rjesenja/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* HERO */}
      <section className="solution-hero solution-hero--photo">
        <div className="solution-hero-bg" style={{ backgroundImage: `url('${page.bg}')` }}></div>
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb">
                <Link href="/">Početna</Link> <span>/</span> <span>Rješenja</span> <span>/</span>
                <span className="breadcrumb-current">{page.title} {page.highlight}</span>
              </nav>
              <span className="solution-hero-eyebrow">Rješenja po industriji</span>
              <h1>{page.title} <span className="highlight">{page.highlight}</span></h1>
              <p className="solution-hero-lead">{page.lead}</p>
              <div className="solution-hero-stats">
                {page.stats.map(s => (
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
                <Link href="/reference" className="btn-ghost">Pogledajte realizacije</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section className="solution-zones">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Obim opremanja</span>
            <h2>Šta opremamo u ovom tipu objekta</h2>
          </div>
          <div className="zones-grid">
            {page.zones.map(z => (
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

      {/* PRODUCT SECTIONS — dinamički iz DB */}
      {Object.keys(grouped).length > 0 && (
        <section className="product-groups rjesenje-rows">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Preporučena oprema</span>
              <h2>Oprema za ovu industriju</h2>
              <p>Izbor proizvoda koje najčešće ugrađujemo u objekte ovog tipa.</p>
            </div>

            {Object.values(grouped).map(group => (
              <div key={group.catSlug} className="product-group">
                <div className="product-group-head rjesenje-row-head">
                  <div className="rjesenje-row-head-text">
                    <h2>{group.catName}</h2>
                  </div>
                  <Link href={`/proizvodi/${group.catSlug}`} className="rjesenje-row-link">
                    Pogledajte sve <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
                <div className="pcard-grid pcard-grid--4">
                  {group.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Opremite vaš objekat</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Besplatna konsultacija bez obaveze.
          </p>
          <Link href="/kontakt" className="btn-primary">Zatražite besplatnu procjenu →</Link>
        </div>
      </section>

      {/* OTHER */}
      <section style={{ padding: "60px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <span className="section-eyebrow">Ostala rješenja</span>
            <h2>Radimo i za <span className="highlight">druge industrije</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {otherRjesenja.map(([s, r]) => (
              <Link key={s} href={`/rjesenja/${s}`} style={{
                display: "block", padding: "18px 22px", background: "#fff",
                borderRadius: 12, border: "1px solid var(--gray-200)",
                textDecoration: "none", color: "var(--navy)", fontWeight: 600, fontSize: 14,
              }}>
                {r.title} {r.highlight} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
