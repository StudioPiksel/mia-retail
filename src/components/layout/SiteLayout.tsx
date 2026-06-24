import Header from "./Header";
import Footer from "./Footer";
import Script from "next/script";

export default function SiteLayout({
  children,
  currentPage = "",
  extraCss = [],
}: {
  children: React.ReactNode;
  currentPage?: string;
  extraCss?: string[];
}) {
  return (
    <>
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/design.css" />
      <link rel="stylesheet" href="/rebuild.css" />
      {extraCss.map((css) => (
        <link key={css} rel="stylesheet" href={css} />
      ))}
      <Header currentPage={currentPage} />
      <main>{children}</main>
      <Footer />
      <Script src="/script.js" strategy="afterInteractive" />
      <Script src="/design.js" strategy="afterInteractive" />
    </>
  );
}
