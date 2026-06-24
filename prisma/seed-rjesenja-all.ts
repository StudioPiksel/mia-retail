import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const KATALOG = path.join(__dirname, "../public/assets/images/katalog");

function imgs(folder: string, sub: string): string[] {
  const dir = path.join(KATALOG, folder, sub);
  if (!fs.existsSync(dir)) { console.warn(`  ⚠️  Missing: ${folder}/${sub}`); return []; }
  return fs.readdirSync(dir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f)).sort()
    .map(f => `/assets/images/katalog/${folder}/${sub}/${f}`);
}

async function upsertProduct(title: string, series: string, specs: string[], folder: string, sub: string, catId: string, order: number) {
  const images = imgs(folder, sub);
  const existing = await prisma.product.findFirst({ where: { title, categoryId: catId } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data: { images: JSON.stringify(images), series, specs: JSON.stringify(specs), order } });
    return existing.id;
  }
  const p = await prisma.product.create({ data: { title, series, specs: JSON.stringify(specs), images: JSON.stringify(images), categoryId: catId, order, published: true } });
  return p.id;
}

async function setItems(rjesenjaSlug: string, items: { id: string; order: number }[]) {
  await prisma.rjesenjaItem.deleteMany({ where: { rjesenjaSlug } });
  for (const { id, order } of items) {
    await prisma.rjesenjaItem.create({ data: { rjesenjaSlug, productId: id, order } });
  }
  console.log(`✅ ${rjesenjaSlug}: ${items.length} items set`);
}

async function main() {
  const cats = await prisma.productCategory.findMany();
  const cat = Object.fromEntries(cats.map(c => [c.slug, c.id]));

  // ── MESNICE & RIBARNICE ────────────────────────────────────────────
  console.log("\n📁 Mesnice & Ribarnice");
  const m: { id: string; order: number }[] = [];
  // Rashladne vitrine
  m.push({ id: await upsertProduct("Rashladna vitrina — staklena vrata", "Vitrina", ["Staklena vrata"], "rashlada", "vitrina-staklena-vrata", cat["rashladne-vitrine"], 200), order: 0 });
  m.push({ id: await upsertProduct("Vertikalna vitrina — staklena vrata", "Vertikalna", ["LED", "Niska potrošnja"], "rashlada", "vitrina-vertikalna-staklena", cat["rashladne-vitrine"], 201), order: 1 });
  m.push({ id: await upsertProduct("Vitrina za kolače i torte", "Torte", ["Za poslastice"], "rashlada", "vitrina-za-torte-kolace", cat["rashladne-vitrine"], 202), order: 2 });
  m.push({ id: await upsertProduct("Mini vitrina — inox", "Mini Inox", ["Inox"], "rashlada", "mini-vitrina-inox", cat["rashladne-vitrine"], 203), order: 3 });
  // Inox
  m.push({ id: await upsertProduct("Inox radni stolovi i pultovi", "Inox", ["AISI 304/316"], "inox", "radni-stolovi", cat["inox-kuhinja"], 200), order: 10 });
  m.push({ id: await upsertProduct("Sudopere i umivaonici", "Sudopera", ["AISI 304"], "inox", "sudopere", cat["inox-kuhinja"], 201), order: 11 });
  m.push({ id: await upsertProduct("Mesoreznice", "Professional", ["Mesoreznica"], "inox", "mesoreznica", cat["inox-kuhinja"], 202), order: 12 });
  m.push({ id: await upsertProduct("Mlinovi za meso", "Mlin", ["Mlin za meso"], "inox", "mlin-meso", cat["inox-kuhinja"], 203), order: 13 });
  // Frižideri
  m.push({ id: await upsertProduct("Profesionalni zamrzivač", "Profesionalni", ["Zamrzivač"], "rashlada", "zamrzivac-profesionalni", cat["frizideri-komore"], 200), order: 20 });
  m.push({ id: await upsertProduct("Vertikalni frižider — puna vrata", "Vertikalni", ["Puna vrata"], "rashlada", "frizider-vertikalni-puna-vrata", cat["frizideri-komore"], 201), order: 21 });
  m.push({ id: await upsertProduct("Profesionalni rashladni ormar", "Profesionalni", ["Ormar"], "rashlada", "ormar-profesionalni-puna-vrata", cat["frizideri-komore"], 202), order: 22 });
  m.push({ id: await upsertProduct("Podpultni frižideri", "Podpultni", ["Podpultni"], "rashlada", "podpultni-frizider", cat["frizideri-komore"], 203), order: 23 });
  // Polični
  m.push({ id: await upsertProduct("Cjenovne šine", "Slimline", ["Slimline"], "polica", "cjenovne-sine", cat["policni-sistemi"], 200), order: 30 });
  m.push({ id: await upsertProduct("Držači za ESL cjenovnike", "ESL", ["ESL"], "polica", "esl-drzaci", cat["policni-sistemi"], 201), order: 31 });
  m.push({ id: await upsertProduct("Nadznaci za prolaze", "Nadznak", ["Komunikacija"], "polica", "nadznaci-oznake", cat["policni-sistemi"], 202), order: 32 });
  m.push({ id: await upsertProduct("Ramovi i stalci", "Rám", ["Komunikacija"], "polica", "ramovi-stalci", cat["policni-sistemi"], 203), order: 33 });
  await setItems("mesnice-ribarnice", m);

  // ── HORECA ────────────────────────────────────────────────────────
  console.log("\n📁 HoReCa");
  const h: { id: string; order: number }[] = [];
  // Termička
  h.push({ id: await upsertProduct("Električne friteze", "Friteza", ["Termička"], "inox", "friteza", cat["inox-kuhinja"], 300), order: 0 });
  h.push({ id: await upsertProduct("Roštilji i grilovi", "Gril", ["Roštilj"], "inox", "rostilj-gril", cat["inox-kuhinja"], 301), order: 1 });
  h.push({ id: await upsertProduct("Bain-marie", "Bain-marie", ["Topla linija"], "inox", "bain-marie", cat["inox-kuhinja"], 302), order: 2 });
  h.push({ id: await upsertProduct("Roštilj na ćumur", "Ćumur", ["Roštilj na ćumur"], "inox", "rostilj-cumur", cat["inox-kuhinja"], 303), order: 3 });
  // Rerne
  h.push({ id: await upsertProduct("Kombi rerne", "Kombi", ["Kombi"], "inox", "combi-rerna", cat["inox-kuhinja"], 304), order: 10 });
  h.push({ id: await upsertProduct("Konvekcijske rerne", "Konvekcija", ["Konvekcija"], "inox", "konvekcijska-rerna", cat["inox-kuhinja"], 305), order: 11 });
  h.push({ id: await upsertProduct("Pizza peći", "Pizza", ["Pizza"], "inox", "pizza-pec", cat["inox-kuhinja"], 306), order: 12 });
  h.push({ id: await upsertProduct("Mikrotalasne peći", "Mikro", ["Mikrotalasna"], "inox", "mikrotalasna", cat["inox-kuhinja"], 307), order: 13 });
  // Inox priprema
  h.push({ id: await upsertProduct("Inox radni stolovi i pultovi", "Inox", ["AISI 304/316"], "inox", "radni-stolovi", cat["inox-kuhinja"], 308), order: 20 });
  h.push({ id: await upsertProduct("Sudopere i umivaonici", "Sudopera", ["AISI 304"], "inox", "sudopere", cat["inox-kuhinja"], 309), order: 21 });
  h.push({ id: await upsertProduct("Mašine za pranje posuđa", "Dishwasher", ["Mašinsko pranje"], "inox", "masina-sudje", cat["inox-kuhinja"], 310), order: 22 });
  h.push({ id: await upsertProduct("Nape i ventilacija", "Napa", ["Ventilacija"], "inox", "nape", cat["inox-kuhinja"], 311), order: 23 });
  // Frižideri
  h.push({ id: await upsertProduct("Podpultni frižideri", "Podpultni", ["Podpultni"], "rashlada", "podpultni-frizider", cat["frizideri-komore"], 204), order: 30 });
  h.push({ id: await upsertProduct("Saladeta sa GN nadgradnjom", "Saladeta", ["GN", "Saladeta"], "rashlada", "saladeta-gn", cat["frizideri-komore"], 205), order: 31 });
  h.push({ id: await upsertProduct("Vertikalni frižider — puna vrata", "Vertikalni", ["Puna vrata"], "rashlada", "frizider-vertikalni-puna-vrata", cat["frizideri-komore"], 201), order: 32 });
  h.push({ id: await upsertProduct("Profesionalni zamrzivač", "Profesionalni", ["Zamrzivač"], "rashlada", "zamrzivac-profesionalni", cat["frizideri-komore"], 200), order: 33 });
  await setItems("horeca", h);

  // ── PEKARE ────────────────────────────────────────────────────────
  console.log("\n📁 Pekare");
  const pe: { id: string; order: number }[] = [];
  // Vitrine
  pe.push({ id: await upsertProduct("Panoramska vitrina (okrugla)", "Panoramska", ["Panoramska"], "rashlada", "vitrina-panoramska-okrugla", cat["rashladne-vitrine"], 210), order: 0 });
  pe.push({ id: await upsertProduct("Vitrina za kolače i torte", "Torte", ["Za poslastice"], "rashlada", "vitrina-za-torte-kolace", cat["rashladne-vitrine"], 202), order: 1 });
  pe.push({ id: await upsertProduct("Samostojeća vitrina za torte", "Torte samostojeća", ["Torte"], "rashlada", "vitrina-samostojeca-torte", cat["rashladne-vitrine"], 211), order: 2 });
  pe.push({ id: await upsertProduct("Stona vitrina za kolače i sendviče", "Stona", ["Stona", "Sendviči"], "rashlada", "vitrina-stona-kolaci", cat["rashladne-vitrine"], 212), order: 3 });
  // Inox priprema
  pe.push({ id: await upsertProduct("Mješalice i aparati za tijesto", "Mješalica", ["Tijesto"], "inox", "mjesalica-tijesto", cat["inox-kuhinja"], 320), order: 10 });
  pe.push({ id: await upsertProduct("Inox radni stolovi i pultovi", "Inox", ["AISI 304/316"], "inox", "radni-stolovi", cat["inox-kuhinja"], 308), order: 11 });
  pe.push({ id: await upsertProduct("Konvekcijske rerne", "Konvekcija", ["Konvekcija"], "inox", "konvekcijska-rerna", cat["inox-kuhinja"], 305), order: 12 });
  pe.push({ id: await upsertProduct("Kuhinjski i štapni mikseri", "Mikser", ["Mikser"], "inox", "kuhinjski-mikser", cat["inox-kuhinja"], 321), order: 13 });
  // Polični
  pe.push({ id: await upsertProduct("Cjenovne šine", "Slimline", ["Slimline"], "polica", "cjenovne-sine", cat["policni-sistemi"], 200), order: 20 });
  pe.push({ id: await upsertProduct("Ramovi i stalci", "Rám", ["Komunikacija"], "polica", "ramovi-stalci", cat["policni-sistemi"], 203), order: 21 });
  pe.push({ id: await upsertProduct("Nadznaci za prolaze", "Nadznak", ["Komunikacija"], "polica", "nadznaci-oznake", cat["policni-sistemi"], 202), order: 22 });
  pe.push({ id: await upsertProduct("Samostojeći elementi", "Standalone", ["Samostojeći"], "polica", "samostojeci-elementi", cat["policni-sistemi"], 204), order: 23 });
  // Checkout
  pe.push({ id: await upsertProduct("Convenience kasa pult", "Convenience", ["Convenience"], "checkout-kase", "kasa-convenience", cat["checkout-kase"], 102), order: 30 });
  pe.push({ id: await upsertProduct("Mini kase", "Mini", ["Mini"], "checkout-kase", "kasa-mini", cat["checkout-kase"], 320), order: 31 });
  pe.push({ id: await upsertProduct("Impulsni kasa pult", "Impulsni", ["Impulsni"], "checkout-kase", "kasa-impulsni", cat["checkout-kase"], 321), order: 32 });
  pe.push({ id: await upsertProduct("Standard kasa pult", "Standard", ["Standard"], "checkout-kase", "kasa-standard", cat["checkout-kase"], 101), order: 33 });
  await setItems("pekare", pe);

  // ── APOTEKE & DROGERIJE ───────────────────────────────────────────
  console.log("\n📁 Apoteke & Drogerije");
  const ap: { id: string; order: number }[] = [];
  // Polični
  ap.push({ id: await upsertProduct("Cjenovne šine", "Slimline", ["Slimline"], "polica", "cjenovne-sine", cat["policni-sistemi"], 200), order: 0 });
  ap.push({ id: await upsertProduct("Držači za ESL cjenovnike", "ESL", ["ESL"], "polica", "esl-drzaci", cat["policni-sistemi"], 201), order: 1 });
  ap.push({ id: await upsertProduct("Rasvjeta za police", "LED", ["LED rasvjeta"], "polica", "rasvjeta-police", cat["policni-sistemi"], 205), order: 2 });
  ap.push({ id: await upsertProduct("Pregrade za police", "Optimal", ["Optimal"], "polica", "pregrade-police", cat["policni-sistemi"], 103), order: 3 });
  // Checkout/pultovi
  ap.push({ id: await upsertProduct("Standard kasa pult", "Standard", ["Standard"], "checkout-kase", "kasa-standard", cat["checkout-kase"], 101), order: 10 });
  ap.push({ id: await upsertProduct("Premium kasa pult", "Premium", ["Premium"], "checkout-kase", "kasa-premium", cat["checkout-kase"], 100), order: 11 });
  ap.push({ id: await upsertProduct("Modularni kasa pultovi", "Modularni", ["Modularni"], "checkout-kase", "kasa-modularni", cat["checkout-kase"], 322), order: 12 });
  ap.push({ id: await upsertProduct("Convenience kasa pult", "Convenience", ["Convenience"], "checkout-kase", "kasa-convenience", cat["checkout-kase"], 102), order: 13 });
  // Frižideri
  ap.push({ id: await upsertProduct("Vertikalni frižider — staklena vrata", "Vertikalni", ["Staklena vrata"], "rashlada", "frizider-vertikalni-staklena-vrata", cat["frizideri-komore"], 100), order: 20 });
  ap.push({ id: await upsertProduct("Vertikalni frižider — puna vrata", "Vertikalni", ["Puna vrata"], "rashlada", "frizider-vertikalni-puna-vrata", cat["frizideri-komore"], 201), order: 21 });
  ap.push({ id: await upsertProduct("Podpultni frižideri", "Podpultni", ["Podpultni"], "rashlada", "podpultni-frizider", cat["frizideri-komore"], 203), order: 22 });
  ap.push({ id: await upsertProduct("Mini vitrina — staklena vrata", "Mini Staklo", ["Mini", "Staklo"], "rashlada", "mini-vitrina-staklena", cat["rashladne-vitrine"], 213), order: 23 });
  // Kolica
  ap.push({ id: await upsertProduct("Korpa Mini 80L", "Eko Color", ["Eko Color"], "kolica-korpe", "korpa-mini-80l", cat["kolica-korpe"], 103), order: 30 });
  ap.push({ id: await upsertProduct("Korpa Midi 160L", "Midi", ["Midi"], "kolica-korpe", "korpa-midi-160l", cat["kolica-korpe"], 330), order: 31 });
  ap.push({ id: await upsertProduct("Classic serija", "Classic", ["Classic"], "kolica-korpe", "kolica-classic", cat["kolica-korpe"], 101), order: 32 });
  ap.push({ id: await upsertProduct("Korpa Samba 130L", "Samba", ["Samba"], "kolica-korpe", "korpa-samba-130l", cat["kolica-korpe"], 102), order: 33 });
  await setItems("apoteke-drogerije", ap);

  console.log("\n✅ All rješenja products seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
