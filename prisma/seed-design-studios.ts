import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STUDIOS = [
  {
    badge: "DZ", name: "DZYUBA DESIGN", order: 0,
    tag: "Internacionalni retail design studio · supermarketi, marketi i apoteke širom Evrope i Azije",
    projects: [
      { caption: "Foxi supermarket — koncept dizajna prodajnog prostora", overlayLabel: "Foxi supermarket", image: "/assets/images/design/dzyuba/Foxi_supermarket.webp" },
      { caption: "Vinoteca — dizajn enterijera vinoteke", overlayLabel: "Vinoteca", image: "/assets/images/design/dzyuba/Vinoteca.webp" },
      { caption: "Magnum — supermarket, Ukrajina", overlayLabel: "Magnum · Ukrajina", image: "/assets/images/design/dzyuba/Magnum_Ukraine.webp" },
      { caption: "Agrohub — Tbilisi, Gruzija", overlayLabel: "Agrohub · Tbilisi", image: "/assets/images/design/dzyuba/Agrohub_Tbilisi.webp" },
      { caption: "Galmart — Uzbekistan", overlayLabel: "Galmart · Uzbekistan", image: "/assets/images/design/dzyuba/Galmart_Uzbekistan.webp" },
      { caption: "Selecto — koncept maloprodaje", overlayLabel: "Selecto", image: "/assets/images/design/dzyuba/Selecto.webp" },
      { caption: "Smako market — dizajn prodajnog prostora", overlayLabel: "Smako market", image: "/assets/images/design/dzyuba/Smako_market.webp" },
      { caption: "Ultramarket — koncept supermarketa", overlayLabel: "Ultramarket", image: "/assets/images/design/dzyuba/Ultramarket.webp" },
      { caption: "Agrohub — Kutaisi, Gruzija", overlayLabel: "Agrohub · Kutaisi", image: "/assets/images/design/dzyuba/Agrohub_Kutaisi.webp" },
      { caption: "Maesto — prodavnica, Moldavija", overlayLabel: "Maesto · Moldavija", image: "/assets/images/design/dzyuba/Maesto_Moldova.webp" },
      { caption: "Foxi cafe & market — koncept", overlayLabel: "Foxi cafe & market", image: "/assets/images/design/dzyuba/Foxi_cafe_market.webp" },
      { caption: "Medik 8 — apoteka, Ukrajina", overlayLabel: "Medik 8 · apoteka", image: "/assets/images/design/dzyuba/Medik8_pharmacy_Ukraine.webp" },
      { caption: "Fruits & vegetables — koncept odjeljenja", overlayLabel: "Fruits & vegetables", image: "/assets/images/design/dzyuba/fruits_vegs.webp" },
    ],
  },
  {
    badge: "WD", name: "WITT DESIGN", order: 1,
    tag: "Projektovanje enterijera za markete, mesnice i ugostiteljske objekte u regionu",
    projects: [
      { caption: "Aroma marketi — projektovanje enterijera marketa", overlayLabel: "Aroma marketi", image: "/assets/images/design/witt/Aroma_marketi.jpg" },
      { caption: "Aroma marketi — prodajni prostor", overlayLabel: "Aroma marketi", image: "/assets/images/design/witt/Aroma_marketi_2.jpg" },
      { caption: "Aroma marketi — detalj enterijera", overlayLabel: "Aroma marketi", image: "/assets/images/design/witt/Aroma_marketi_4.jpg" },
      { caption: "Mesara Plana — projektovanje enterijera mesnice", overlayLabel: "Mesara Plana", image: "/assets/images/design/witt/Mesara_Plana.jpg" },
      { caption: "Mesara Plana — prodajni prostor", overlayLabel: "Mesara Plana", image: "/assets/images/design/witt/Mesara_Plana_2.jpg" },
      { caption: "Kafe Šoljica — projektovanje enterijera kafea", overlayLabel: "Kafe Šoljica", image: "/assets/images/design/witt/Kafe_Soljica_projektovanje.jpg" },
      { caption: "Restoran Vojvode Stepe — dizajn enterijera", overlayLabel: "Restoran Vojvode Stepe", image: "/assets/images/design/witt/Restoran_Vojvode_Stepe.jpg" },
      { caption: "Restoran Flamingo — dizajn enterijera", overlayLabel: "Restoran Flamingo", image: "/assets/images/design/witt/Restoran_Flamingo.jpg" },
    ],
  },
];

async function main() {
  await prisma.designProject.deleteMany();
  await prisma.designStudio.deleteMany();

  for (const studio of STUDIOS) {
    const s = await prisma.designStudio.create({
      data: { badge: studio.badge, name: studio.name, tag: studio.tag, order: studio.order },
    });
    for (let i = 0; i < studio.projects.length; i++) {
      await prisma.designProject.create({
        data: { studioId: s.id, ...studio.projects[i], order: i, published: true },
      });
    }
    console.log(`✅ ${studio.name}: ${studio.projects.length} projekata`);
  }
  console.log("\n✅ Design studios seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
