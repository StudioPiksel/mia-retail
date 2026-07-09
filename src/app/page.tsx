export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import HeroForm from "@/components/HeroForm";

const DEFAULT_SEO = {
  title: "MIA Retail Solutions — Partner za opremanje maloprodajnih i HoReCa objekata",
  description: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora na ključ. 200+ projekata na 3 kontinenta.",
  ogImage: "/assets/images/logo/mia-og-image.jpg",
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.settings.findUnique({ where: { key: "homepage_seo" } });
  let seo = DEFAULT_SEO;
  try { if (s) seo = { ...DEFAULT_SEO, ...JSON.parse(s.value) }; } catch {}
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
      type: "website",
      url: "https://miaretailsolutions.com",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

const DEFAULT_HERO = {
  eyebrow: "Partner za opremanje na ključ",
  h1: "Vaš objekat, spreman",
  h1Highlight: "na dan otvaranja",
  subtitle: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora. Radimo s lancima koji ne trpe kašnjenje — Lidl, IKEA, Carrefour, SPAR.",
  stats: [
    { num: "200+", label: "Realizovanih projekata" },
    { num: "3", label: "Kontinenta" },
    { num: "15+", label: "Godina iskustva" },
  ],
  slides: ["puglia-inox-1.jpg","puglia-inox-2.jpg","puglia-inox-3.jpg","esthederm.jpg","MINIEKOCOLORE.Leclerc2.jpg","ICASupermarketPelikan.jpg","PoppyBudapest2.jpg","1764661906919.jpg","ConadItaly1.jpg"],
};

const DEFAULT_CLIENTS = [
  {src:"/assets/images/clients/Logo-Lidl.webp",alt:"Lidl"},{src:"/assets/images/clients/IKEA-Logo-400x225.webp",alt:"IKEA"},{src:"/assets/images/clients/carrefour-logo-385x300.webp",alt:"Carrefour"},{src:"/assets/images/clients/Logo-Spar.webp",alt:"SPAR"},{src:"/assets/images/clients/Logo-Konzum-400x84.webp",alt:"Konzum"},{src:"/assets/images/clients/aldi-logo.webp",alt:"Aldi"},{src:"/assets/images/clients/Logo-Coop-400x159.webp",alt:"Coop"},{src:"/assets/images/clients/Logo-Knauf-400x83.webp",alt:"Kaufland"},{src:"/assets/images/clients/nestle-4-logo-png-transparent-300x300.webp",alt:"Nestlé"},{src:"/assets/images/clients/Logo-Loreal.webp",alt:"L'Oréal"},{src:"/assets/images/clients/InterContinentalLogo.svg-400x155.webp",alt:"InterContinental"},{src:"/assets/images/clients/Magyar_Telekom-Logo.wine_-400x267.webp",alt:"Magyar Telekom"},
];

export default async function HomePage() {
  const [blogPosts, homepageHeroSetting, homepageClientsSetting, homepageValuesSetting, homepageIndustriesSetting, homepageRealizacijeSetting] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true, category: true, thumbnail: true, publishedAt: true },
    }),
    prisma.settings.findUnique({ where: { key: "homepage_hero" } }),
    prisma.settings.findUnique({ where: { key: "homepage_clients" } }),
    prisma.settings.findUnique({ where: { key: "homepage_values" } }),
    prisma.settings.findUnique({ where: { key: "homepage_industries" } }),
    prisma.settings.findUnique({ where: { key: "homepage_realizacije" } }),
  ]);

  let heroData = DEFAULT_HERO;
  try { if (homepageHeroSetting) heroData = { ...DEFAULT_HERO, ...JSON.parse(homepageHeroSetting.value) }; } catch {}

  let clients = DEFAULT_CLIENTS;
  try { if (homepageClientsSetting) clients = JSON.parse(homepageClientsSetting.value); } catch {}

  const DEFAULT_VALUES = {
    eyebrow: "Šta radimo",
    h2: "Partner u projektu,",
    h2Highlight: "ne samo dobavljač",
    desc: "Ne prodajemo samo opremu. Ulazimo u projekat od prve linije na papiru do dana otvaranja — i ostajemo dostupni svakog dana nakon toga.",
    cards: [
      { title: "Konsultacija & Planiranje", desc: "Analiziramo prostor, tip objekta i budžet — predlažemo optimalno rješenje prilagođeno vašim specifičnim potrebama i rokovima." },
      { title: "Isporuka & Montaža", desc: "7 dobavljača, jedna isporuka, jedan voditelj projekta — koordiniramo sve i montiramo na dan, bez gužve na gradilištu." },
      { title: "Servis & Podrška", desc: "Servisni tim u Podgorici, garantovan odgovor 24h, dijelovi na lageru. Naš odnos ne završava isporukom." },
    ],
  };
  let valuesData = DEFAULT_VALUES;
  try { if (homepageValuesSetting) valuesData = { ...DEFAULT_VALUES, ...JSON.parse(homepageValuesSetting.value) }; } catch {}

  const DEFAULT_INDUSTRIES = {
    eyebrow: "Rješenja po industriji",
    h2: "Oprema prilagođena",
    h2Highlight: "vašem tipu objekta",
    cards: [
      { href: "/rjesenja/supermarketi", img: "/assets/images/projects/Aromamarketi2.jpg", title: "Supermarketi & Maloprodaja", desc: "Checkout pultovi, rashladni sistemi i polični sistemi za lance do 5.000 m²." },
      { href: "/rjesenja/mesnice-ribarnice", img: "/assets/images/projects/MesaraPlana.jpg", title: "Mesnice & Ribarnice", desc: "Rashladne vitrine, blokovi za sjeckanje i vakuum oprema za specijalizovane objekte." },
      { href: "/rjesenja/horeca", img: "/assets/images/projects/RestoranVojvodeStepe.jpg", title: "HoReCa & Ugostiteljstvo", desc: "Inox oprema, rashladne vitrine i kuhinjski sistemi za restorane i hotele." },
      { href: "/rjesenja/pekare", img: "/assets/images/projects/KafeSoljica3.jpg", title: "Pekare & Poslastičarnice", desc: "Rashladna i izložbena oprema za svježe i konditorske proizvode." },
      { href: "/rjesenja/apoteke-drogerije", img: "/assets/images/projects/Apoteka-drogerija.jpg", title: "Apoteke & Drogerije", desc: "Moderna oprema za prezentaciju farmaceutskih i kozmetičkih proizvoda." },
    ],
  };
  let industriesData = DEFAULT_INDUSTRIES;
  try { if (homepageIndustriesSetting) industriesData = { ...DEFAULT_INDUSTRIES, ...JSON.parse(homepageIndustriesSetting.value) }; } catch {}

  const DEFAULT_REALIZACIJE = {
    eyebrow: "Realizacije",
    h2: "Projekti koji govore",
    h2Highlight: "umjesto nas",
    p: "Od Njemačke do Australije — opremamo objekte vodećih lanaca. Svaki projekat je priča o preciznosti, rokovima i kvalitetu bez kompromisa.",
    stats: [{ num: "12+", label: "Zemalja" }, { num: "200+", label: "Projekata" }, { num: "98%", label: "Na vrijeme" }],
    btnLabel: "Pogledajte sve realizacije",
    btnHref: "/reference",
    slides: [
      { img: "/assets/images/realizacije/EDEKAGermany2.jpg", alt: "EDEKA — Njemačka" },
      { img: "/assets/images/realizacije/ConadItaly1.jpg", alt: "Conad — Italija" },
      { img: "/assets/images/realizacije/Sephora.jpg", alt: "Sephora" },
      { img: "/assets/images/realizacije/CarrefourFrance.jpg", alt: "Carrefour — Francuska" },
      { img: "/assets/images/realizacije/PoppyBudapest2.jpg", alt: "Poppy — Budimpešta" },
      { img: "/assets/images/realizacije/GlobusPilsen.jpg", alt: "Globus — Pilsen" },
    ],
  };
  let realizacijeData = DEFAULT_REALIZACIJE;
  try { if (homepageRealizacijeSetting) realizacijeData = { ...DEFAULT_REALIZACIJE, ...JSON.parse(homepageRealizacijeSetting.value) }; } catch {}

  // slides can be full URLs (from Blob) or just filenames (legacy)
  const slides = heroData.slides.map(s => s.startsWith("/") || s.startsWith("http") ? s : `/assets/images/hero/${s}`);
  const designItems = [
    {src:"/assets/images/design/dzyuba/Foxi_supermarket.webp",caption:"Foxi supermarket"},{src:"/assets/images/design/witt/Aroma_marketi.jpg",caption:"Aroma marketi"},{src:"/assets/images/design/dzyuba/Agrohub_Tbilisi.webp",caption:"Agrohub · Tbilisi"},{src:"/assets/images/design/witt/Mesara_Plana.jpg",caption:"Mesara Plana"},{src:"/assets/images/design/dzyuba/Galmart_Uzbekistan.webp",caption:"Galmart · Uzbekistan"},{src:"/assets/images/design/witt/Restoran_Flamingo.jpg",caption:"Restoran Flamingo"},{src:"/assets/images/design/dzyuba/Vinoteca.webp",caption:"Vinoteca"},{src:"/assets/images/design/witt/Kafe_Soljica_projektovanje.jpg",caption:"Kafe Šoljica"},{src:"/assets/images/design/dzyuba/Magnum_Ukraine.webp",caption:"Magnum · Ukrajina"},{src:"/assets/images/design/witt/Restoran_Vojvode_Stepe.jpg",caption:"Restoran Vojvode Stepe"},{src:"/assets/images/design/dzyuba/Smako_market.webp",caption:"Smako market"},{src:"/assets/images/design/witt/Aroma_marketi_2.jpg",caption:"Aroma marketi"},{src:"/assets/images/design/dzyuba/Selecto.webp",caption:"Selecto"},{src:"/assets/images/design/dzyuba/Ultramarket.webp",caption:"Ultramarket"},
  ];
  const suppliers = [
    {src:"/assets/images/partners/ITAB.jpg",name:"ITAB"},{src:"/assets/images/partners/HLLogotype100CMYKWhiteBlueBackground.jpg",name:"HL Display"},{src:"/assets/images/partners/Rabtrolley.png",name:"Rabtrolley"},{src:"/assets/images/partners/GOST.png",name:"Go-St"},{src:"/assets/images/partners/WISECOOLING.webp",name:"Wise Cooling"},{src:"/assets/images/partners/Plastimark.webp",name:"Plastimark"},{src:"/assets/images/partners/d&k-logo(1).png",name:"DK Technology"},{src:"/assets/images/partners/IdeamInox_PugliaInox_logo-1(1).png",name:"Ideam Inox"},{src:"/assets/images/partners/Promming.png",name:"Promming"},{src:"/assets/images/partners/damix_logo(2).jpg",name:"Damix"},
  ];

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-slideshow">
          {slides.map((slide, i) => (
            <div key={slide} className={`hero-slide${i === 0 ? " active" : ""}`} style={{ backgroundImage: `url('${slide}')` }} />
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">{heroData.eyebrow}</p>
            <h1 className="hero-title">{heroData.h1} <span className="highlight">{heroData.h1Highlight}</span></h1>
            <p className="hero-subtitle">{heroData.subtitle}</p>
            <div className="hero-stats">
              {heroData.stats.map((s, i) => (
                <div key={i} className="stat"><span className="stat-number">{s.num}</span><span className="stat-label">{s.label}</span></div>
              ))}
            </div>
          </div>
          <div className="hero-form-wrapper">
            <HeroForm />
          </div>
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="brand-strip">
        <div className="container">
          <p className="brand-strip-label">Vjeruju nam vodeći lanci i brendovi</p>
          <div className="logo-carousel"><div className="logo-track">
            {[...clients, ...clients].map((c, i) => <img key={i} src={c.src} alt={c.alt} loading="lazy" decoding="async" />)}
          </div></div>

        </div>
      </section>

      {/* VALUES */}
      <section className="values" id="values">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">{valuesData.eyebrow}</span>
            <h2>{valuesData.h2} <span className="highlight">{valuesData.h2Highlight}</span></h2>
            <p className="section-desc">{valuesData.desc}</p>
          </div>
          <div className="values-grid">
            {valuesData.cards.map((card, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">
                  {i === 0 && <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E6F7F3"/><path d="M24 14v20M14 24h20" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="24" r="10" stroke="#0F766E" strokeWidth="2"/></svg>}
                  {i === 1 && <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E6F7F3"/><path d="M16 32l6-6 4 4 8-8" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="12" y="14" width="24" height="20" rx="3" stroke="#0F766E" strokeWidth="2"/></svg>}
                  {i === 2 && <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E6F7F3"/><path d="M24 18v6l4 2" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="24" r="10" stroke="#0F766E" strokeWidth="2"/></svg>}
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="industries" id="industries">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">{industriesData.eyebrow}</span>
            <h2>{industriesData.h2} <span className="highlight">{industriesData.h2Highlight}</span></h2>
          </div>
          <div className="industries-grid">
            {industriesData.cards.map((item) => (
              <a key={item.href} href={item.href} className="industry-card">
                <div className="industry-bg"><img src={item.img} alt={item.title} loading="lazy" decoding="async" /></div>
                <div className="industry-overlay"></div>
                <div className="industry-content"><h3>{item.title}</h3><p>{item.desc}</p><span className="industry-link">Pogledajte rješenja <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
              </a>
            ))}
            <a href="/kontakt" className="industry-card industry-card--cta">
              <div className="industry-cta-content">
                <div className="industry-cta-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <h3>Niste sigurni od čega da krenete?</h3>
                <p>Pomoći ćemo vam da izaberete pravo rješenje za vaš objekat.</p>
                <span className="industry-cta-btn">Zakažite konsultaciju <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* REALIZACIJE */}
      <section className="realizacije" id="realizacije">
        <div className="realizacije-bg">
          {realizacijeData.slides.map((s, i) => (
            <div key={i} className={`slider-slide${i===0?" active":""}`} data-index={i}><img src={s.img} alt={s.alt} decoding="async" loading="lazy" /></div>
          ))}
        </div>
        <div className="realizacije-overlay"></div>
        <div className="realizacije-content">
          <div className="realizacije-text">
            <span className="section-eyebrow">{realizacijeData.eyebrow}</span>
            <h2>{realizacijeData.h2} <span className="highlight">{realizacijeData.h2Highlight}</span></h2>
            <p>{realizacijeData.p}</p>
            <div className="realizacije-stats">
              {realizacijeData.stats.map((s, i) => (
                <div key={i} className="real-stat"><strong>{s.num}</strong><span>{s.label}</span></div>
              ))}
            </div>
            <Link href={realizacijeData.btnHref} className="btn-primary btn-shine">{realizacijeData.btnLabel} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          <div className="realizacije-slider-info">
            <span className="slider-title">{realizacijeData.slides[0]?.alt ?? ""}</span>
            <div className="slider-dots">
              {realizacijeData.slides.map((_, i) => <button key={i} className={`slider-dot${i===0?" active":""}`} data-slide={i}></button>)}
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN TEASER */}
      <section className="design-section design-teaser" id="dizajn">
        <div className="container">
          <div className="design-intro">
            <span className="section-eyebrow">Projektovanje i dizajn</span>
            <h2>Dizajn enterijera za <span className="highlight">retail i HoReCa</span> — od ideje do realizacije</h2>
            <p className="lead">Uz isporuku i montažu opreme, kreiramo i kompletna dizajnerska rješenja prostora — u saradnji sa renomiranim retail i HoReCa design studijima.</p>
            <div className="design-services">
              {["Razvoj idejnih koncepata i dizajnerskih rješenja enterijera","Adaptacija koncepata za različita tržišta i formate","Optimizacija postojećih prodajnih prostora","Koordinacija od koncepta do realizacije na ključ"].map((s)=>(
                <div key={s} className="service-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg><span>{s}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="design-strip">
          <div className="design-strip-track">
            {[...designItems,...designItems].map((item,i)=>(
              <div key={i} className="studio-item design-strip-item" data-caption={item.caption}>
                <img src={item.src} alt={item.caption} loading="lazy" decoding="async" />
                <span className="studio-item-zoom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                <div className="studio-item-overlay"><span>{item.caption}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="container">
          <div className="design-teaser-actions">
            <span className="design-teaser-note"><strong>2 partnerska studija</strong> · 21 idejni koncept za supermarkete, markete, apoteke i ugostiteljske objekte</span>
            <Link href="/dizajn-enterijera" className="btn-primary">Saznajte više o dizajnu enterijera <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Proces saradnje</span>
            <h2>Od prvog poziva do <span className="highlight">otvaranja objekta</span></h2>
            <p className="section-desc">Vodimo vas kroz svaki korak — transparentno, profesionalno, bez iznenađenja.</p>
          </div>
          <div className="process-steps">
            <div className="process-step"><div className="step-number">01</div><h4>Konsultacija</h4><p>Analiziramo prostor, potrebe i budžet. Besplatna procjena za sve nove projekte.</p></div>
            <div className="process-connector"></div>
            <div className="process-step"><div className="step-number">02</div><h4>Ponuda & Plan</h4><p>Izrađujemo detaljnu ponudu s planom rasporeda opreme i vremenskim okvirom.</p></div>
            <div className="process-connector"></div>
            <div className="process-step"><div className="step-number">03</div><h4>Isporuka & Montaža</h4><p>Koordiniramo sve dobavljače i obavljamo montažu prema dogovorenom planu.</p></div>
            <div className="process-connector"></div>
            <div className="process-step"><div className="step-number">04</div><h4>Podrška & Servis</h4><p>Dugogodišnja tehnička podrška i servisiranje sve isporučene opreme.</p></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-number">200+</span><span className="stat-text">Realizovanih projekata<br />na 3 kontinenta</span></div>
            <div className="stat-item"><span className="stat-number">12+</span><span className="stat-text">Premium brendova opreme<br />u ekskluzivnoj ponudi</span></div>
            <div className="stat-item"><span className="stat-number">15+</span><span className="stat-text">Godina iskustva<br />u industriji</span></div>
            <div className="stat-item"><span className="stat-number">24h</span><span className="stat-text">Garancija odgovora<br />na svaki upit</span></div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog-section" id="blog">
        <div className="container">
          <div className="blog-header">
            <div className="blog-header-text"><span className="section-eyebrow">Iz prakse</span><h2>Znanje koje <span className="highlight">štedi budžet</span></h2></div>
            <Link href="/blog" className="blog-all-link">Svi članci <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card" data-category={post.category}>
                <span className="blog-card-image">
                  <span className="blog-category">{post.category}</span>
                  {post.thumbnail && <img src={post.thumbnail} alt={post.title} loading="lazy" decoding="async" />}
                </span>
                <span className="blog-card-body">
                  {post.publishedAt && <time>{new Date(post.publishedAt).toLocaleDateString("sr-Latn",{day:"numeric",month:"long",year:"numeric"})}</time>}
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <span className="blog-read-more">Pročitajte članak &rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WIZARD CTA */}
      <section className="wizard-banner">
        <div className="container"><div className="wizard-content">
          <h3>Niste sigurni od čega da krenete?</h3>
          <p>Vodimo vas kroz 3 pitanja do personalizovane preporuke opreme za vaš objekat.</p>
          <Link href="/pomoc-u-izboru" className="btn-primary">Pomoć u izboru →</Link>
        </div></div>
      </section>

      {/* SUPPLIERS */}
      <section className="suppliers" id="suppliers">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Naši dobavljači</span>
            <h2>Biramo brendove kao <span className="highlight">i naše klijente</span></h2>
            <p className="section-desc">Radimo isključivo sa verifikovanim svjetskim proizvođačima — pouzdanost, servis, dugovječnost.</p>
          </div>
          <div className="suppliers-grid">
            {suppliers.map((s)=>(
              <div key={s.name} className="supplier-card"><img src={s.src} alt={s.name} loading="lazy" decoding="async" /><span>{s.name}</span></div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
