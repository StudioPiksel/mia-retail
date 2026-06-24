import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Script from "next/script";

const RJESENJA: Record<string, {
  title: string; highlight: string; lead: string; bg: string;
  stats: { num: string; label: string }[];
  zones: { title: string; desc: string }[];
  cta: string;
}> = {
  "supermarketi": {
    title: "Supermarketi &", highlight: "Maloprodaja",
    lead: "Od malih convenience radnji do hipermarketa od 5.000 m² — projektujemo i opremamo prodajni prostor koji prodaje. Rashladni lanac, zona naplate, polični sistemi i logistika kupca, sve iz jedne ruke.",
    bg: "/assets/images/megamenu/supermarketi.jpg",
    stats: [{ num: "12+", label: "opremljenih objekata" }, { num: "15+", label: "zemalja isporuke" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Rashladni lanac", desc: "Rashladne vitrine, frižideri sa staklenim vratima i hladne komore za svjež i smrznut program." },
      { title: "Zona naplate", desc: "Kasa pultovi (standard, premium, convenience) i self-checkout rješenja za bržu naplatu." },
      { title: "Polični sistemi", desc: "Gondole, zidne police, pusheri, cjenovne šine i ESL elektronski cjenovnici." },
      { title: "Kolica i korpe", desc: "Samba kolica, žičana kolica i ručne korpe u boji brenda, otporne i ergonomske." },
      { title: "Svjež program", desc: "Vage, vitrine za voće i povrće, izložbeni stolovi i ambijentalna rasvjeta." },
      { title: "Inox i back-office", desc: "Radni stolovi, sudopere i oprema za pripremne zone i skladište." },
    ],
    cta: "Supermarketi & Maloprodaja",
  },
  "mesnice-ribarnice": {
    title: "Mesnice &", highlight: "Ribarnice",
    lead: "Rashladne vitrine, inox oprema i radne površine za svjež program. Kompletno opremanje mesnica i ribarnica — od rashladnog lanca do HACCP standarda.",
    bg: "/assets/images/megamenu/mesnice.jpg",
    stats: [{ num: "HACCP", label: "kompatibilna oprema" }, { num: "AISI 316", label: "nerđajući čelik" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Rashladne vitrine", desc: "Otvorene i zatvorene vitrine za svježe meso, ribu i prerađevine." },
      { title: "Inox oprema", desc: "Radni stolovi, sudopere i blokovi za sjeckanje od AISI 316 nerđajućeg čelika." },
      { title: "Hladne komore", desc: "Modularne hladne i zamrzivačke komore za skladištenje svježeg programa." },
      { title: "Vakuum pakovanje", desc: "Oprema za vakuum pakovanje i produžavanje roka trajanja." },
      { title: "Vage i etiketiranje", desc: "Profesionalne vage sa štampačima etiketa za svjež program." },
      { title: "Ambijentalna rasvjeta", desc: "Specijalna rasvjeta koja naglašava boje svježeg mesa i ribe." },
    ],
    cta: "Mesnice & Ribarnice",
  },
  "horeca": {
    title: "HoReCa &", highlight: "Ugostiteljstvo",
    lead: "Profesionalne kuhinje, šankovi i rashladni sistemi za restorane i hotele. Kompletna oprema za ugostiteljske objekte — od kuhinje do sale.",
    bg: "/assets/images/megamenu/horeca.jpg",
    stats: [{ num: "200+", label: "opremljenih objekata" }, { num: "15+", label: "godina iskustva" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Profesionalna kuhinja", desc: "Termička linija, rashladni ormari, radni stolovi i sudopere od nerđajućeg čelika." },
      { title: "Šankovi i barovi", desc: "Custom šankovi, rashladni ormari za piće i oprema za espresso stanice." },
      { title: "Rashladni sistemi", desc: "Rashladne vitrine za desert i piće, frižideri i zamrzivači za ugostiteljstvo." },
      { title: "Sala i servis", desc: "Oprema za servis i prezentaciju jela u sali." },
      { title: "Dostava i transport", desc: "Kolica za dostavu, GN posude i termos posude za transport hrane." },
      { title: "Higijenska oprema", desc: "Perilice posuđa, sanitarni čvorovi i dezinfekcija prema HACCP standardima." },
    ],
    cta: "HoReCa & Ugostiteljstvo",
  },
  "pekare": {
    title: "Pekare &", highlight: "Poslastičarnice",
    lead: "Vitrine za pekarski i poslastičarski program uz toplu prezentaciju. Rashladna i izložbena oprema za svježe i konditorske proizvode.",
    bg: "/assets/images/megamenu/pekare-v2.jpg",
    stats: [{ num: "Tople", label: "i rashladne vitrine" }, { num: "Custom", label: "dizajn po mjeri" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Izložbene vitrine", desc: "Tople i rashladne vitrine za prezentaciju pekarskog i poslastičarskog programa." },
      { title: "Rashladni regali", desc: "Police i regali za čuvanje i izlaganje svježih proizvoda." },
      { title: "Oprema za pripremu", desc: "Radni stolovi, lampe za grijanje i oprema za pripremu tijesta." },
      { title: "Ambalažna oprema", desc: "Vrećice, kutije i oprema za pakovanje proizvoda." },
      { title: "Kasa i naplatni pult", desc: "Kompaktni kasa pultovi prilagođeni manjim objektima." },
      { title: "Ambijentalna rasvjeta", desc: "Topla rasvjeta koja naglašava boje pekarskih i konditorskih proizvoda." },
    ],
    cta: "Pekare & Poslastičarnice",
  },
  "apoteke-drogerije": {
    title: "Apoteke &", highlight: "Drogerije",
    lead: "Polični sistemi, pultovi i rasvjeta za uredan i pregledan prostor. Moderna oprema za prezentaciju farmaceutskih i kozmetičkih proizvoda.",
    bg: "/assets/images/megamenu/apoteke.jpg",
    stats: [{ num: "Modularni", label: "polični sistemi" }, { num: "Custom", label: "boje i dimenzije" }, { num: "Na ključ", label: "projekat → montaža" }],
    zones: [
      { title: "Polični sistemi", desc: "Modularni polični sistemi sa mogućnošću prilagođavanja bojama brenda." },
      { title: "Prodajni pultovi", desc: "Pultovi za savjetovanje i prodaju farmaceutskih proizvoda." },
      { title: "Rashladna oprema", desc: "Vitrine i frižideri za čuvanje termolabilnih preparata." },
      { title: "Izlozi i prezentatori", desc: "Izložbeni prezentatori i stalci za kozmetičke i OTC proizvode." },
      { title: "Kasa i naplatni sistem", desc: "Kompaktni kasa pultovi za farmaceutsku prodaju." },
      { title: "Rasvjeta", desc: "Profesionalna rasvjeta koja naglašava proizvode i čini prostor ugodnim." },
    ],
    cta: "Apoteke & Drogerije",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = RJESENJA[slug];
  if (!page) return {};
  return {
    title: `${page.title.replace("&", "&")} ${page.highlight} | MIA Retail Solutions`,
    description: page.lead,
  };
}

export default async function RjesenjaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = RJESENJA[slug];
  if (!page) notFound();

  const otherRjesenja = Object.entries(RJESENJA)
    .filter(([s]) => s !== slug)
    .map(([s, r]) => ({ slug: s, title: `${r.title} ${r.highlight}` }));

  return (
    <SiteLayout currentPage={`/rjesenja/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* HERO */}
      <section className="solution-hero solution-hero--photo">
        <div className="solution-hero-bg" style={{ backgroundImage: `url('${page.bg}')` }}></div>
        <div className="container">
          <div className="solution-hero-inner">
            <div className="solution-hero-text">
              <nav className="breadcrumb" aria-label="Putanja">
                <Link href="/">Početna</Link> <span>/</span>{" "}
                <span>Rješenja</span> <span>/</span>{" "}
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
            <p>Pokrivamo svaku zonu — od ulaza do skladišta.</p>
          </div>
          <div className="zones-grid">
            {page.zones.map((z) => (
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

      {/* CTA */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Opremite vaš {page.cta} objekat</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Naš tim stoji na raspolaganju za besplatne konsultacije i odabir prave opreme.
          </p>
          <Link href="/kontakt" className="btn-primary">Zatražite besplatnu procjenu →</Link>
        </div>
      </section>

      {/* OTHER RJESENJA */}
      <section style={{ padding: "60px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <span className="section-eyebrow">Ostala rješenja</span>
            <h2>Radimo i za <span className="highlight">druge industrije</span></h2>
          </div>
          <div className="industries-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {otherRjesenja.map(({ slug: s, title }) => (
              <Link key={s} href={`/rjesenja/${s}`} style={{
                display: "block", padding: "20px 24px", background: "#fff",
                borderRadius: 12, border: "1px solid var(--gray-200)",
                textDecoration: "none", color: "var(--navy)", fontWeight: 600, fontSize: 15,
                transition: "box-shadow 0.2s"
              }}>
                {title} →
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Script src="/rjesenja.js" strategy="afterInteractive" />
    </SiteLayout>
  );
}
