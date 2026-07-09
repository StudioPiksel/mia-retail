"use client";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type Stat = { num: string; label: string };
type HeroData = { eyebrow: string; h1: string; h1Highlight: string; subtitle: string; stats: Stat[]; slides: string[] };
type Client = { src: string; alt: string };
type SeoData = { title: string; description: string; ogImage: string };
type ValueCard = { title: string; desc: string };
type ValuesData = { eyebrow: string; h2: string; h2Highlight: string; desc: string; cards: ValueCard[] };

const DEFAULT_HERO: HeroData = {
  eyebrow: "Partner za opremanje na ključ",
  h1: "Vaš objekat, spreman",
  h1Highlight: "na dan otvaranja",
  subtitle: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora. Radimo s lancima koji ne trpe kašnjenje — Lidl, IKEA, Carrefour, SPAR.",
  stats: [
    { num: "200+", label: "Realizovanih projekata" },
    { num: "3", label: "Kontinenta" },
    { num: "15+", label: "Godina iskustva" },
  ],
  slides: [
    "/assets/images/hero/puglia-inox-1.jpg",
    "/assets/images/hero/puglia-inox-2.jpg",
    "/assets/images/hero/puglia-inox-3.jpg",
    "/assets/images/hero/esthederm.jpg",
    "/assets/images/hero/MINIEKOCOLORE.Leclerc2.jpg",
    "/assets/images/hero/ICASupermarketPelikan.jpg",
    "/assets/images/hero/PoppyBudapest2.jpg",
    "/assets/images/hero/1764661906919.jpg",
    "/assets/images/hero/ConadItaly1.jpg",
  ],
};

const DEFAULT_CLIENTS: Client[] = [
  { src: "/assets/images/clients/Logo-Lidl.webp", alt: "Lidl" },
  { src: "/assets/images/clients/IKEA-Logo-400x225.webp", alt: "IKEA" },
  { src: "/assets/images/clients/carrefour-logo-385x300.webp", alt: "Carrefour" },
  { src: "/assets/images/clients/Logo-Spar.webp", alt: "SPAR" },
  { src: "/assets/images/clients/Logo-Konzum-400x84.webp", alt: "Konzum" },
  { src: "/assets/images/clients/aldi-logo.webp", alt: "Aldi" },
  { src: "/assets/images/clients/Logo-Coop-400x159.webp", alt: "Coop" },
  { src: "/assets/images/clients/Logo-Knauf-400x83.webp", alt: "Kaufland" },
  { src: "/assets/images/clients/nestle-4-logo-png-transparent-300x300.webp", alt: "Nestlé" },
  { src: "/assets/images/clients/Logo-Loreal.webp", alt: "L'Oréal" },
  { src: "/assets/images/clients/InterContinentalLogo.svg-400x155.webp", alt: "InterContinental" },
  { src: "/assets/images/clients/Magyar_Telekom-Logo.wine_-400x267.webp", alt: "Magyar Telekom" },
];

const DEFAULT_VALUES: ValuesData = {
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

const DEFAULT_SEO: SeoData = {
  title: "MIA Retail Solutions — Partner za opremanje maloprodajnih i HoReCa objekata",
  description: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora na ključ. 200+ projekata na 3 kontinenta.",
  ogImage: "/assets/images/logo/mia-og-image.jpg",
};

type RealizacijeSlide = { img: string; alt: string };
type RealizacijeStat = { num: string; label: string };
type RealizacijeData = {
  eyebrow: string; h2: string; h2Highlight: string; p: string;
  stats: RealizacijeStat[]; btnLabel: string; btnHref: string;
  slides: RealizacijeSlide[];
};

const DEFAULT_REALIZACIJE: RealizacijeData = {
  eyebrow: "Realizacije",
  h2: "Projekti koji govore",
  h2Highlight: "umjesto nas",
  p: "Od Njemačke do Australije — opremamo objekte vodećih lanaca. Svaki projekat je priča o preciznosti, rokovima i kvalitetu bez kompromisa.",
  stats: [
    { num: "12+", label: "Zemalja" },
    { num: "200+", label: "Projekata" },
    { num: "98%", label: "Na vrijeme" },
  ],
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

type IndustryCard = { href: string; img: string; title: string; desc: string };
type IndustriesData = { eyebrow: string; h2: string; h2Highlight: string; cards: IndustryCard[] };

const DEFAULT_INDUSTRIES: IndustriesData = {
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

type Tab = "seo" | "hero" | "values" | "clients" | "industries" | "realizacije";

export default function PocetnaAdmin() {
  const [tab, setTab] = useState<Tab>("hero");
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [clients, setClients] = useState<Client[]>(DEFAULT_CLIENTS);
  const [seo, setSeo] = useState<SeoData>(DEFAULT_SEO);
  const [values, setValues] = useState<ValuesData>(DEFAULT_VALUES);
  const [industries, setIndustries] = useState<IndustriesData>(DEFAULT_INDUSTRIES);
  const [realizacije, setRealizacije] = useState<RealizacijeData>(DEFAULT_REALIZACIJE);
  const [pageOptions, setPageOptions] = useState<{ label: string; href: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      try { setHero(JSON.parse(s.homepage_hero)); } catch {}
      try { setClients(JSON.parse(s.homepage_clients)); } catch {}
      try { setSeo({ ...DEFAULT_SEO, ...JSON.parse(s.homepage_seo) }); } catch {}
      try { setValues({ ...DEFAULT_VALUES, ...JSON.parse(s.homepage_values) }); } catch {}
      try { setIndustries({ ...DEFAULT_INDUSTRIES, ...JSON.parse(s.homepage_industries) }); } catch {}
      try { setRealizacije({ ...DEFAULT_REALIZACIJE, ...JSON.parse(s.homepage_realizacije) }); } catch {}

      // Build page picker options from known settings keys
      const opts: { label: string; href: string }[] = [
        { label: "— Unesite ručno —", href: "" },
      ];
      // Rješenja pages
      try {
        const pages: { slug: string; label: string }[] = JSON.parse(s.rjesenja_pages ?? "[]");
        pages.forEach(p => opts.push({ label: `Rješenja › ${p.label}`, href: `/rjesenja/${p.slug}` }));
      } catch {}
      // Proizvodi (fixed slugs)
      const prodslugs = [
        { slug: "rashladne-vitrine", label: "Rashladne vitrine" },
        { slug: "frizideri-komore", label: "Frižideri & Komore" },
        { slug: "checkout-kase", label: "Checkout & Kasa pultovi" },
        { slug: "policni-sistemi", label: "Polični sistemi" },
        { slug: "inox-kuhinja", label: "Inox & Kuhinjska oprema" },
        { slug: "kolica-korpe", label: "Kolica & Korpe" },
        { slug: "usmjeravanje", label: "Sistemi za usmjeravanje" },
      ];
      prodslugs.forEach(p => opts.push({ label: `Proizvodi › ${p.label}`, href: `/proizvodi/${p.slug}` }));
      // Static pages
      opts.push(
        { label: "Realizacije", href: "/realizacije" },
        { label: "Blog", href: "/blog" },
        { label: "O nama", href: "/o-nama" },
        { label: "Kontakt", href: "/kontakt" },
        { label: "Dizajn enterijera", href: "/dizajn-enterijera" },
        { label: "Pomoć u izboru", href: "/pomoc-u-izboru" },
      );
      setPageOptions(opts);
    });
  }, []);

  async function save(key: string, value: unknown) {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: JSON.stringify(value) }),
    });
    setSaving(false);
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    if (!res.ok) { alert("Greška pri snimanju. Pokušajte ponovo."); return; }
    setSaved(key);
    setTimeout(() => setSaved(""), 4000);
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "hero", label: "Hero", icon: "🏠" },
    { key: "values", label: "Šta radimo", icon: "📋" },
    { key: "clients", label: "Klijenti", icon: "🏢" },
    { key: "industries", label: "Industrije", icon: "🏪" },
    { key: "realizacije", label: "Realizacije", icon: "🏆" },
    { key: "seo", label: "SEO", icon: "🔍" },
  ];

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Početna stranica — Uređivač</h1>
        <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Svaka sekcija se snima zasebno. Izmjene su odmah vidljive na sajtu.</p>
      </div>

      {/* ── TABOVI ── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#fff", borderRadius: 10, padding: 4, border: "1px solid #E2E8ED", width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "8px 18px", borderRadius: 7, border: "none", cursor: "pointer",
            fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
            background: tab === t.key ? "#0F766E" : "transparent",
            color: tab === t.key ? "#fff" : "#6B7B8A",
            transition: "all 0.15s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── SEO ── */}
      {tab === "seo" && <>
      <Sec title="SEO & Social dijeljenje (OG)" saved={saved === "homepage_seo"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 4px" }}>
          Ovo se prikazuje kad neko podijeli link na WhatsApp, LinkedIn, Facebook i u Google rezultatima.
        </p>
        <Row label="Naslov stranice (title tag)">
          <TI value={seo.title} set={v => setSeo({ ...seo, title: v })} />
          <span style={{ fontSize: 11, color: seo.title.length > 60 ? "#DC2626" : "#6B7B8A", marginTop: 4, display: "block" }}>
            {seo.title.length}/60 znakova {seo.title.length > 60 ? "— predugo za Google!" : ""}
          </span>
        </Row>
        <Row label="Meta opis (description)">
          <TA value={seo.description} set={v => setSeo({ ...seo, description: v })} rows={2} />
          <span style={{ fontSize: 11, color: seo.description.length > 160 ? "#DC2626" : "#6B7B8A", marginTop: 4, display: "block" }}>
            {seo.description.length}/160 znakova {seo.description.length > 160 ? "— predugo za Google!" : ""}
          </span>
        </Row>
        <Row label="OG slika (prikazuje se pri dijeljenju linka)">
          <ImageUpload value={seo.ogImage} onChange={v => setSeo({ ...seo, ogImage: v })} maxWidthPx={1200} qualityWebp={0.9} />
          <span style={{ fontSize: 11, color: "#6B7B8A", marginTop: 4, display: "block" }}>Preporučena veličina: 1200×630px</span>
        </Row>
        {seo.ogImage && (
          <div style={{ border: "1px solid #E2E8ED", borderRadius: 10, overflow: "hidden", maxWidth: 400 }}>
            <img src={seo.ogImage} alt="OG preview" style={{ width: "100%", display: "block" }} />
            <div style={{ padding: "10px 12px", background: "#F8FAFB", borderTop: "1px solid #E2E8ED" }}>
              <div style={{ fontSize: 12, color: "#6B7B8A", marginBottom: 2 }}>miaretailsolutions.com</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1D33", marginBottom: 2 }}>{seo.title.slice(0, 55)}{seo.title.length > 55 ? "..." : ""}</div>
              <div style={{ fontSize: 12, color: "#374151" }}>{seo.description.slice(0, 100)}{seo.description.length > 100 ? "..." : ""}</div>
            </div>
          </div>
        )}
        <Btn onClick={() => save("homepage_seo", seo)} saving={saving} label="Sačuvaj SEO" />
      </Sec></>}

      {/* ── HERO TEKST ── */}
      {tab === "hero" && <>
      <Sec title="Hero — Tekst i statistike" saved={saved === "homepage_hero"}>
        <Row label="Eyebrow badge">
          <TI value={hero.eyebrow} set={v => setHero({ ...hero, eyebrow: v })} />
        </Row>
        <Row label="H1 naslov (prvi dio)">
          <TI value={hero.h1} set={v => setHero({ ...hero, h1: v })} />
        </Row>
        <Row label="H1 istaknuti dio (teal boja)">
          <TI value={hero.h1Highlight} set={v => setHero({ ...hero, h1Highlight: v })} />
        </Row>
        <Row label="Subtitle tekst">
          <TA value={hero.subtitle} set={v => setHero({ ...hero, subtitle: v })} rows={3} />
        </Row>
        <Row label="Statistike">
          {hero.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <TI placeholder="Broj (200+)" value={s.num} set={v => {
                const st = [...hero.stats]; st[i] = { ...st[i], num: v }; setHero({ ...hero, stats: st });
              }} />
              <TI placeholder="Labela" value={s.label} set={v => {
                const st = [...hero.stats]; st[i] = { ...st[i], label: v }; setHero({ ...hero, stats: st });
              }} />
            </div>
          ))}
        </Row>
        <Btn onClick={() => save("homepage_hero", hero)} saving={saving} />
      </Sec>

      {/* ── SLIDESHOW ── */}
      <Sec title="Hero slideshow — Pozadinske slike" saved={saved === "homepage_hero_slides"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 14px" }}>
          Slike se rotiraju automatski u pozadini hero sekcije. Preporučena veličina: 1920×1080px.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {hero.slides.map((slide, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              {slide && <img src={slide} alt="" style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <ImageUpload
                  value={slide}
                  onChange={url => {
                    const slides = [...hero.slides]; slides[i] = url; setHero({ ...hero, slides });
                  }}
                  maxWidthPx={1920}
                  qualityWebp={0.85}
                />
              </div>
              <button onClick={() => {
                const slides = hero.slides.filter((_, idx) => idx !== i);
                setHero({ ...hero, slides });
              }} style={{ padding: "8px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={() => setHero({ ...hero, slides: [...hero.slides, ""] })}
          style={{ marginTop: 12, padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
          + Dodaj sliku
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => save("homepage_hero", hero)} saving={saving} label="Sačuvaj slideshow" />
        </div>
      </Sec></>}

      {/* ── VALUES ── */}
      {tab === "values" && <>
      <Sec title="Sekcija 'Šta radimo' — 3 kartice" saved={saved === "homepage_values"}>
        <Row label="Eyebrow badge"><TI value={values.eyebrow} set={v => setValues({ ...values, eyebrow: v })} /></Row>
        <Row label="H2 naslov (prvi dio)"><TI value={values.h2} set={v => setValues({ ...values, h2: v })} /></Row>
        <Row label="H2 istaknuti dio (teal)"><TI value={values.h2Highlight} set={v => setValues({ ...values, h2Highlight: v })} /></Row>
        <Row label="Opis ispod naslova"><TA value={values.desc} set={v => setValues({ ...values, desc: v })} rows={2} /></Row>
        <Row label="Kartice">
          {values.cards.map((card, i) => (
            <div key={i} style={{ padding: "14px 16px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F766E", marginBottom: 8 }}>Kartica {i + 1}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <TI placeholder="Naslov kartice" value={card.title} set={v => { const c = [...values.cards]; c[i] = { ...c[i], title: v }; setValues({ ...values, cards: c }); }} />
                <TA value={card.desc} set={v => { const c = [...values.cards]; c[i] = { ...c[i], desc: v }; setValues({ ...values, cards: c }); }} rows={2} />
              </div>
            </div>
          ))}
        </Row>
        <Btn onClick={() => save("homepage_values", values)} saving={saving} label="Sačuvaj sekciju" />
      </Sec></>}

      {/* ── REALIZACIJE ── */}
      {tab === "realizacije" && <>
      <Sec title="Tekst sekcije" saved={saved === "homepage_realizacije"}>
        <Row label="Eyebrow badge"><TI value={realizacije.eyebrow} set={v => setRealizacije({ ...realizacije, eyebrow: v })} /></Row>
        <Row label="H2 naslov (prvi dio)"><TI value={realizacije.h2} set={v => setRealizacije({ ...realizacije, h2: v })} /></Row>
        <Row label="H2 istaknuti dio (teal)"><TI value={realizacije.h2Highlight} set={v => setRealizacije({ ...realizacije, h2Highlight: v })} /></Row>
        <Row label="Opis ispod naslova"><TA value={realizacije.p} set={v => setRealizacije({ ...realizacije, p: v })} rows={2} /></Row>
        <Row label="Statistike">
          {realizacije.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <TI placeholder="Broj (12+)" value={s.num} set={v => { const st = [...realizacije.stats]; st[i] = { ...st[i], num: v }; setRealizacije({ ...realizacije, stats: st }); }} />
              <TI placeholder="Labela (Zemalja)" value={s.label} set={v => { const st = [...realizacije.stats]; st[i] = { ...st[i], label: v }; setRealizacije({ ...realizacije, stats: st }); }} />
              <button onClick={() => setRealizacije({ ...realizacije, stats: realizacije.stats.filter((_, idx) => idx !== i) })}
                style={{ padding: "8px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
          ))}
          <button onClick={() => setRealizacije({ ...realizacije, stats: [...realizacije.stats, { num: "", label: "" }] })}
            style={{ padding: "6px 14px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
            + Dodaj statistiku
          </button>
        </Row>
        <Row label="Dugme — tekst"><TI value={realizacije.btnLabel} set={v => setRealizacije({ ...realizacije, btnLabel: v })} /></Row>
        <Row label="Dugme — link"><TI value={realizacije.btnHref} set={v => setRealizacije({ ...realizacije, btnHref: v })} /></Row>
        <Btn onClick={() => save("homepage_realizacije", realizacije)} saving={saving} label="Sačuvaj tekst" />
      </Sec>

      <Sec title="Slideshow — pozadinske slike" saved={saved === "homepage_realizacije"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 14px" }}>
          Slike se rotiraju kao pozadina sekcije. Labela se prikazuje uz tačkice (npr. "EDEKA — Njemačka"). Preporučena veličina: 1920×1080px.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {realizacije.slides.map((slide, i) => (
            <div key={i} style={{ padding: "12px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0F766E" }}>Slajd {i + 1}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { if (i === 0) return; const sl = [...realizacije.slides]; [sl[i-1],sl[i]]=[sl[i],sl[i-1]]; setRealizacije({...realizacije,slides:sl}); }} disabled={i===0} style={{ padding:"4px 8px", background:"#E6EEF2", border:"none", borderRadius:5, cursor:i===0?"not-allowed":"pointer", opacity:i===0?0.4:1, fontSize:13 }}>↑</button>
                  <button onClick={() => { if (i===realizacije.slides.length-1) return; const sl=[...realizacije.slides]; [sl[i],sl[i+1]]=[sl[i+1],sl[i]]; setRealizacije({...realizacije,slides:sl}); }} disabled={i===realizacije.slides.length-1} style={{ padding:"4px 8px", background:"#E6EEF2", border:"none", borderRadius:5, cursor:i===realizacije.slides.length-1?"not-allowed":"pointer", opacity:i===realizacije.slides.length-1?0.4:1, fontSize:13 }}>↓</button>
                  <button onClick={() => setRealizacije({ ...realizacije, slides: realizacije.slides.filter((_, idx) => idx !== i) })}
                    style={{ padding: "4px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13 }}>✕</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                {slide.img && <img src={slide.img} alt="" style={{ width: 100, height: 64, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <label style={lbl}>Labela (prikazuje se uz tačkice)</label>
                    <input value={slide.alt} onChange={e => { const sl=[...realizacije.slides]; sl[i]={...sl[i],alt:e.target.value}; setRealizacije({...realizacije,slides:sl}); }} style={inp} placeholder="EDEKA — Njemačka" />
                  </div>
                  <ImageUpload value={slide.img} onChange={url => { const sl=[...realizacije.slides]; sl[i]={...sl[i],img:url}; setRealizacije({...realizacije,slides:sl}); }} maxWidthPx={1920} qualityWebp={0.85} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setRealizacije({ ...realizacije, slides: [...realizacije.slides, { img: "", alt: "" }] })}
          style={{ marginTop: 14, padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
          + Dodaj slajd
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => save("homepage_realizacije", realizacije)} saving={saving} label="Sačuvaj slideshow" />
        </div>
      </Sec></>}

      {/* ── INDUSTRIJE GRID ── */}
      {tab === "industries" && <>
      <Sec title="Sekcija 'Rješenja po industriji' — Naslov" saved={saved === "homepage_industries"}>
        <Row label="Eyebrow badge"><TI value={industries.eyebrow} set={v => setIndustries({ ...industries, eyebrow: v })} /></Row>
        <Row label="H2 naslov (prvi dio)"><TI value={industries.h2} set={v => setIndustries({ ...industries, h2: v })} /></Row>
        <Row label="H2 istaknuti dio (teal)"><TI value={industries.h2Highlight} set={v => setIndustries({ ...industries, h2Highlight: v })} /></Row>
      </Sec>
      <Sec title="Kartice industrija" saved={saved === "homepage_industries"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 14px" }}>
          Svaka kartica vodi na stranicu rješenja. Slika se prikazuje kao pozadina kartice — preporučena veličina: 800×600px.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {industries.cards.map((card, i) => (
            <div key={i} style={{ padding: "16px 18px", border: "1px solid #E2E8ED", borderRadius: 12, background: "#F8FAFB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0F766E" }}>Kartica {i + 1}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => {
                    if (i === 0) return;
                    const c = [...industries.cards]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; setIndustries({ ...industries, cards: c });
                  }} disabled={i === 0} style={{ padding: "4px 8px", background: "#E6EEF2", border: "none", borderRadius: 5, cursor: i === 0 ? "not-allowed" : "pointer", opacity: i === 0 ? 0.4 : 1, fontSize: 13 }}>↑</button>
                  <button onClick={() => {
                    if (i === industries.cards.length - 1) return;
                    const c = [...industries.cards]; [c[i], c[i + 1]] = [c[i + 1], c[i]]; setIndustries({ ...industries, cards: c });
                  }} disabled={i === industries.cards.length - 1} style={{ padding: "4px 8px", background: "#E6EEF2", border: "none", borderRadius: 5, cursor: i === industries.cards.length - 1 ? "not-allowed" : "pointer", opacity: i === industries.cards.length - 1 ? 0.4 : 1, fontSize: 13 }}>↓</button>
                  <button onClick={() => setIndustries({ ...industries, cards: industries.cards.filter((_, idx) => idx !== i) })}
                    style={{ padding: "4px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13 }}>✕</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={lbl}>Naslov kartice</label>
                  <input value={card.title} onChange={e => { const c = [...industries.cards]; c[i] = { ...c[i], title: e.target.value }; setIndustries({ ...industries, cards: c }); }} style={inp} placeholder="Supermarketi & Maloprodaja" />
                </div>
                <div>
                  <label style={lbl}>Link — odaberite stranicu</label>
                  {pageOptions.length > 1 ? (
                    <select
                      value={pageOptions.some(o => o.href === card.href) ? card.href : "__custom__"}
                      onChange={e => {
                        if (e.target.value === "__custom__") return;
                        const c = [...industries.cards]; c[i] = { ...c[i], href: e.target.value }; setIndustries({ ...industries, cards: c });
                      }}
                      style={{ ...inp, cursor: "pointer" }}
                    >
                      {pageOptions.map(o => <option key={o.href} value={o.href || "__custom__"}>{o.label}</option>)}
                      {!pageOptions.some(o => o.href === card.href) && card.href && (
                        <option value={card.href}>{card.href}</option>
                      )}
                    </select>
                  ) : (
                    <input value={card.href} onChange={e => { const c = [...industries.cards]; c[i] = { ...c[i], href: e.target.value }; setIndustries({ ...industries, cards: c }); }} style={inp} placeholder="/rjesenja/supermarketi" />
                  )}
                  {/* Manual override if custom URL needed */}
                  {pageOptions.length > 1 && !pageOptions.some(o => o.href === card.href) && (
                    <input value={card.href} onChange={e => { const c = [...industries.cards]; c[i] = { ...c[i], href: e.target.value }; setIndustries({ ...industries, cards: c }); }} style={{ ...inp, marginTop: 6 }} placeholder="ili unesite URL ručno..." />
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={lbl}>Kratki opis</label>
                <input value={card.desc} onChange={e => { const c = [...industries.cards]; c[i] = { ...c[i], desc: e.target.value }; setIndustries({ ...industries, cards: c }); }} style={inp} placeholder="Kratki opis koji se prikazuje na kartici..." />
              </div>
              <div>
                <label style={lbl}>Pozadinska slika</label>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {card.img && <img src={card.img} alt="" style={{ width: 100, height: 64, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <ImageUpload value={card.img} onChange={url => { const c = [...industries.cards]; c[i] = { ...c[i], img: url }; setIndustries({ ...industries, cards: c }); }} maxWidthPx={1200} qualityWebp={0.85} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setIndustries({ ...industries, cards: [...industries.cards, { href: "", img: "", title: "", desc: "" }] })}
          style={{ marginTop: 14, padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
          + Dodaj karticu
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => save("homepage_industries", industries)} saving={saving} label="Sačuvaj industrije" />
        </div>
      </Sec></>}

      {/* ── KLIJENTI KAROUSEL ── */}
      {tab === "clients" && <>
      <Sec title="Karousel klijenata — Logotipi" saved={saved === "homepage_clients"}>
        <p style={{ fontSize: 13, color: "#6B7B8A", margin: "0 0 14px" }}>
          Logotipi kompanija u traci ispod hero sekcije. Preporučena veličina: max 400×200px, transparentna pozadina (WebP/PNG).
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {clients.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", border: "1px solid #E2E8ED", borderRadius: 10, background: "#F8FAFB" }}>
              <div style={{ width: 80, height: 48, background: "#fff", border: "1px solid #E2E8ED", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                {c.src && <img src={c.src} alt={c.alt} style={{ maxWidth: 72, maxHeight: 40, objectFit: "contain" }} />}
              </div>
              <div style={{ flex: 1, display: "flex", gap: 8 }}>
                <div style={{ flex: 2 }}>
                  <label style={lbl}>URL logotipa</label>
                  <input value={c.src} onChange={e => {
                    const cl = [...clients]; cl[i] = { ...cl[i], src: e.target.value }; setClients(cl);
                  }} style={inp} placeholder="/assets/images/clients/..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Naziv kompanije</label>
                  <input value={c.alt} onChange={e => {
                    const cl = [...clients]; cl[i] = { ...cl[i], alt: e.target.value }; setClients(cl);
                  }} style={inp} placeholder="Lidl" />
                </div>
              </div>
              <button onClick={() => setClients(clients.filter((_, idx) => idx !== i))}
                style={{ padding: "8px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0, marginTop: 16 }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={() => setClients([...clients, { src: "", alt: "" }])}
          style={{ marginTop: 12, padding: "8px 16px", background: "#E6EEF2", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
          + Dodaj klijenta
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => save("homepage_clients", clients)} saving={saving} label="Sačuvaj karousel" />
        </div>
      </Sec></>}
    </div>
  );
}

function Sec({ title, children, saved }: { title: string; children: React.ReactNode; saved: boolean }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8ED", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFB" }}>
        <strong style={{ fontSize: 15, color: "#0B1D33" }}>{title}</strong>
        {saved && <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 500 }}>✓ Sačuvano</span>}
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>{children}</div>;
}
function TI({ value, set, placeholder }: { value: string; set: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" }} />;
}
function TA({ value, set, rows = 3 }: { value: string; set: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => set(e.target.value)} rows={rows} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block", resize: "vertical" }} />;
}
function Btn({ onClick, saving, label = "Sačuvaj sekciju" }: { onClick: () => void; saving: boolean; label?: string }) {
  return <button onClick={onClick} disabled={saving} style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>{saving ? "Čuvanje..." : label}</button>;
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1.5px solid #E2E8ED", borderRadius: 7, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
