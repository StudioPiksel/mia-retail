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
        <style>{`body{background:#fff;margin:0;padding:0;}html{scroll-behavior:smooth;}`}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
