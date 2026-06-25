import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";

type PageConfig = {
  eyebrow: string;
  h1: string;
  highlight: string;
  lead: string;
  stats: { num: string; label: string }[];
  ghostBtn?: string;
  ghostHref?: string;
  feature: {
    img: string;
    badge: string;
    h2: string;
    p: string;
    li: string[];
  };
  ctaTitle: string;
  realizacije?: { img: string; label: string }[];
};

const CONFIG: Record<string, PageConfig> = {
  "rashladne-vitrine": {
    eyebrow: "Proizvodi", h1: "Rashladne", highlight: "vitrine",
    lead: "Rashladne vitrine namijenjene su za atraktivno izlaganje i čuvanje svježih prehrambenih proizvoda pri optimalnoj temperaturi. Zahvaljujući modernom dizajnu, velikim staklenim površinama i efikasnom rashladnom sistemu, omogućavaju odličnu preglednost proizvoda uz očuvanje njihove svježine, kvaliteta i prezentacije. Idealne su za supermarkete, delikatese, pekare, mesnice, poslastičarnice, kafiće i druge maloprodajne objekte. Dostupne su u različitim dimenzijama i konfiguracijama kako bi se prilagodile potrebama svakog prodajnog prostora.",
    stats: [{ num: "CURVE/CUBE", label: "dvije serije" }, { num: "LED", label: "integrisana rasvjeta" }, { num: "Niska", label: "potrošnja energije" }],
    ghostBtn: "Pogledajte rješenje za supermarkete", ghostHref: "/rjesenja/supermarketi",
    feature: {
      img: "/assets/images/proizvodi/rashladne-vitrine/vitrina-curve-wide.webp",
      badge: "CURVE / CUBE serija",
      h2: "Vitrine koje prodaju svjež program",
      p: "Rashladne vitrine su srce svakog svježeg programa. Naše CURVE i CUBE serije kombinuju estetiku, energetsku efikasnost i pouzdan rashladni lanac, uz fleksibilnu konfiguraciju za svaki tip objekta.",
      li: ["Zakrivljeno (CURVE) i ravno (CUBE) staklo za optimalan prikaz", "Precizan temperaturni režim za svjež i smrznut program", "Energetski efikasni agregati — niža potrošnja i tihiji rad", "Integrisana LED rasvjeta koja vjerno prikazuje boju proizvoda", "Modularno povezivanje u linije proizvoljne dužine"],
    },
    ctaTitle: "Treba vam ponuda za rashladne vitrine?",
    realizacije: [
      { img: "/assets/images/reference/EDEKA_Germany.jpg", label: "EDEKA — Njemačka" },
      { img: "/assets/images/reference/Conad_Italy.jpg", label: "Conad — Italija" },
      { img: "/assets/images/reference/Carrefour_France.jpg", label: "Carrefour — Francuska" },
      { img: "/assets/images/reference/Globus_Pilsen.jpg", label: "Globus — Pilsen" },
      { img: "/assets/images/reference/Sephora.jpg", label: "Sephora" },
      { img: "/assets/images/reference/Poppy_Budapest.jpg", label: "Poppy — Budimpešta" },
    ],
  },
  "frizideri-komore": {
    eyebrow: "Proizvodi", h1: "Frižideri &", highlight: "komore",
    lead: "Uspravni frižideri sa staklenim vratima, zamrzivači i modularne hladne komore za pouzdano čuvanje svježeg i smrznutog programa.",
    stats: [{ num: "Nadzor T", label: "kontrola temperature" }, { num: "Modularno", label: "komore po mjeri" }, { num: "Energ. klasa", label: "niska potrošnja" }],
    ghostBtn: "Pogledajte rješenje za supermarkete", ghostHref: "/rjesenja/supermarketi",
    feature: {
      img: "/assets/images/proizvodi/frizideri-komore/frizider-stakleni.webp",
      badge: "Uspravni · stakleni · komore",
      h2: "Pouzdano čuvanje na svakoj temperaturi",
      p: "Od uspravnih frižidera sa staklenim vratima u prodajnom prostoru do modularnih hladnih komora u skladištu — nudimo kompletna rashladna rješenja za svaki tip objekta.",
      li: ["Uspravni frižideri sa staklenim vratima za napitke i mliječni program", "Zamrzivači (skrinje i uspravni) za smrznuti program", "Modularne hladne i komore za zamrzavanje po mjeri", "Nadzor temperature i alarmiranje", "Energetski razredi sa optimizovanom potrošnjom"],
    },
    ctaTitle: "Trebate rashladna rješenja za vaš objekat?",
  },
  "checkout-kase": {
    eyebrow: "Proizvodi", h1: "Checkout &", highlight: "Kasa pultovi",
    lead: "Zona naplate je posljednji utisak kupca. Projektujemo i isporučujemo kasa pultove (standard, premium, convenience) i self-checkout rješenja.",
    stats: [{ num: "3 modela", label: "standard/premium/conv." }, { num: "SmartPos", label: "Netris integracija" }, { num: "Impulsna", label: "zona prodaje" }],
    ghostBtn: "Pogledajte rješenje za supermarkete", ghostHref: "/rjesenja/supermarketi",
    feature: {
      img: "/assets/images/proizvodi/checkout-kase/kasa-zona.jpg",
      badge: "Standard · Premium · SmartPos",
      h2: "Brza i uredna zona naplate",
      p: "Dobro projektovan checkout ubrzava protok kupaca i povećava impulsnu prodaju. Naši pultovi se prilagođavaju svakom formatu objekta — od convenience radnje do hipermarketa.",
      li: ["Standard, premium i convenience modeli pultova", "Trakaste kase za veći protok kupaca", "Impulsne zone za dodatnu prodaju kod naplate", "Integracija sa SmartPos i Netris sistemima", "Ergonomija za kasira i pristupačnost za kupce"],
    },
    ctaTitle: "Planirate opremanje zone naplate?",
  },
  "policni-sistemi": {
    eyebrow: "Proizvodi", h1: "Polični", highlight: "sistemi",
    lead: "Gondole, zidne police, pusheri, cjenovne šine i ESL elektronski cjenovnici. Polični sistemi koji čine vaš asortiman preglednim i prodajnim.",
    stats: [{ num: "Modularno", label: "promjenjiva visina" }, { num: "Pusheri", label: "auto-poravnavanje" }, { num: "ESL", label: "digitalni cjenovnici" }],
    ghostBtn: "Pogledajte rješenje za supermarkete", ghostHref: "/rjesenja/supermarketi",
    feature: {
      img: "/assets/images/katalog/polica/cjenovne-sine/01.webp",
      badge: "Cijene · pusheri · merchandising",
      h2: "Uredan izlog koji vodi kupca",
      p: "Dobar polični sistem je nevidljiv kupcu, a ključan za prodaju. Nudimo modularne gondole, sisteme za poravnavanje, cjenovne šine i ESL koji čine prostor preglednim i prodajnim.",
      li: ["Modularne gondole i zidne police promjenjive visine", "Pusheri i sistemi za automatsko poravnavanje proizvoda", "Cjenovne šine i držači za jasne cijene", "ESL — elektronski cjenovnici sa centralnim ažuriranjem", "Brendiranje topera i bočnih stranica"],
    },
    ctaTitle: "Trebate polični sistem za vaš objekat?",
  },
  "inox-kuhinja": {
    eyebrow: "Proizvodi", h1: "Inox &", highlight: "Kuhinjska oprema",
    lead: "Radni stolovi, sudopere, nape i termička linija od AISI 304/316 inoxa. Profesionalna oprema za HoReCa i maloprodajne objekte.",
    stats: [{ num: "AISI 316", label: "za vlažne zone" }, { num: "Po mjeri", label: "izrada" }, { num: "Pro linija", label: "termička oprema" }],
    ghostBtn: "Pogledajte rješenje za HoReCa", ghostHref: "/rjesenja/horeca",
    feature: {
      img: "/assets/images/proizvodi/inox-kuhinja/inox-radni-stolovi.png",
      badge: "AISI 304/316 · po mjeri",
      h2: "Profesionalni inox koji izdrži servis",
      p: "Inox je standard za sve zone u dodiru sa hranom i vlagom. Izrađujemo radne površine, sudopere, police i termičku liniju koja podnosi intenzivan svakodnevni servis.",
      li: ["Radni stolovi i blokovi od AISI 304/316 inoxa", "Jedno- i dvodjelne sudopere sa higijenskim slavinama", "Nape za odvod pare i dima sa filterima", "Termička linija — šporeti, friteze, bain-marie", "Izrada po mjeri prostora i radnih procesa"],
    },
    ctaTitle: "Trebate inox opremu za vaš prostor?",
  },
  "kolica-korpe": {
    eyebrow: "Proizvodi", h1: "Kolica &", highlight: "Korpe",
    lead: "Samba kolica, žičana kolica, ručne korpe i trolley sistemi. Ergonomska i izdržljiva logistika kupca, dostupna u bojama vašeg brenda.",
    stats: [{ num: "Brend boja", label: "po izboru" }, { num: "Reciklirano", label: "eko opcije" }, { num: "Ergonomski", label: "lako vođenje" }],
    ghostBtn: "Pogledajte rješenje za supermarkete", ghostHref: "/rjesenja/supermarketi",
    feature: {
      img: "/assets/images/proizvodi/kolica-korpe/kolica-eko-color.png",
      badge: "Samba · žičana · korpe",
      h2: "Logistika kupca u boji vašeg brenda",
      p: "Kolica i korpe su prvi dodir kupca sa objektom. Nudimo plastična (Samba/Eko Color) i žičana kolica te ručne korpe u bojama vašeg brenda — ergonomska i izdržljiva rješenja.",
      li: ["Samba i Eko Color plastična kolica u brend boji", "Žičana kolica raznih zapremina", "Ručne korpe i korpe na točkićima (trolley)", "Opcije od recikliranog materijala", "Izdržljivost na intenzivan svakodnevni rad"],
    },
    ctaTitle: "Trebate kolica i korpe za vaš objekat?",
  },
  "usmjeravanje": {
    eyebrow: "Proizvodi", h1: "Sistemi za", highlight: "usmjeravanje kupaca",
    lead: "Ulazno-izlazne barijere, turniketi i ITAB automatske kapije koje usmjeravaju tok kupaca, štite zonu naplate i modernizuju ulaz u objekat.",
    stats: [{ num: "Porta / ITAB", label: "dvije linije" }, { num: "Automatske", label: "i mehaničke kapije" }, { num: "Bezbjedno", label: "usmjeravanje toka" }],
    ghostBtn: "Pogledajte rješenje za supermarkete", ghostHref: "/rjesenja/supermarketi",
    feature: {
      img: "/assets/images/katalog/usmjeravanje-itab/alphagate/01.webp",
      badge: "Barijere · Turniketi · ITAB",
      h2: "Kontrolisan i bezbjedan tok kupaca",
      p: "Dobro projektovan ulaz i izlaz usmjeravaju kupce prirodno, smanjuju gužve i štite zonu naplate. Kombinujemo mehaničke barijere i ITAB automatske kapije za optimalan efekat.",
      li: ["Mehaničke i elektronske ulazne barijere (Porta serija)", "Vertikalni turniketi za kontrolisan prolaz", "ITAB automatske ulazne i izlazne kapije (AlphaGate, SigmaGate)", "Staklene pregrade i jednosmjerni izlazni sistemi", "Pristupačna rješenja za kolica i korisnike sa smanjenom pokretljivošću"],
    },
    ctaTitle: "Planirate usmjeravanje kupaca u vašem objektu?",
  },
};

const GROUP_DESCS: Record<string, Record<string, string>> = {
  "rashladne-vitrine": {
    "Vertikalne rashladne vitrine": "Uspravne rashladne vitrine sa staklenim vratima za napitke, mliječni i svjež program — odlična vidljivost i energetska efikasnost.",
    "Vitrine za poslastičarnice": "Specijalizovane vitrine za torte, kolače i sendviče — panoramske, rotacione i stone u različitim formatima.",
    "Mini i stone rashladne vitrine": "Kompaktne mini vitrine za pultove i manje objekte — staklena ili LED izvedba, bijela ili crna.",
    "JUKA — Rashladni pultovi": "Rashladni pultovi JUKA serije Modena i Hawana za mesnice, delikatese i pastry program.",
    "JUKA — Rashladni ormari i ostrva": "Uspravni rashladni ormari, zidni regali i rashladna ostrva JUKA — za supermarkete, delikatese i HoReCa.",
    "JUKA — Vitrine za kolače i poslastice": "Konditorske i slastičarske vitrine JUKA za torte, kolače i sendviče — panoramski prikaz i LED osvjetljenje.",
    "JUKA — Vitrine i konzervatori za sladoled": "Konzervatori i vitrine za sladoled JUKA — od pultnih i samostojećih modela do mobilnih kolica za event.",
  },
  "frizideri-komore": {
    "Frižideri i rashladni ormari": "Uspravni frižideri i profesionalni rashladni ormari sa staklenim ili punim vratima za prodajni prostor i skladište.",
    "Zamrzivači": "Zamrzivači za smrznuti program i pripremu — uspravni, podpultni i profesionalni modeli.",
    "Rashladni radni stolovi (saladete)": "Rashladni radni stolovi i saladete za pripremu — sa GN nadgradnjom, fiokama i podpultnim izvođenjem.",
    "Šok komore i ledomati": "Šok komore (blast chiller) za brzo hlađenje i zamrzavanje uz očuvanje svježine i teksture namirnica.",
  },
  "checkout-kase": {
    "Kasa pultovi — zona naplate": "Kompletna paleta kasa pultova: od kompaktnih convenience i mini modela do premium i lime-light pultova.",
    "Samouslužni uređaji i self-checkout": "Self-checkout i samouslužni uređaji: SmartPos, MainBox, FoodBox, kiosk i RVM sistemi za reciklažu.",
  },
  "policni-sistemi": {
    "Prikaz cijena": "Sistemi za jasan i ažuran prikaz cijena: cjenovne šine, držači za kukice, ESL i papirne trake.",
    "Upravljanje policama": "Pusheri, tacne i pregrade za automatsko i ručno poravnavanje proizvoda na polici.",
    "Svježi i nepakovani proizvodi": "Rješenja za svjež program i prodaju bez pakovanja: FreshCase posude, kulere i dozatore.",
    "Impulsna i promotivna prodaja": "Samostojeći displeji, dump bin korpe i sistemi za unakrsno izlaganje kod naplate i u prolazima.",
    "Komunikacija u prodavnici": "Nadznaci, ramovi, stalci i tacne koji vode kupca kroz prostor i jasno komunikuju asortiman.",
    "Zaštita od krađe": "Sigurnosne kukice, tacne i ormarići koji štite vrijedan asortiman uz zadržanu pristupačnost.",
  },
  "inox-kuhinja": {
    "Inox oprema za radni prostor": "Radni stolovi, sudopere, police, nape i kolica od AISI 304/316 inoxa — po mjeri svakog prostora.",
    "Termička oprema i peći": "Konvekcijske i kombi rerne, pizza peći, friteze, grilovi, bain-marie i prateća termička oprema.",
    "Priprema mesa, povrća i tijesta": "Mesoreznice, mlinovi za meso, vakuum aparati, rezači povrća, mješalice za tijesto i procesori.",
    "Aparati za kafu i napitke": "Espresso i automatski aparati za kafu, mlinovi, blenderi, sokovnici i dispenzeri.",
    "Mašine za pranje posuđa": "Podpultne i haube mašine za pranje posuđa i čaša, mašine za pribor i utensile.",
    "Posuđe i catering oprema": "GN posude i poklopci, lonci, tiganji, pizza pekači, posude za serviranje i kuhinjske vage.",
  },
  "kolica-korpe": {
    "Ručne korpe za kupovinu": "PANARO i Samba serija — od kompaktnih 80L do 210L modela, sa varijantama od recikliranog materijala.",
    "Kolica za kupovinu (Avant serija)": "Avant i Classic serija — od kompaktnih 60L do prostranih 210L kolica, sa opcijama za djecu.",
    "Specijalna i transportna kolica": "Kolica za djecu, transportna i paletna kolica, te pristupačna rješenja za kupce smanjene pokretljivosti.",
  },
  "usmjeravanje": {
    "Ulazno-izlazne barijere i turniketi": "Mehaničke i elektronske ulazne barijere, jednosmjerni prolazi i vertikalni turniketi za kontrolu ulaska.",
    "ITAB ulazne i izlazne kapije": "ITAB sistemi ulaznih i izlaznih kapija — automatske i poluautomatske kapije za moderni ulaz u objekat.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.productCategory.findUnique({ where: { slug } });
  const c = CONFIG[slug];
  if (!cat) return {};
  return { title: `${c?.h1 ?? ""} ${c?.highlight ?? cat.name} | MIA Retail Solutions`, description: c?.lead };
}

export default async function ProizvodiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.productCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, published: true },
    orderBy: [{ subGroupOrder: "asc" }, { order: "asc" }],
  });

  // Group by subGroup
  const groupMap = new Map<string, typeof products>();
  for (const p of products) {
    const key = p.subGroup ?? "Ostalo";
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(p);
  }
  const groups = Array.from(groupMap.entries());
  const groupDescs = GROUP_DESCS[slug] ?? {};
  const cfg = CONFIG[slug];

  return (
    <SiteLayout currentPage={`/proizvodi/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* ── HERO (identično originalu) ── */}
      <section className="solution-hero solution-hero--photo">
        {cfg && <div className="solution-hero-bg" style={{ backgroundImage: `url('${cfg.feature.img}')` }} />}
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb" aria-label="Putanja">
                <Link href="/">Početna</Link> <span>/</span>{" "}
                <Link href="#">Proizvodi</Link> <span>/</span>{" "}
                <span className="breadcrumb-current">{category.name}</span>
              </nav>
              <span className="solution-hero-eyebrow">{cfg?.eyebrow ?? "Proizvodi"}</span>
              <h1>
                {cfg?.h1 ?? category.name}{" "}
                {cfg?.highlight && <span className="highlight">{cfg.highlight}</span>}
              </h1>
              {cfg?.lead && <p className="solution-hero-lead">{cfg.lead}</p>}
              {cfg?.stats && (
                <div className="solution-hero-stats">
                  {cfg.stats.map((s) => (
                    <div key={s.label} className="stat-item">
                      <span className="stat-num">{s.num}</span>
                      <span className="stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="solution-hero-cta">
                <Link href="/kontakt" className="btn-primary">
                  Zatražite ponudu{" "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                {cfg?.ghostBtn && (
                  <Link href={cfg.ghostHref ?? "#"} className="btn-ghost">{cfg.ghostBtn}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT FEATURE (nova sekcija ispod heroa) ── */}
      {cfg?.feature && (
        <section className="product-feature">
          <div className="container">
            <div className="pf-inner">
              <div className="pf-media">
                <img src={cfg.feature.img} alt={category.name} decoding="async" loading="lazy" />
              </div>
              <div className="pf-text">
                <span className="section-badge">{cfg.feature.badge}</span>
                <h2>{cfg.feature.h2}</h2>
                <p>{cfg.feature.p}</p>
                <ul className="pf-list">
                  {cfg.feature.li.map((item) => (
                    <li key={item}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/kontakt" className="btn-primary">
                  Zatražite ponudu{" "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCT GROUPS ── */}
      <section className="product-groups">
        <div className="container">
          {groups.length > 0 ? (
            groups.map(([groupName, groupProducts]) => (
              <div key={groupName} className="product-group">
                <div className="product-group-head">
                  <h2>{groupName}</h2>
                  {groupDescs[groupName] && <p>{groupDescs[groupName]}</p>}
                </div>
                <div className="pcard-grid">
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

      {/* ── REALIZACIJE ── */}
      {cfg?.realizacije && cfg.realizacije.length > 0 && (
        <section className="realizacije" id="realizacije">
          <div className="realizacije-bg">
            {cfg.realizacije.map((r, i) => (
              <div key={r.img} className={`slider-slide${i === 0 ? " active" : ""}`} data-index={i}>
                <img src={r.img} alt={r.label} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
          <div className="realizacije-overlay" />
          <div className="realizacije-content">
            <div className="realizacije-text">
              <span className="section-eyebrow">Realizacije</span>
              <h2>U vodećim <span className="highlight">svjetskim trgovinama</span></h2>
              <p>Naša oprema ugrađena je u objekte vodećih lanaca — od Evrope do Australije.</p>
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
              <span className="slider-title">{cfg.realizacije[0].label}</span>
              {cfg.realizacije.length > 1 && (
                <div className="slider-dots">
                  {cfg.realizacije.map((_, i) => (
                    <button key={i} className={`slider-dot${i === 0 ? " active" : ""}`} data-slide={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="solution-cta">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band-text">
              <h2>{cfg?.ctaTitle ?? "Tražite specifičan model?"}</h2>
              <p>Naš tim projektuje, isporučuje i montira opremu na ključ. Javite se za besplatnu konsultaciju i ponudu.</p>
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
