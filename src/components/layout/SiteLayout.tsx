import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import Script from "next/script";
import { prisma } from "@/lib/prisma";

export type MegaRjesenjaItem = { slug: string; title: string; sub: string; img: string; desc: string };
export type MegaProizvodiItem = { slug: string; title: string; sub: string; img: string };

async function getWhatsApp() {
  const [num, msg] = await Promise.all([
    prisma.settings.findUnique({ where: { key: "whatsapp_number" } }),
    prisma.settings.findUnique({ where: { key: "whatsapp_message" } }),
  ]);
  return {
    number: num?.value ?? "+38267038777",
    message: msg?.value ?? "Zdravo, zanima me vaša ponuda za opremanje.",
  };
}

async function getMegaMenuData() {
  const [mr, mp] = await Promise.all([
    prisma.settings.findUnique({ where: { key: "megamenu_rjesenja" } }),
    prisma.settings.findUnique({ where: { key: "megamenu_proizvodi" } }),
  ]);
  return {
    rjesenja: mr ? (JSON.parse(mr.value) as MegaRjesenjaItem[]) : [],
    proizvodi: mp ? (JSON.parse(mp.value) as MegaProizvodiItem[]) : [],
  };
}

export default async function SiteLayout({
  children,
  currentPage = "",
  extraCss = [],
  headerLight = false,
}: {
  children: React.ReactNode;
  currentPage?: string;
  extraCss?: string[];
  headerLight?: boolean;
}) {
  const [megaMenu, whatsapp] = await Promise.all([getMegaMenuData(), getWhatsApp()]);

  return (
    <>
      {/* Main CSS je u root layout.tsx — samo extra CSS po stranici */}
      {extraCss.map((css) => (
        <link key={css} rel="stylesheet" href={css} />
      ))}
      {headerLight && (
        <style>{`
          .site-header { background: #fff !important; box-shadow: 0 1px 0 #E2E8ED !important; }
          .site-header .nav-link, .site-header .logo-link { color: var(--navy) !important; }
        `}</style>
      )}
      <Header currentPage={currentPage} megaRjesenja={megaMenu.rjesenja} megaProizvodi={megaMenu.proizvodi} />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat number={whatsapp.number} message={whatsapp.message} />
      <Script src="/script.js" strategy="afterInteractive" />
      <Script src="/design.js" strategy="afterInteractive" />
    </>
  );
}
