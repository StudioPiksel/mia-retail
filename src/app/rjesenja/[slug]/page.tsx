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
    lead: "Svjež program traži preciznost. Opremamo mesnice i ribarnice rashladnim vitrinama sa tačnim temperaturnim režimom, inox radnim površinama otpornim na koroziju i opremom za pripremu koja ispunjava HACCP standarde.",
    bg: "/assets/images/megamenu/mesnice.jpg",
    stats: [
      { num: "0–+8°C", label: "kontrolisan režim" },
      { num: "AISI 316", label: "za vlažne zone" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Izložbene vitrine", desc: "Servisne rashladne vitrine za meso i ribu sa ravnim ili zakrivljenim staklom i vlažnim hlađenjem." },
      { title: "Inox radne površine", desc: "Radni stolovi, blokovi za sječenje i police od AISI 304/316 inoxa." },
      { title: "Sudopere i higijena", desc: "Jedno- i dvodjelne sudopere, slavine na koljeno i higijenske stanice." },
      { title: "Hladne komore", desc: "Komore za čuvanje svježeg i smrznutog programa sa nadzorom temperature." },
      { title: "Priprema i mljevenje", desc: "Prostor i oprema za mljevenje, porcionisanje i pakovanje." },
      { title: "Rasvjeta programa", desc: "Specijalna LED rasvjeta koja vjerno prikazuje boju mesa i ribe." },
    ],
    realizacije: [
      { img: "/assets/images/reference/Panaro_Carrefour_Market.jpg", alt: "Panaro — Carrefour Market", label: "Panaro — Carrefour Market" },
      { img: "/assets/images/reference/Conad_Italy_1.jpg", alt: "Conad — Italija", label: "Conad — Italija" },
      { img: "/assets/images/reference/EDEKA_Germany_2.jpg", alt: "EDEKA — Njemačka", label: "EDEKA — Njemačka" },
    ],
    ctaTitle: "Opremate mesnicu ili ribarnicu?",
    ctaDesc: "Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju i ponudu.",
  },
  horeca: {
    title: "HoReCa &",
    highlight: "Ugostiteljstvo",
    lead: "Restorani, kafići i hoteli traže opremu koja radi pod pritiskom servisa. Projektujemo profesionalne kuhinje, šankove i rashladne sisteme koji ne staju.",
    bg: "/assets/images/megamenu/horeca.jpg",
    stats: [
      { num: "Pro linija", label: "termička oprema" },
      { num: "AISI inox", label: "radne zone" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Termička linija", desc: "Šporeti, friteze, roštilji, bain-marie i konvektomati za profesionalnu pripremu." },
      { title: "Inox priprema", desc: "Radni stolovi, police i sudopere od AISI inoxa po mjeri prostora." },
      { title: "Šank i rashlada", desc: "Šankovi, podpultne rashladne jedinice i vitrine za napitke." },
      { title: "Pranje posuđa", desc: "Mašine za pranje posuđa i čaša sa pratećim inox sudoperama." },
      { title: "Skladištenje", desc: "Hladne komore i police za organizaciju namirnica." },
      { title: "Serviranje", desc: "Topla i hladna vitrina za izlaganje i serviranje jela." },
    ],
    realizacije: [
      { img: "/assets/images/projects/RestoranVojvodeStepe.jpg", alt: "Restoran Vojvode Stepe", label: "Restoran Vojvode Stepe" },
      { img: "/assets/images/projects/KafeSoljica3.jpg", alt: "Kafe Šoljica", label: "Kafe Šoljica" },
    ],
    ctaTitle: "Otvarate restoran, kafić ili hotel?",
    ctaDesc: "Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju i ponudu.",
  },
  pekare: {
    title: "Pekare &",
    highlight: "Poslastičarnice",
    lead: "Hljeb, peciva i kolači prodaju se očima. Opremamo pekare i poslastičarnice toplim i rashladnim vitrinama, izlozima i rasvjetom koja podiže apetit.",
    bg: "/assets/images/megamenu/pekare-v2.jpg",
    stats: [
      { num: "Topla/hladna", label: "vitrine" },
      { num: "LED izlog", label: "vjeran prikaz" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Tople vitrine", desc: "Vitrine sa kontrolisanom temperaturom i vlagom za peciva i hljeb." },
      { title: "Vitrine za kolače", desc: "Rashladne i panoramske vitrine za torte i sitne kolače." },
      { title: "Izlozi i police", desc: "Izložbene police i regali za hljeb i pakovani program." },
      { title: "Inox priprema", desc: "Radni stolovi i police za pripremnu zonu i back-office." },
      { title: "Rashlada sirovina", desc: "Frižideri i komore za čuvanje sirovina i poluproizvoda." },
      { title: "Rasvjeta", desc: "Topla LED rasvjeta koja vjerno prikazuje boju programa." },
    ],
    realizacije: [
      { img: "/assets/images/reference/Globus_Pilsen.jpg", alt: "Globus — Pilsen", label: "Globus — Pilsen" },
      { img: "/assets/images/reference/BILLA_Czech.jpg", alt: "BILLA — Češka", label: "BILLA — Češka" },
      { img: "/assets/images/reference/Poppy_Budapest.jpg", alt: "Poppy — Budimpešta", label: "Poppy — Budimpešta" },
    ],
    ctaTitle: "Opremate pekaru ili poslastičarnicu?",
    ctaDesc: "Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju i ponudu.",
  },
  "apoteke-drogerije": {
    title: "Apoteke &",
    highlight: "Drogerije",
    lead: "Apoteke i drogerije traže red, preglednost i povjerenje. Opremamo ih poličnim sistemima, pultovima za izdavanje i rasvjetom koja gradi profesionalan prostor.",
    bg: "/assets/images/megamenu/apoteke.jpg",
    stats: [
      { num: "Modularno", label: "polični sistemi" },
      { num: "Rashlada", label: "za osjetljive lijekove" },
      { num: "Na ključ", label: "projekat → montaža" },
    ],
    zones: [
      { title: "Polični sistemi", desc: "Zidne i otočne police sa cjenovnim šinama za pregledan asortiman." },
      { title: "Pultovi za izdavanje", desc: "Apotekarski pultovi sa radnom i kasa zonom." },
      { title: "Rashlada lijekova", desc: "Farmaceutski frižideri za temperaturno osjetljive proizvode." },
      { title: "Rasvjeta", desc: "Ujednačena LED rasvjeta za čist i profesionalan prostor." },
      { title: "Zona čekanja", desc: "Diskretna zona za privatnost klijenta tokom savjetovanja." },
      { title: "Skladište", desc: "Police i organizacija magacina za brzo snalaženje." },
    ],
    realizacije: [
      { img: "/assets/images/reference/Pharmacie_Dammarie_France.jpg", alt: "Pharmacie — Francuska", label: "Pharmacie — Francuska" },
      { img: "/assets/images/reference/Sephora.jpg", alt: "Sephora — premium retail", label: "Sephora — premium retail" },
      { img: "/assets/images/reference/Sephora_2.jpg", alt: "Sephora", label: "Sephora" },
    ],
    ctaTitle: "Opremate apoteku ili drogeriju?",
    ctaDesc: "Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju i ponudu.",
  },
};

// ─── Category descriptions for product sections ──────────────────────────────
const CAT_DESCRIPTIONS: Record<string, Record<string, string>> = {
  default: {
    "rashladne-vitrine": "Vertikalne, samostojeće i stone vitrine za svjež i smrznut program.",
    "frizideri-komore": "Frižideri sa staklenim vratima, zamrzivači i profesionalni ormari.",
    "checkout-kase": "Kasa pultovi i self-checkout rješenja za brzu i urednu naplatu.",
    "policni-sistemi": "Gondole, pusheri, cjenovne šine i ESL elektronski cjenovnici.",
    "kolica-korpe": "Samba i žičana kolica i ručne korpe u boji brenda.",
    "inox-kuhinja": "Radni stolovi, sudopere i oprema za pripremne zone i skladište.",
    "usmjeravanje": "Ulazne rampe, turniketi, barijere i ITAB sistemi usmjeravanja.",
  },
  "mesnice-ribarnice": {
    "rashladne-vitrine": "Izložbene i servisne vitrine sa preciznim temperaturnim režimom za meso i ribu.",
    "inox-kuhinja": "Radni stolovi, sudopere i oprema za pripremu od AISI 304/316 nerđajućeg čelika.",
    "frizideri-komore": "Komore i frižideri za čuvanje svježeg i smrznutog programa.",
    "policni-sistemi": "Cjenovne šine i polični elementi za uredan i čitljiv asortiman.",
  },
  horeca: {
    "inox-kuhinja": "Termička oprema, rerne, radni stolovi i oprema za profesionalnu kuhinju.",
    "frizideri-komore": "Rashladne jedinice za šank, pripremnu zonu i skladište.",
  },
  pekare: {
    "rashladne-vitrine": "Panoramske i rashladne vitrine za torte, kolače i pakovani pekarski program.",
    "inox-kuhinja": "Mješalice za tijesto, radni stolovi i prateća inox oprema.",
    "policni-sistemi": "Police i regali za hljeb i pakovani pekarski program.",
    "checkout-kase": "Kompaktni kasa pultovi sa impulsnom zonom za pekare.",
  },
  "apoteke-drogerije": {
    "policni-sistemi": "Police sa cjenovnim šinama, ESL i rasvjetom za pregledan asortiman.",
    "checkout-kase": "Apotekarski pultovi sa radnom i kasa zonom.",
    "frizideri-komore": "Frižideri za temperaturno osjetljive lijekove i preparate.",
    "kolica-korpe": "Ručne korpe i mala kolica za drogerijski asortiman.",
  },
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
        desc: (CAT_DESCRIPTIONS[slug] ?? CAT_DESCRIPTIONS.default)[category.slug] ?? CAT_DESCRIPTIONS.default[category.slug] ?? "",
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
