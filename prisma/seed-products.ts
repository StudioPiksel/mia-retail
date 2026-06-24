import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Map katalog folder names → display names & nav slugs
const CATEGORIES: { folderName: string; slug: string; name: string; order: number }[] = [
  { folderName: "rashladne-vitrine", slug: "rashladne-vitrine", name: "Rashladne vitrine", order: 1 },
  { folderName: "frizideri-komore",  slug: "frizideri-komore",  name: "Frižideri & komore", order: 2 },
  { folderName: "checkout-kase",     slug: "checkout-kase",     name: "Checkout & Kasa pultovi", order: 3 },
  { folderName: "policni-sistemi",   slug: "policni-sistemi",   name: "Polični sistemi", order: 4 },
  { folderName: "kolica-korpe",      slug: "kolica-korpe",      name: "Kolica & Korpe", order: 5 },
  { folderName: "inox",              slug: "inox-kuhinja",      name: "Inox & Kuhinjska oprema", order: 6 },
  { folderName: "usmjeravanje-itab", slug: "usmjeravanje",      name: "Usmjeravanje kupaca", order: 7 },
];

// Human-readable titles from folder slugs
function titleFromSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bI\b/g, "i")
    .replace(/\bU\b/g, "u")
    .replace(/\bZa\b/g, "za")
    .replace(/\bGn\b/g, "GN")
    .replace(/\bPec\b/g, "Peć")
    .replace(/\bVrafle\b/g, "Vafle");
}

// Extract series from known patterns
function seriesFromSlug(slug: string): string | null {
  const m = slug.match(/-(serija|series|a-serija)$/i);
  if (m) return slug.replace(/-serija|-series|-a-serija/i, "").toUpperCase().replace(/-/g, " ").trim();
  const modelMatch = slug.match(/^(kasa|self|kolica|korpa|vitrina|frizider|zamrzivac|ormar)-(.+)/);
  if (modelMatch) return modelMatch[2].toUpperCase().replace(/-/g, " ");
  return null;
}

const KATALOG_BASE = path.join(__dirname, "../public/assets/images/katalog");

async function main() {
  console.log("🌱 Seeding products...\n");

  for (const cat of CATEGORIES) {
    const catFolder = path.join(KATALOG_BASE, cat.folderName);
    if (!fs.existsSync(catFolder)) {
      console.warn(`⚠️  Folder not found: ${catFolder}`);
      continue;
    }

    // Upsert category
    const dbCat = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: { slug: cat.slug, name: cat.name, order: cat.order },
    });
    console.log(`📁 Category: ${cat.name}`);

    const productFolders = fs.readdirSync(catFolder)
      .filter((f) => fs.statSync(path.join(catFolder, f)).isDirectory())
      .sort();

    for (let i = 0; i < productFolders.length; i++) {
      const prodSlug = productFolders[i];
      const prodFolder = path.join(catFolder, prodSlug);

      const imgFiles = fs.readdirSync(prodFolder)
        .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
        .sort();

      const images = imgFiles.map(
        (f) => `/assets/images/katalog/${cat.folderName}/${prodSlug}/${f}`
      );

      const title = titleFromSlug(prodSlug);
      const series = seriesFromSlug(prodSlug);
      const uniqueSlug = `${cat.slug}--${prodSlug}`;

      // Check if exists by unique combo (category + slug)
      const existing = await prisma.product.findFirst({
        where: { categoryId: dbCat.id, title },
      });

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: { images: JSON.stringify(images), series, order: i },
        });
      } else {
        await prisma.product.create({
          data: {
            title,
            series,
            images: JSON.stringify(images),
            specs: JSON.stringify([]),
            categoryId: dbCat.id,
            order: i,
            published: true,
          },
        });
      }
      console.log(`  ✅ ${title} (${imgFiles.length} slike)`);
    }
  }

  // Default RjesenjaItems — koje proizvode pokazujemo na kojoj rješenja stranici
  // Supermarketi: Rashladne vitrine (4), Frižideri (3), Checkout (4), Polični (3), Kolica (3)
  const superRashladne = await prisma.productCategory.findUnique({ where: { slug: "rashladne-vitrine" } });
  const superFriz = await prisma.productCategory.findUnique({ where: { slug: "frizideri-komore" } });
  const superCheckout = await prisma.productCategory.findUnique({ where: { slug: "checkout-kase" } });

  if (superRashladne) {
    const prods = await prisma.product.findMany({
      where: { categoryId: superRashladne.id, published: true },
      orderBy: { order: "asc" },
      take: 4,
    });
    for (let i = 0; i < prods.length; i++) {
      await prisma.rjesenjaItem.upsert({
        where: { rjesenjaSlug_productId: { rjesenjaSlug: "supermarketi", productId: prods[i].id } },
        update: { order: i },
        create: { rjesenjaSlug: "supermarketi", productId: prods[i].id, order: i },
      });
    }
    console.log(`\n🔗 Linked ${prods.length} rashladne vitrine → supermarketi`);
  }

  if (superFriz) {
    const prods = await prisma.product.findMany({
      where: { categoryId: superFriz.id, published: true },
      orderBy: { order: "asc" },
      take: 4,
    });
    for (let i = 0; i < prods.length; i++) {
      await prisma.rjesenjaItem.upsert({
        where: { rjesenjaSlug_productId: { rjesenjaSlug: "supermarketi", productId: prods[i].id } },
        update: { order: i + 10 },
        create: { rjesenjaSlug: "supermarketi", productId: prods[i].id, order: i + 10 },
      });
    }
    console.log(`🔗 Linked ${prods.length} frižideri → supermarketi`);
  }

  if (superCheckout) {
    const prods = await prisma.product.findMany({
      where: { categoryId: superCheckout.id, published: true },
      orderBy: { order: "asc" },
      take: 4,
    });
    for (let i = 0; i < prods.length; i++) {
      await prisma.rjesenjaItem.upsert({
        where: { rjesenjaSlug_productId: { rjesenjaSlug: "supermarketi", productId: prods[i].id } },
        update: { order: i + 20 },
        create: { rjesenjaSlug: "supermarketi", productId: prods[i].id, order: i + 20 },
      });
    }
    console.log(`🔗 Linked ${prods.length} checkout → supermarketi`);
  }

  console.log("\n✅ Products seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
