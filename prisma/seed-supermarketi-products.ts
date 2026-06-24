import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const KATALOG = path.join(__dirname, "../public/assets/images/katalog");

function imgs(folder: string, sub: string): string[] {
  const dir = path.join(KATALOG, folder, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort()
    .map(f => `/assets/images/katalog/${folder}/${sub}/${f}`);
}

async function main() {
  const rashlada = await prisma.productCategory.findUnique({ where: { slug: "rashladne-vitrine" } });
  const frizideri = await prisma.productCategory.findUnique({ where: { slug: "frizideri-komore" } });
  const checkout = await prisma.productCategory.findUnique({ where: { slug: "checkout-kase" } });
  const policni = await prisma.productCategory.findUnique({ where: { slug: "policni-sistemi" } });
  const kolica = await prisma.productCategory.findUnique({ where: { slug: "kolica-korpe" } });

  if (!rashlada || !frizideri || !checkout || !policni || !kolica) {
    throw new Error("Kategorije ne postoje — pokrenite seed-products.ts prvo");
  }

  // Products needed for supermarketi page (from original HTML)
  const products = [
    // Rashladne vitrine (iz rashlada/ foldera)
    { cat: rashlada.id, folder: "rashlada", sub: "vitrina-vertikalna-staklena", title: "Vertikalna vitrina — staklena vrata", series: "Vertikalna", specs: ["LED", "Niska potrošnja"], order: 100 },
    { cat: rashlada.id, folder: "rashlada", sub: "vitrina-samostojeca-klizna", title: "Samostojeća vitrina — klizna vrata", series: "Samostojeća", specs: ["Klizna vrata"], order: 101 },
    { cat: rashlada.id, folder: "rashlada", sub: "vitrina-staklena-vrata", title: "Rashladna vitrina — staklena vrata", series: "Vitrina", specs: ["Staklena vrata"], order: 102 },
    { cat: rashlada.id, folder: "rashlada", sub: "mini-vitrina-led", title: "Mini vitrina — LED osvjetljenje", series: "Mini", specs: ["Stona", "LED"], order: 103 },
    // Frižideri (iz rashlada/ foldera)
    { cat: frizideri.id, folder: "rashlada", sub: "frizider-vertikalni-staklena-vrata", title: "Vertikalni frižider — staklena vrata", series: "Vertikalni", specs: ["Staklena vrata"], order: 100 },
    { cat: frizideri.id, folder: "rashlada", sub: "frizider-vertikalni-puna-vrata", title: "Vertikalni frižider — puna vrata", series: "Vertikalni", specs: ["Puna vrata"], order: 101 },
    { cat: frizideri.id, folder: "rashlada", sub: "zamrzivac-profesionalni", title: "Profesionalni zamrzivač", series: "Profesionalni", specs: ["Zamrzivač"], order: 102 },
    { cat: frizideri.id, folder: "rashlada", sub: "ormar-profesionalni-puna-vrata", title: "Profesionalni rashladni ormar", series: "Profesionalni", specs: ["Profesionalni"], order: 103 },
    // Polični (iz polica/ foldera)
    { cat: policni.id, folder: "polica", sub: "cjenovne-sine", title: "Cjenovne šine", series: "Slimline", specs: ["Slimline"], order: 100 },
    { cat: policni.id, folder: "polica", sub: "esl-drzaci", title: "Držači za ESL cjenovnike", series: "ESL", specs: ["ESL"], order: 101 },
    { cat: policni.id, folder: "polica", sub: "automatsko-poravnavanje", title: "Automatsko poravnavanje", series: "Pusheri", specs: ["Pusheri"], order: 102 },
    { cat: policni.id, folder: "polica", sub: "pregrade-police", title: "Pregrade za police", series: "Optimal", specs: ["Optimal"], order: 103 },
    // Kolica (specifične iz originala)
    { cat: kolica.id, folder: "kolica-korpe", sub: "kolica-avant-130", title: "Avant 130", series: "Avant", specs: ["Avant"], order: 100 },
    { cat: kolica.id, folder: "kolica-korpe", sub: "kolica-classic", title: "Classic serija", series: "Classic", specs: ["Classic"], order: 101 },
    { cat: kolica.id, folder: "kolica-korpe", sub: "korpa-samba-130l", title: "Korpa Samba 130L", series: "Samba", specs: ["Samba"], order: 102 },
    { cat: kolica.id, folder: "kolica-korpe", sub: "korpa-mini-80l", title: "Korpa Mini 80L", series: "Eko Color", specs: ["Eko Color"], order: 103 },
    // Checkout (već u DB ali dodajemo specifične)
    { cat: checkout.id, folder: "checkout-kase", sub: "kasa-premium", title: "Premium kasa pult", series: "Premium", specs: ["Premium"], order: 100 },
    { cat: checkout.id, folder: "checkout-kase", sub: "kasa-standard", title: "Standard kasa pult", series: "Standard", specs: ["Standard"], order: 101 },
    { cat: checkout.id, folder: "checkout-kase", sub: "kasa-convenience", title: "Convenience kasa pult", series: "Convenience", specs: ["Convenience"], order: 102 },
    { cat: checkout.id, folder: "checkout-kase", sub: "self-smartpos", title: "SmartPos self-checkout", series: "SmartPos", specs: ["Self-checkout"], order: 103 },
  ];

  const createdIds: Record<string, string> = {};

  for (const p of products) {
    const images = imgs(p.folder, p.sub);
    const existing = await prisma.product.findFirst({ where: { title: p.title, categoryId: p.cat } });
    let id: string;
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: { images: JSON.stringify(images), series: p.series, specs: JSON.stringify(p.specs), order: p.order } });
      id = existing.id;
      console.log(`  ✏️  Updated: ${p.title}`);
    } else {
      const created = await prisma.product.create({ data: { title: p.title, series: p.series, specs: JSON.stringify(p.specs), images: JSON.stringify(images), categoryId: p.cat, order: p.order, published: true } });
      id = created.id;
      console.log(`  ✅ Created: ${p.title}`);
    }
    createdIds[`${p.folder}/${p.sub}`] = id;
  }

  // Obriši stare RjesenjaItems za supermarketi i postavi tačno kao u originalu
  await prisma.rjesenjaItem.deleteMany({ where: { rjesenjaSlug: "supermarketi" } });
  console.log("\n🔗 Setting exact supermarketi RjesenjaItems...");

  const supermarketiOrder = [
    // Rashladne vitrine
    { key: "rashlada/vitrina-vertikalna-staklena", order: 0 },
    { key: "rashlada/vitrina-samostojeca-klizna", order: 1 },
    { key: "rashlada/vitrina-staklena-vrata", order: 2 },
    { key: "rashlada/mini-vitrina-led", order: 3 },
    // Frižideri
    { key: "rashlada/frizider-vertikalni-staklena-vrata", order: 10 },
    { key: "rashlada/frizider-vertikalni-puna-vrata", order: 11 },
    { key: "rashlada/zamrzivac-profesionalni", order: 12 },
    { key: "rashlada/ormar-profesionalni-puna-vrata", order: 13 },
    // Checkout
    { key: "checkout-kase/kasa-premium", order: 20 },
    { key: "checkout-kase/kasa-standard", order: 21 },
    { key: "checkout-kase/kasa-convenience", order: 22 },
    { key: "checkout-kase/self-smartpos", order: 23 },
    // Polični
    { key: "polica/cjenovne-sine", order: 30 },
    { key: "polica/esl-drzaci", order: 31 },
    { key: "polica/automatsko-poravnavanje", order: 32 },
    { key: "polica/pregrade-police", order: 33 },
    // Kolica
    { key: "kolica-korpe/kolica-avant-130", order: 40 },
    { key: "kolica-korpe/kolica-classic", order: 41 },
    { key: "kolica-korpe/korpa-samba-130l", order: 42 },
    { key: "kolica-korpe/korpa-mini-80l", order: 43 },
  ];

  for (const item of supermarketiOrder) {
    const productId = createdIds[item.key];
    if (!productId) { console.warn(`  ⚠️  No product for ${item.key}`); continue; }
    await prisma.rjesenjaItem.create({ data: { rjesenjaSlug: "supermarketi", productId, order: item.order } });
    console.log(`  🔗 ${item.key} (order: ${item.order})`);
  }

  console.log("\n✅ Supermarketi products & items seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
