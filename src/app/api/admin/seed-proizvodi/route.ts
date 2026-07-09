import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STD_REALIZACIJE = [
  { img: "/assets/images/reference/EDEKA_Germany.jpg", label: "EDEKA — Njemačka" },
  { img: "/assets/images/reference/Conad_Italy.jpg", label: "Conad — Italija" },
  { img: "/assets/images/reference/Carrefour_France.jpg", label: "Carrefour — Francuska" },
  { img: "/assets/images/reference/Globus_Pilsen.jpg", label: "Globus — Pilsen" },
  { img: "/assets/images/reference/Sephora.jpg", label: "Sephora" },
  { img: "/assets/images/reference/Poppy_Budapest.jpg", label: "Poppy — Budimpešta" },
];

const CONFIG: Record<string, {
  eyebrow: string; h1: string; highlight: string; lead: string;
  stats: { num: string; label: string }[];
  ghostBtn?: string; ghostHref?: string;
  feature: { img: string; badge: string; h2: string; p: string; li: string[] };
  ctaTitle: string;
  realizacije?: { img: string; label: string }[];
}> = {
  "rashladne-vitrine": {
    eyebrow: "Proizvodi", h1: "Rashladne", highlight: "vitrine",
    lead: "Rashladne vitrine namijenjene su za atraktivno izlaganje i čuvanje svježih prehrambenih proizvoda pri optimalnoj temperaturi. Zahvaljujući modernom dizajnu, velikim staklenim površinama i efikasnom rashladnom sistemu, omogućavaju odličnu preglednost proizvoda uz očuvanje njihove svježine, kvalitata i prezentacije. Idealne su za supermarkete, delikatese, pekare, mesnice, poslastičarnice, kafiće i druge maloprodajne objekte. Dostupne su u različitim dimenzijama i konfiguracijama kako bi se prilagodile potrebama svakog prodajnog prostora.",
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
    realizacije: STD_REALIZACIJE,
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
    realizacije: STD_REALIZACIJE,
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
    realizacije: STD_REALIZACIJE,
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
    realizacije: STD_REALIZACIJE,
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
    realizacije: STD_REALIZACIJE,
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
    realizacije: STD_REALIZACIJE,
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
    realizacije: STD_REALIZACIJE,
  },
};

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries: { key: string; value: string }[] = [];

  for (const [slug, cfg] of Object.entries(CONFIG)) {
    const hero = {
      eyebrow: cfg.eyebrow,
      h1: cfg.h1,
      h1Highlight: cfg.highlight,
      lead: cfg.lead,
      heroBg: "",
      stats: cfg.stats,
      ghostLabel: cfg.ghostBtn ?? "",
      ghostHref: cfg.ghostHref ?? "",
    };
    const feature = {
      badge: cfg.feature.badge,
      h2: cfg.feature.h2,
      p: cfg.feature.p,
      li: cfg.feature.li,
      img: cfg.feature.img,
    };
    const cta = {
      h2: cfg.ctaTitle,
      p: "Kontaktirajte nas za besplatnu konsultaciju i ponudu.",
    };

    entries.push(
      { key: `proizvodi_${slug}_hero`, value: JSON.stringify(hero) },
      { key: `proizvodi_${slug}_feature`, value: JSON.stringify(feature) },
      { key: `proizvodi_${slug}_cta`, value: JSON.stringify(cta) },
    );
  }

  // Only insert if key doesn't already exist (don't overwrite admin edits)
  const existingKeys = new Set(
    (await prisma.settings.findMany({ where: { key: { in: entries.map(e => e.key) } }, select: { key: true } }))
      .map(s => s.key)
  );

  const toInsert = entries.filter(e => !existingKeys.has(e.key));

  if (toInsert.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: "Svi podaci već postoje u bazi." });
  }

  await prisma.$transaction(
    toInsert.map(({ key, value }) =>
      prisma.settings.create({ data: { key, value } })
    )
  );

  return NextResponse.json({ ok: true, inserted: toInsert.length, skipped: existingKeys.size });
}
