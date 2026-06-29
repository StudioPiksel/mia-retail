import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIA Retail Solutions — Partner za opremanje maloprodajnih i HoReCa objekata",
  description: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora na ključ. 200+ projekata na 3 kontinenta.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "MIA Retail Solutions — Partner za opremanje maloprodajnih i HoReCa objekata",
    description: "Projektujemo, isporučujemo i montiramo kompletnu opremu maloprodajnih i HoReCa prostora na ključ. 200+ projekata na 3 kontinenta.",
    url: "https://miaretailsolutions.com",
    siteName: "MIA Retail Solutions",
    images: [{ url: "https://miaretailsolutions.com/og-image.png", width: 1500, height: 843, alt: "MIA Retail Solutions" }],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIA Retail Solutions",
    description: "Partner za opremanje maloprodajnih i HoReCa objekata na ključ.",
    images: ["https://miaretailsolutions.com/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn">
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
        {/* Favicon — SVG direktno */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* CSS u root layoutu — učitava se jednom */}
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/design.css" />
        <link rel="stylesheet" href="/rebuild.css" />
        <link rel="stylesheet" href="/badges.css" />
        <style>{`
          body{background:#fff;margin:0;padding:0;}
          html{scroll-behavior:smooth;}
          /* Realizacije hero stats — mobile fix */
          .reference-stats{display:flex;gap:32px;margin-top:36px;flex-wrap:wrap;}
          .stat-item{display:flex;flex-direction:column;}
          .stat-number{font-size:2rem;font-weight:900;color:#0F766E;line-height:1;}
          .stat-label{font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px;}
          /* Realizacije gallery */
          .reference-gallery-section{padding:64px 0 80px;}
          .gallery-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:40px;}
          .filter-btn{padding:8px 18px;border-radius:100px;border:1.5px solid #E2E8ED;background:#fff;cursor:pointer;font-size:14px;font-weight:500;font-family:'Satoshi',sans-serif;color:#374151;transition:all 0.2s;}
          .filter-btn.active{background:#0B1D33;color:#fff;border-color:#0B1D33;}
          .brand-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}
          .brand-card{border-radius:12px;overflow:hidden;border:1px solid #E2E8ED;background:#fff;transition:transform 0.2s,box-shadow 0.2s;}
          .brand-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(11,29,51,0.12);}
          .brand-card-media{position:relative;aspect-ratio:4/3;overflow:hidden;background:#F1F5F9;}
          .brand-card-media img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;}
          .brand-card:hover .brand-card-media img{transform:scale(1.05);}
          .card-count{position:absolute;top:10px;left:10px;background:rgba(11,29,51,0.75);color:#fff;font-size:12px;padding:3px 10px;border-radius:100px;}
          .card-zoom{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(11,29,51,0.3);color:#fff;transition:opacity 0.2s;}
          .brand-card:hover .card-zoom{opacity:1;}
          .brand-card-body{padding:14px 16px;}
          .brand-card-name{font-size:15px;font-weight:700;color:#0B1D33;margin:0 0 4px;}
          .brand-card-country{font-size:13px;color:#6B7B8A;}
          /* Mobile overrides */
          @media(max-width:640px){
            .brand-grid{grid-template-columns:1fr 1fr;gap:12px;}
            .reference-stats{gap:20px;}
            .stat-number{font-size:1.5rem;}
            .gallery-filters{gap:8px;}
            .filter-btn{font-size:13px;padding:7px 14px;}
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
