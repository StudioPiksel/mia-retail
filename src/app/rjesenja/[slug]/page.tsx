import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";

// ─── Static page config per slug ────────────────────────────────────────────
const RJESENJA: Record<string, {
  title: string;
  highlight: string;
  lead: string;
  bg: string;
  stats: { num: string; label: string }[];
  zones: { title: string; desc: string }[];
  realizacije: { img: string; alt: string; label: string }[];
  ctaTitle: string;
  ctaDesc: string;
}> = {
  supermarketi: {
    title: "Supermarketi &",
    highlight: "Maloprodaja",
    lead: "Od malih convenience radnji do hipermarketa od 5.000 m² — projektujemo i opremamo prodajni prostor koji prodaje. Rashladni lanac, zona naplate, polični sistemi i logistika kupca, sve iz jedne ruke.",
    bg: "/assets/images/megamenu/supermarketi.jpg",
    stats: [
      { num: "12+", label: "opremljenih objekata" },
      { num: "15+", label: "zemalja isporuke" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Rashladni lanac", desc: "Rashladne vitrine, frižideri sa staklenim vratima i hladne komore za svjež i smrznut program." },
      { title: "Zona naplate", desc: "Kasa pultovi (standard, premium, convenience) i self-checkout rješenja za bržu naplatu." },
      { title: "Polični sistemi", desc: "Gondole, zidne police, pusheri, cjenovne šine i ESL elektronski cjenovnici." },
      { title: "Kolica i korpe", desc: "Samba kolica, žičana kolica i ručne korpe u boji brenda, otporne i ergonomske." },
      { title: "Svjež program", desc: "Vage, vitrine za voće i povrće, izložbeni stolovi i ambijentalna rasvjeta." },
      { title: "Inox i back-office", desc: "Radni stolovi, sudopere i oprema za pripremne zone i skladište." },
    ],
    realizacije: [
      { img: "/assets/images/reference/Carrefour_France.jpg", alt: "Carrefour — Francuska", label: "Carrefour — Francuska" },
      { img: "/assets/images/reference/Conad_Italy.jpg", alt: "Conad — Italija", label: "Conad — Italija" },
      { img: "/assets/images/reference/EDEKA_Germany.jpg", alt: "EDEKA — Njemačka", label: "EDEKA — Njemačka" },
    ],
    ctaTitle: "Planirate novi supermarket ili redizajn postojećeg?",
    ctaDesc: "Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju i ponudu.",
  },
  "mesnice-ribarnice": {
    title: "Mesnice &",
    highlight: "Ribarnice",
    lead: "Rashladne vitrine, inox oprema i radne površine za svjež program. HACCP standardi, AISI 316 nerđajući čelik.",
    bg: "/assets/images/megamenu/mesnice.jpg",
    stats: [
      { num: "HACCP", label: "kompatibilna oprema" },
      { num: "AISI 316", label: "nerđajući čelik" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Rashladne vitrine", desc: "Otvorene i zatvorene vitrine za svježe meso i ribu." },
      { title: "Inox oprema", desc: "Radni stolovi, sudopere i blokovi od AISI 316 nerđajućeg čelika." },
      { title: "Hladne komore", desc: "Modularne hladne i zamrzivačke komore za skladištenje svježeg programa." },
      { title: "Vakuum pakovanje", desc: "Oprema za vakuum pakovanje i produžavanje roka trajanja." },
      { title: "Vage i etiketiranje", desc: "Profesionalne vage sa štampačima etiketa za svjež program." },
      { title: "Ambijentalna rasvjeta", desc: "Specijalna rasvjeta koja naglašava boje svježeg mesa i ribe." },
    ],
    realizacije: [
      { img: "/assets/images/projects/MesaraPlana.jpg", alt: "Mesara Plana", label: "Mesara Plana — Srbija" },
    ],
    ctaTitle: "Planirate opremanje mesnice ili ribarnice?",
    ctaDesc: "Naš tim vam pomaže sa izborom HACCP-kompatibilne opreme i dizajnom prostora.",
  },
  horeca: {
    title: "HoReCa &",
    highlight: "Ugostiteljstvo",
    lead: "Profesionalne kuhinje, šankovi i rashladni sistemi za restorane i hotele.",
    bg: "/assets/images/megamenu/horeca.jpg",
    stats: [
      { num: "200+", label: "opremljenih objekata" },
      { num: "15+", label: "godina iskustva" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Profesionalna kuhinja", desc: "Termička linija, rashladni ormari, radni stolovi i sudopere od nerđajućeg čelika." },
      { title: "Šankovi i barovi", desc: "Custom šankovi, rashladni ormari za piće i oprema za espresso stanice." },
      { title: "Rashladni sistemi", desc: "Rashladne vitrine za desert i piće, frižideri i zamrzivači za ugostiteljstvo." },
      { title: "Sala i servis", desc: "Oprema za servis i prezentaciju jela u sali." },
      { title: "Dostava i transport", desc: "Kolica za dostavu, GN posude i termos posude za transport hrane." },
      { title: "Higijenska oprema", desc: "Perilice posuđa, sanitarni čvorovi i dezinfekcija prema HACCP standardima." },
    ],
    realizacije: [
      { img: "/assets/images/projects/RestoranVojvodeStepe.jpg", alt: "Restoran Vojvode Stepe", label: "Restoran Vojvode Stepe" },
      { img: "/assets/images/projects/KafeSoljica3.jpg", alt: "Kafe Šoljica", label: "Kafe Šoljica" },
    ],
    ctaTitle: "Planirate opremanje restorana ili hotela?",
    ctaDesc: "Od kuhinje do sale — projektujemo i isporučujemo kompletnu HoReCa opremu na ključ.",
  },
  pekare: {
    title: "Pekare &",
    highlight: "Poslastičarnice",
    lead: "Vitrine za pekarski i poslastičarski program uz toplu prezentaciju.",
    bg: "/assets/images/megamenu/pekare-v2.jpg",
    stats: [
      { num: "Tople", label: "i rashladne vitrine" },
      { num: "Custom", label: "dizajn po mjeri" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Izložbene vitrine", desc: "Tople i rashladne vitrine za prezentaciju pekarskog i poslastičarskog programa." },
      { title: "Rashladni regali", desc: "Police i regali za čuvanje i izlaganje svježih proizvoda." },
      { title: "Oprema za pripremu", desc: "Radni stolovi, lampe za grijanje i oprema za pripremu tijesta." },
      { title: "Kasa i naplatni pult", desc: "Kompaktni kasa pultovi prilagođeni manjim objektima." },
      { title: "Ambijentalna rasvjeta", desc: "Topla rasvjeta koja naglašava boje pekarskih i konditorskih proizvoda." },
      { title: "Ambalažna oprema", desc: "Vrećice, kutije i oprema za pakovanje proizvoda." },
    ],
    realizacije: [
      { img: "/assets/images/projects/KafeSoljica3.jpg", alt: "Kafe Šoljica", label: "Kafe Šoljica — Crna Gora" },
    ],
    ctaTitle: "Planirate opremanje pekare ili poslastičarnice?",
    ctaDesc: "Pomažemo vam da odaberete pravu vitrinu i kompletno opremite vaš prostor.",
  },
  "apoteke-drogerije": {
    title: "Apoteke &",
    highlight: "Drogerije",
    lead: "Polični sistemi, pultovi i rasvjeta za uredan i pregledan prostor.",
    bg: "/assets/images/megamenu/apoteke.jpg",
    stats: [
      { num: "Modularni", label: "polični sistemi" },
      { num: "Custom", label: "boje i dimenzije" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Polični sistemi", desc: "Modularni polični sistemi sa mogućnošću prilagođavanja bojama brenda." },
      { title: "Prodajni pultovi", desc: "Pultovi za savjetovanje i prodaju farmaceutskih proizvoda." },
      { title: "Rashladna oprema", desc: "Vitrine i frižideri za čuvanje termolabilnih preparata." },
      { title: "Izlozi i prezentatori", desc: "Izložbeni prezentatori i stalci za kozmetičke i OTC proizvode." },
      { title: "Kasa i naplatni sistem", desc: "Kompaktni kasa pultovi za farmaceutsku prodaju." },
      { title: "Rasvjeta", desc: "Profesionalna rasvjeta koja naglašava proizvode i čini prostor ugodnim." },
    ],
    realizacije: [
      { img: "/assets/images/projects/Apoteka-drogerija.jpg", alt: "Apoteka", label: "Apoteka & Drogerija" },
    ],
    ctaTitle: "Planirate opremanje apoteke ili drogerije?",
    ctaDesc: "Naš tim vam pomaže sa izborom modularnih rješenja i prilagođavanjem prostora.",
  },
};

// ─── Category descriptions for product sections ──────────────────────────────
const CAT_DESCRIPTIONS: Record<string, string> = {
  "rashladne-vitrine": "Vertikalne, samostojeće i stone vitrine za svjež i smrznut program.",
  "frizideri-komore": "Frižideri sa staklenim vratima, zamrzivači i profesionalni ormari.",
  "checkout-kase": "Kasa pultovi i self-checkout rješenja za brzu i urednu naplatu.",
  "policni-sistemi": "Gondole, pusheri, cjenovne šine i ESL elektronski cjenovnici.",
  "kolica-korpe": "Samba i žičana kolica i ručne korpe u boji brenda.",
  "inox-kuhinja": "Radni stolovi, sudopere i oprema za pripremne zone i skladište.",
  "usmjeravanje": "Ulazne rampe, turniketi, barijere i ITAB sistemi usmjeravanja.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = RJESENJA[slug];
  if (!page) return {};
  return {
    title: `${page.title} ${page.highlight} | MIA Retail Solutions`,
    description: page.lead,
  };
}

export default async function RjesenjaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = RJESENJA[slug];
  if (!page) notFound();

  // Fetch products linked to this rješenja page, ordered
  const rjesenjaItems = await prisma.rjesenjaItem.findMany({
    where: { rjesenjaSlug: slug },
    include: { product: { include: { category: true } } },
    orderBy: { order: "asc" },
  });

  // Group by category, preserving order within each group
  const groupMap = new Map<string, { catId: string; catName: string; catSlug: string; desc: string; products: typeof rjesenjaItems[0]["product"][] }>();
  for (const item of rjesenjaItems) {
    const { category } = item.product;
    if (!groupMap.has(category.id)) {
      groupMap.set(category.id, {
        catId: category.id,
        catName: category.name,
        catSlug: category.slug,
        desc: CAT_DESCRIPTIONS[category.slug] ?? "",
        products: [],
      });
    }
    groupMap.get(category.id)!.products.push(item.product);
  }
  const groups = Array.from(groupMap.values());

  const otherRjesenja = Object.entries(RJESENJA).filter(([s]) => s !== slug);

  return (
    <SiteLayout currentPage={`/rjesenja/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* ── HERO ── */}
      <section className="solution-hero solution-hero--photo">
        <div className="solution-hero-bg" style={{ backgroundImage: `url('${page.bg}')` }} />
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb" aria-label="Putanja">
                <Link href="/">Početna</Link>{" "}<span>/</span>{" "}
                <Link href="#">Rješenja</Link>{" "}<span>/</span>{" "}
                <span className="breadcrumb-current">{page.title} {page.highlight}</span>
              </nav>
              <span className="solution-hero-eyebrow">Rješenja po industriji</span>
              <h1>{page.title} <span className="highlight">{page.highlight}</span></h1>
              <p className="solution-hero-lead">{page.lead}</p>
              <div className="solution-hero-stats">
                {page.stats.map((s) => (
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
                <Link href="/reference" className="btn-ghost">Pogledajte realizacije</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZONES ── */}
      <section className="solution-zones">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Obim opremanja</span>
            <h2>Šta opremamo u {slug === "supermarketi" ? "supermarketu" : "ovom tipu objekta"}</h2>
            <p>Pokrivamo svaku zonu objekta — od ulaza i svježeg programa do zone naplate i skladišta.</p>
          </div>
          <div className="zones-grid">
            {page.zones.map((z) => (
              <div key={z.title} className="zone-card">
                <div className="zone-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="zone-text">
                  <h3>{z.title}</h3>
                  <p>{z.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GROUPS — dynamic from DB ── */}
      {groups.length > 0 && (
        <section className="product-groups rjesenje-rows">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Preporučena oprema</span>
              <h2>Oprema za ovu industriju</h2>
              <p>Izbor proizvoda koje najčešće ugrađujemo u objekte ovog tipa — pogledajte cijelu kategoriju za kompletan asortiman.</p>
            </div>
            {groups.map((group) => (
              <div key={group.catId} className="product-group">
                <div className="product-group-head rjesenje-row-head">
                  <div className="rjesenje-row-head-text">
                    <h2>{group.catName}</h2>
                    {group.desc && <p>{group.desc}</p>}
                  </div>
                  <Link href={`/proizvodi/${group.catSlug}`} className="rjesenje-row-link">
                    Pogledajte sve{" "}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
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
      {page.realizacije.length > 0 && (
        <section className="realizacije" id="realizacije">
          <div className="realizacije-bg">
            {page.realizacije.map((r, i) => (
              <div key={r.img} className={`slider-slide${i === 0 ? " active" : ""}`} data-index={i}>
                <img src={r.img} alt={r.alt} loading="lazy" decoding="async" />
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
              <Link href="/reference" className="btn-primary btn-shine">
                Pogledajte sve realizacije{" "}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
            <div className="realizacije-slider-info">
              <span className="slider-title">{page.realizacije[0].label}</span>
              {page.realizacije.length > 1 && (
                <div className="slider-dots">
                  {page.realizacije.map((_, i) => (
                    <button key={i} className={`slider-dot${i === 0 ? " active" : ""}`} data-slide={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SOLUTION CTA ── */}
      <section className="solution-cta">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band-text">
              <h2>{page.ctaTitle}</h2>
              <p>{page.ctaDesc}</p>
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

      {/* ── OTHER RJESENJA ── */}
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
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}>
                {r.title} {r.highlight} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Script src="/script.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
