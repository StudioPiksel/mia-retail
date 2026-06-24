import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@miaretailsolutions.com" },
    update: {},
    create: {
      email: "admin@miaretailsolutions.com",
      password: hashedPassword,
      name: "MIA Admin",
      role: "admin",
    },
  });

  // Default settings
  const defaultSettings = [
    { key: "site_name", value: "MIA Retail Solutions" },
    { key: "utility_phone", value: "+382 67 038 777" },
    { key: "utility_email", value: "info@miaretailsolutions.com" },
    { key: "utility_location", value: "Podgorica, Crna Gora" },
    { key: "utility_hours", value: "Pon — Pet: 08:00 — 17:00" },
    { key: "footer_tagline", value: "Partner za opremanje maloprodajnih i HoReCa objekata na ključ." },
    { key: "footer_address", value: "Cetinjski put bb, Podgorica, Crna Gora" },
    { key: "logo_url", value: "/assets/images/logo/mia-retail-solutions-vectorized-clean.svg" },
  ];

  for (const s of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Main menu items
  await prisma.menuItem.deleteMany();
  const menuItems = [
    { label: "Rješenja", url: "#", type: "mega-rjesenja", order: 1 },
    { label: "Proizvodi", url: "#", type: "mega-proizvodi", order: 2 },
    { label: "Pomoć u izboru", url: "/pomoc-u-izboru", type: "link", order: 3 },
    { label: "Reference", url: "/reference", type: "link", order: 4 },
    { label: "Dizajn enterijera", url: "/dizajn-enterijera", type: "link", order: 5 },
    { label: "O nama", url: "/o-nama", type: "link", order: 6 },
    { label: "Blog", url: "/blog", type: "link", order: 7 },
    { label: "Kontakt", url: "/kontakt", type: "link", order: 8 },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  // Sample blog posts
  await prisma.blogPost.upsert({
    where: { slug: "kako-opremiti-supermarket-vodic" },
    update: {},
    create: {
      slug: "kako-opremiti-supermarket-vodic",
      title: "Kako opremiti supermarket — od tlocrta do otvaranja",
      excerpt: "Kompletan vodič za opremanje maloprodajnog objekta: planiranje prostora, izbor opreme i rokovi montaže.",
      content: "<p>Kompletan vodič...</p>",
      category: "Vodiči",
      thumbnail: "/assets/images/blog/blog-supermarket-layout.jpg",
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "hladni-lanac-mesnica-ribarnica" },
    update: {},
    create: {
      slug: "hladni-lanac-mesnica-ribarnica",
      title: "Hladni lanac u mesnici i ribarnici: temperaturni režimi i AISI 316",
      excerpt: "Sve što trebate znati o hladnom lancu za svježe proizvode.",
      content: "<p>Hladni lanac...</p>",
      category: "Analize",
      thumbnail: "/assets/images/blog/blog-cold-chain.jpg",
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("✅ Seed completed — admin: admin@miaretailsolutions.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
