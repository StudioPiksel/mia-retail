import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REALIZACIJE = [
  { name: "WinCo Foods", country: "SAD", cats: ["supermarketi", "police"], imgs: ["WinCo_Foods_US.jpg"] },
  { name: "Carrefour", country: "Francuska", cats: ["supermarketi", "police"], imgs: ["Carrefour_France.jpg", "Carrefour_France_2.jpg"] },
  { name: "Conad", country: "Italija", cats: ["supermarketi", "police"], imgs: ["Conad_Italy.jpg", "Conad_Italy_1.jpg"] },
  { name: "EDEKA", country: "Njemačka", cats: ["supermarketi", "police"], imgs: ["EDEKA_Germany.jpg", "EDEKA_Germany_2.jpg"] },
  { name: "Globus", country: "Češka", cats: ["supermarketi", "police"], imgs: ["Globus_Pilsen.jpg", "Globus_Pilsen_Czech.jpg"] },
  { name: "IGA Drummoyne", country: "Australija", cats: ["supermarketi", "police"], imgs: ["IGA_Drummoyne.jpg", "IGA_Drummoyne_Australia.jpg"] },
  { name: "ICA Supermarket", country: "Švedska", cats: ["supermarketi", "police"], imgs: ["ICA_Supermarket_Pelikan.jpg"] },
  { name: "ASDA", country: "Engleska", cats: ["supermarketi", "police"], imgs: ["ASDA_England.jpg", "ASDA_England_1.jpg"] },
  { name: "Tesco", country: "Ujedinjeno Kraljevstvo", cats: ["supermarketi", "police"], imgs: ["Tesco.jpg"] },
  { name: "Jumbo", country: "Holandija", cats: ["supermarketi", "police"], imgs: ["Jumbo_Supermarket.jpg"] },
  { name: "Sprouts Farmers Market", country: "SAD", cats: ["supermarketi", "police"], imgs: ["Sprouts_Farmers_Market.jpg"] },
  { name: "BILLA", country: "Češka", cats: ["supermarketi", "police"], imgs: ["BILLA_Czech.jpg"] },
  { name: "Supermarket realizacije", country: "Evropa", cats: ["supermarketi", "police"], imgs: ["realizacija_a.jpg", "realizacija_b.jpg", "realizacija_c.jpg"] },
  { name: "Carrefour Market", country: "Francuska", cats: ["supermarketi", "korpe"], imgs: ["Panaro_Carrefour_Market.jpg", "Panaro_Carrefour_Market_2.jpg", "Panaro_Carrefour_Market_3.jpg"] },
  { name: "Euro Spin", country: "Italija", cats: ["supermarketi", "korpe"], imgs: ["Panaro_Euro_Spin.jpg"] },
  { name: "E.Leclerc", country: "Francuska", cats: ["supermarketi", "korpe"], imgs: ["Mini_Eko_Color_Leclerc.jpg", "Mini_Eko_Color_Leclerc_2.jpg", "Mini_Eko_Color_Leclerc_3.jpg", "Mini_Eko_Color_1.jpg", "Mini_Eko_Color_2.jpg"] },
  { name: "Poppy", country: "Mađarska", cats: ["horeca", "police"], imgs: ["Poppy_Budapest.jpg", "Poppy_Budapest_2.jpg", "Poppy_Budapest_3.jpg"] },
  { name: "Sephora", country: "Global", cats: ["horeca", "police"], imgs: ["Sephora.jpg", "Sephora_2.jpg", "Sephora_3.jpg"] },
  { name: "Pharmacie Dammarie", country: "Francuska", cats: ["horeca", "police"], imgs: ["Pharmacie_Dammarie_France.jpg"] },
];

async function main() {
  await prisma.realizacija.deleteMany();
  for (let i = 0; i < REALIZACIJE.length; i++) {
    const r = REALIZACIJE[i];
    await prisma.realizacija.create({
      data: {
        name: r.name,
        country: r.country,
        images: JSON.stringify(r.imgs.map(f => `/assets/images/reference/${f}`)),
        categories: JSON.stringify(r.cats),
        order: i,
        published: true,
      },
    });
    console.log(`✅ ${r.name} — ${r.country} (${r.imgs.length} slike)`);
  }
  console.log(`\n✅ Seeded ${REALIZACIJE.length} realizacija`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
