import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SETTINGS: Record<string, unknown> = {
  // ── Utility bar ──
  utility_phone: "+382 67 038 777",
  utility_email: "info@miaretailsolutions.com",
  utility_location: "Podgorica, Crna Gora",
  utility_hours: "Pon — Pet: 08:00 — 17:00",
  site_name: "MIA Retail Solutions",
  logo_url: "/assets/images/logo/mia-retail-solutions-vectorized-clean.svg",
  footer_tagline: "Partner za opremanje maloprodajnih i HoReCa objekata na ključ. Projektujemo, isporučujemo i montiramo — na rok i bez kompromisa.",
  footer_address: "Cetinjski put bb, 81000 Podgorica, Crna Gora",

  // ── WhatsApp ──
  whatsapp_number: "+38267038777",
  whatsapp_message: "Zdravo, zanima me vaša ponuda za opremanje.",

  // ── Mega menu ──
  megamenu_rjesenja: [
    { slug:"supermarketi", title:"Supermarketi & Maloprodaja", sub:"Rashlada · Checkout · Police · Kolica", img:"/assets/images/megamenu/supermarketi.jpg", desc:"Kompletno opremanje objekata od 200 do 5.000 m² — rashlada, checkout, police i kolica." },
    { slug:"mesnice-ribarnice", title:"Mesnice & Ribarnice", sub:"Vitrine · Inox · Radne površine", img:"/assets/images/megamenu/mesnice.jpg", desc:"Rashladne vitrine, inox oprema i radne površine za svjež program." },
    { slug:"horeca", title:"HoReCa & Ugostiteljstvo", sub:"Kuhinje · Šankovi · Rashlada", img:"/assets/images/megamenu/horeca.jpg", desc:"Profesionalne kuhinje, šankovi i rashladni sistemi za restorane i hotele." },
    { slug:"pekare", title:"Pekare & Poslastičarnice", sub:"Tople vitrine · Izlozi · Police", img:"/assets/images/megamenu/pekare-v2.jpg", desc:"Vitrine za pekarski i poslastičarski program uz toplu prezentaciju." },
    { slug:"apoteke-drogerije", title:"Apoteke & Drogerije", sub:"Police · Pultovi · Rasvjeta", img:"/assets/images/megamenu/apoteke.jpg", desc:"Polični sistemi, pultovi i rasvjeta za uredan i pregledan prostor." },
  ],
  megamenu_proizvodi: [
    { slug:"rashladne-vitrine", title:"Rashladne vitrine", sub:"CURVE · CUBE · zakrivljeno i ravno staklo", img:"/assets/images/megamenu/thumb-rashladna.jpg" },
    { slug:"frizideri-komore", title:"Frižideri & komore", sub:"Uspravni · staklena vrata · hladne komore", img:"/assets/images/megamenu/thumb-frizideri.jpg" },
    { slug:"checkout-kase", title:"Checkout & Kasa pultovi", sub:"Standard · Premium · SmartPos · Netris", img:"/assets/images/megamenu/thumb-kasa.jpg" },
    { slug:"policni-sistemi", title:"Polični sistemi", sub:"Gondole · pusheri · cjenovne šine · LED", img:"/assets/images/megamenu/thumb-polica.jpg" },
    { slug:"kolica-korpe", title:"Kolica & Korpe", sub:"Samba · žičana · korpe · trolley", img:"/assets/images/megamenu/thumb-kolica.jpg" },
    { slug:"inox-kuhinja", title:"Inox & Kuhinjska oprema", sub:"Radni stolovi · sudopere · termička linija", img:"/assets/images/megamenu/thumb-inox.jpg" },
    { slug:"usmjeravanje", title:"Usmjeravanje kupaca", sub:"Ulazne rampe · turniketi · barijere · ITAB", img:"/assets/images/megamenu/thumb-usmjeravanje.jpg" },
  ],

  // ── Rješenja stranice ──
  rjesenja_pages: [
    { slug:"supermarketi", label:"Supermarketi & Maloprodaja", bg:"/assets/images/megamenu/supermarketi.jpg" },
    { slug:"mesnice-ribarnice", label:"Mesnice & Ribarnice", bg:"/assets/images/megamenu/mesnice.jpg" },
    { slug:"horeca", label:"HoReCa & Ugostiteljstvo", bg:"/assets/images/megamenu/horeca.jpg" },
    { slug:"pekare", label:"Pekare & Poslastičarnice", bg:"/assets/images/megamenu/pekare-v2.jpg" },
    { slug:"apoteke-drogerije", label:"Apoteke & Drogerije", bg:"/assets/images/megamenu/apoteke.jpg" },
  ],

  rjesenja_supermarketi_hero: { eyebrow:"Rješenja po industriji", h1:"Supermarketi &", h1Highlight:"Maloprodaja", lead:"Od malih convenience radnji do hipermarketa od 5.000 m² — projektujemo i opremamo prodajni prostor koji prodaje.", heroBg:"/assets/images/megamenu/supermarketi.jpg", stats:[{num:"12+",label:"opremljenih objekata"},{num:"15+",label:"zemalja isporuke"},{num:"Na ključ",label:"projekat → montaža"}], ghostLabel:"Pogledajte realizacije", ghostHref:"/realizacije" },
  rjesenja_supermarketi_zones: { badge:"Obim opremanja", h2:"Šta opremamo u supermarketu", desc:"Pokrivamo svaku zonu objekta.", items:[{title:"Rashladni lanac",desc:"Rashladne vitrine, frižideri i hladne komore."},{title:"Zona naplate",desc:"Kasa pultovi i self-checkout."},{title:"Polični sistemi",desc:"Gondole, pusheri, cjenovne šine."},{title:"Kolica i korpe",desc:"Samba kolica i ručne korpe."},{title:"Svjež program",desc:"Vage, vitrine za voće i povrće."},{title:"Inox i back-office",desc:"Radni stolovi i sudopere."}] },
  rjesenja_supermarketi_realizacije: { items:[{img:"/assets/images/reference/Carrefour_France.jpg",label:"Carrefour — Francuska"},{img:"/assets/images/reference/Conad_Italy.jpg",label:"Conad — Italija"},{img:"/assets/images/reference/EDEKA_Germany.jpg",label:"EDEKA — Njemačka"}] },
  rjesenja_supermarketi_cta: { h2:"Planirate novi supermarket ili redizajn postojećeg?", p:"Naš tim projektuje, isporučuje i montira opremu na ključ." },

  rjesenja_mesnice_ribarnice_hero: { eyebrow:"Rješenja po industriji", h1:"Mesnice &", h1Highlight:"Ribarnice", lead:"Svjež program traži preciznost. Opremamo mesnice i ribarnice rashladnim vitrinama sa tačnim temperaturnim režimom.", heroBg:"/assets/images/megamenu/mesnice.jpg", stats:[{num:"0–+8°C",label:"kontrolisan režim"},{num:"AISI 316",label:"za vlažne zone"},{num:"Na ključ",label:"projekat → montaža"}], ghostLabel:"Pogledajte realizacije", ghostHref:"/realizacije" },
  rjesenja_mesnice_ribarnice_zones: { badge:"Obim opremanja", h2:"Šta opremamo u mesnici", desc:"Pokrivamo svaku zonu.", items:[{title:"Izložbene vitrine",desc:"Servisne vitrine sa vlažnim hlađenjem."},{title:"Inox radne površine",desc:"Radni stolovi od AISI 304/316."},{title:"Sudopere i higijena",desc:"Sudopere i higijenske stanice."},{title:"Hladne komore",desc:"Komore za čuvanje programa."},{title:"Priprema i mljevenje",desc:"Oprema za mljevenje i pakovanje."},{title:"Rasvjeta programa",desc:"LED rasvjeta za prikaz mesa i ribe."}] },
  rjesenja_mesnice_ribarnice_realizacije: { items:[{img:"/assets/images/reference/Panaro_Carrefour_Market.jpg",label:"Panaro — Carrefour Market"},{img:"/assets/images/reference/Conad_Italy_1.jpg",label:"Conad — Italija"},{img:"/assets/images/reference/EDEKA_Germany_2.jpg",label:"EDEKA — Njemačka"}] },
  rjesenja_mesnice_ribarnice_cta: { h2:"Opremate mesnicu ili ribarnicu?", p:"Naš tim projektuje, isporučuje i montira opremu na ključ." },

  rjesenja_horeca_hero: { eyebrow:"Rješenja po industriji", h1:"HoReCa &", h1Highlight:"Ugostiteljstvo", lead:"Restorani, kafići i hoteli traže opremu koja radi pod pritiskom servisa.", heroBg:"/assets/images/megamenu/horeca.jpg", stats:[{num:"Pro linija",label:"termička oprema"},{num:"AISI inox",label:"radne zone"},{num:"Na ključ",label:"projekat → montaža"}], ghostLabel:"Pogledajte realizacije", ghostHref:"/realizacije" },
  rjesenja_horeca_zones: { badge:"Obim opremanja", h2:"Šta opremamo u HoReCa objektu", desc:"Pokrivamo svaku zonu.", items:[{title:"Termička linija",desc:"Šporeti, friteze, roštilji, bain-marie."},{title:"Inox priprema",desc:"Radni stolovi i sudopere od AISI inoxa."},{title:"Šank i rashlada",desc:"Šankovi i podpultne rashladne jedinice."},{title:"Pranje posuđa",desc:"Mašine za pranje posuđa."},{title:"Skladištenje",desc:"Hladne komore i police."},{title:"Serviranje",desc:"Topla i hladna vitrina za serviranje."}] },
  rjesenja_horeca_realizacije: { items:[{img:"/assets/images/projects/RestoranVojvodeStepe.jpg",label:"Restoran Vojvode Stepe"},{img:"/assets/images/projects/KafeSoljica3.jpg",label:"Kafe Šoljica"}] },
  rjesenja_horeca_cta: { h2:"Otvarate restoran, kafić ili hotel?", p:"Naš tim projektuje, isporučuje i montira opremu na ključ." },

  rjesenja_pekare_hero: { eyebrow:"Rješenja po industriji", h1:"Pekare &", h1Highlight:"Poslastičarnice", lead:"Hljeb, peciva i kolači prodaju se očima.", heroBg:"/assets/images/megamenu/pekare-v2.jpg", stats:[{num:"Topla/hladna",label:"vitrine"},{num:"LED izlog",label:"vjeran prikaz"},{num:"Na ključ",label:"projekat → montaža"}], ghostLabel:"Pogledajte realizacije", ghostHref:"/realizacije" },
  rjesenja_pekare_zones: { badge:"Obim opremanja", h2:"Šta opremamo u pekari", desc:"Pokrivamo svaku zonu.", items:[{title:"Tople vitrine",desc:"Vitrine za peciva i hljeb."},{title:"Vitrine za kolače",desc:"Rashladne i panoramske vitrine."},{title:"Izlozi i police",desc:"Regali za hljeb i pakovani program."},{title:"Inox priprema",desc:"Radni stolovi za back-office."},{title:"Rashlada sirovina",desc:"Frižideri za sirovine."},{title:"Rasvjeta",desc:"Topla LED rasvjeta."}] },
  rjesenja_pekare_realizacije: { items:[{img:"/assets/images/reference/Globus_Pilsen.jpg",label:"Globus — Pilsen"},{img:"/assets/images/reference/BILLA_Czech.jpg",label:"BILLA — Češka"},{img:"/assets/images/reference/Poppy_Budapest.jpg",label:"Poppy — Budimpešta"}] },
  rjesenja_pekare_cta: { h2:"Opremate pekaru ili poslastičarnicu?", p:"Naš tim projektuje, isporučuje i montira opremu na ključ." },

  rjesenja_apoteke_drogerije_hero: { eyebrow:"Rješenja po industriji", h1:"Apoteke &", h1Highlight:"Drogerije", lead:"Apoteke i drogerije traže red, preglednost i povjerenje.", heroBg:"/assets/images/megamenu/apoteke.jpg", stats:[{num:"Modularno",label:"polični sistemi"},{num:"Rashlada",label:"za osjetljive lijekove"},{num:"Na ključ",label:"projekat → montaža"}], ghostLabel:"Pogledajte realizacije", ghostHref:"/realizacije" },
  rjesenja_apoteke_drogerije_zones: { badge:"Obim opremanja", h2:"Šta opremamo u apoteci", desc:"Pokrivamo svaku zonu.", items:[{title:"Polični sistemi",desc:"Police sa cjenovnim šinama."},{title:"Pultovi za izdavanje",desc:"Apotekarski pultovi."},{title:"Rashlada lijekova",desc:"Farmaceutski frižideri."},{title:"Rasvjeta",desc:"LED rasvjeta."},{title:"Zona čekanja",desc:"Diskretna zona za klijente."},{title:"Skladište",desc:"Police za magacin."}] },
  rjesenja_apoteke_drogerije_realizacije: { items:[{img:"/assets/images/reference/Pharmacie_Dammarie_France.jpg",label:"Pharmacie — Francuska"},{img:"/assets/images/reference/Sephora.jpg",label:"Sephora"},{img:"/assets/images/reference/Sephora_2.jpg",label:"Sephora"}] },
  rjesenja_apoteke_drogerije_cta: { h2:"Opremate apoteku ili drogeriju?", p:"Naš tim projektuje, isporučuje i montira opremu na ključ." },

  // ── O nama ──
  onama_hero: { eyebrow:"O nama", h1:"Vaš partner za opremanje", h1Highlight:"na ključ", lead:"MIA Retail Solutions spaja vodeće svjetske proizvođače retail i HoReCa opreme sa lokalnim znanjem, projektovanjem i montažom.", heroBg:"/assets/images/megamenu/supermarketi.jpg", stats:[{num:"15+",label:"godina iskustva"},{num:"10+",label:"partnerskih brendova"},{num:"Na ključ",label:"projekat → montaža"}], ctaLabel:"Zatražite ponudu", ctaHref:"/kontakt" },
  onama_intro: { badge:"Ko smo", h2:"Oprema je investicija — mi je činimo isplativom", p1:"MIA Retail Solutions je kompanija specijalizovana za opremanje maloprodajnih, ugostiteljskih i specijalizovanih objekata.", p2:"Naša snaga je u kombinaciji vrhunske opreme i lokalnog znanja.", image:"/assets/images/megamenu/horeca.jpg", btnLabel:"Pogledajte naše realizacije", btnHref:"/realizacije" },
  onama_values: [{title:"Partnerstvo, ne prodaja",desc:"Ne prodajemo katalog — gradimo dugoročan odnos."},{title:"Kvalitet bez kompromisa",desc:"Sarađujemo isključivo sa provjerenim svjetskim proizvođačima."},{title:"Rješenje na ključ",desc:"Projektovanje, isporuka, montaža i servis na jednom mjestu."},{title:"Poštovanje rokova",desc:"Otvaranje objekta ne trpi kašnjenje."}],
  onama_process: [{num:"01",title:"Analiza i konsultacija",desc:"Upoznajemo vaš prostor, asortiman i budžet."},{num:"02",title:"Idejni koncept i tlocrt",desc:"Predlažemo raspored zona, opremu i tok kupca."},{num:"03",title:"Ponuda i ugovaranje",desc:"Transparentna ponuda. Bez skrivenih troškova."},{num:"04",title:"Isporuka i montaža",desc:"Koordinišemo isporuku i ugradnju."},{num:"05",title:"Predaja i podrška",desc:"Predajemo objekat spreman za rad."}],
  onama_partner: { badge:"Dizajn partner", h2:"Enterijer i idejni koncept uz partnerske studije", p:"Za projektovanje enterijera sarađujemo sa renomiranim dizajn studijima.", btnLabel:"Dizajn enterijera", btnHref:"/dizajn-enterijera" },
  onama_cta: { h2:"Spremni za novi projekat?", p:"Bilo da otvarate novi objekat ili renovirate postojeći — tu smo." },

  // ── Pomoć u izboru ──
  pomoc_hero: { eyebrow:"Pomoć u izboru", h1:"Ne znate odakle da", h1Highlight:"krenete?", lead:"Izbor opreme zavisi od tipa objekta, površine, asortimana i budžeta.", heroBg:"/assets/images/megamenu/supermarketi.jpg", stats:[{num:"4 koraka",label:"do prave opreme"},{num:"Besplatno",label:"stručno vođenje"},{num:"Na ključ",label:"od savjeta do montaže"}], ctaLabel:"Zatražite konsultaciju", ctaHref:"/kontakt" },
  pomoc_steps: [{num:"1",title:"Koji je tip vašeg objekta?",desc:"Supermarket, mesnica, HoReCa, pekara ili apoteka.",chips:[{label:"Supermarket / Maloprodaja",href:"/rjesenja/supermarketi"},{label:"Mesnice & Ribarnice",href:"/rjesenja/mesnice-ribarnice"},{label:"HoReCa & Ugostiteljstvo",href:"/rjesenja/horeca"},{label:"Pekare & Poslastičarnice",href:"/rjesenja/pekare"},{label:"Apoteke & Drogerije",href:"/rjesenja/apoteke-drogerije"}]},{num:"2",title:"Kolika je površina i raspored?",desc:"Površina određuje dužinu rashladnih linija, broj kasa i raspored polica.",chips:[]},{num:"3",title:"Šta je vaš ključni asortiman?",desc:"Svjež program traži pojačan rashladni lanac; suvi program traži gondole.",chips:[]},{num:"4",title:"Koji je budžet i rok?",desc:"Definišemo prioritete i pravimo ponudu koja balansira kvalitet i investiciju.",chips:[]}],
  pomoc_help: { badge:"Još uvijek niste sigurni?", h2:"Prepustite izbor stručnjacima", p:"Pošaljite nam osnovne podatke o objektu — besplatno pripremamo prijedlog konfiguracije.", btn1Label:"Zatražite konsultaciju", btn1Href:"/kontakt", btn2Label:"Pogledajte realizacije", btn2Href:"/realizacije" },

  // ── Kontakt ──
  kontakt_page: { hero:{ eyebrow:"Kontaktirajte nas", h1:"Razgovarajmo o", h1Highlight:"vašem projektu", lead:"Dostupni smo za sve upite — od prve konsultacije do isporuke i servisa." }, info:{ address:"Cetinjski put bb\n81000 Podgorica, Crna Gora", phone:"+382 67 038 777", email:"info@miaretailsolutions.com", hours:"Pon — Pet: 08:00 — 17:00" }, cta:{ h2:"Pošaljite upit", p:"Odgovaramo u roku od 24 sata." } },
};

async function main() {
  let count = 0;
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.settings.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    count++;
  }
  console.log(`✅ Seeded ${count} settings`);
  const total = await prisma.settings.count();
  console.log(`📊 Total settings in DB: ${total}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
