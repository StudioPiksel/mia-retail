import Header from "./Header";
import Footer from "./Footer";
import Script from "next/script";

export default function SiteLayout({
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
  return (
    <>
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/design.css" />
      <link rel="stylesheet" href="/rebuild.css" />
      {extraCss.map((css) => (
        <link key={css} rel="stylesheet" href={css} />
      ))}
      {/* Force header white on non-dark-hero pages */}
      {headerLight && (
        <style>{`
          .site-header { background: #fff !important; box-shadow: 0 1px 0 #E2E8ED !important; }
          .site-header .nav-link, .site-header .logo-link { color: var(--navy) !important; }
        `}</style>
      )}
      <Header currentPage={currentPage} />
      <main>{children}</main>
      <Footer />
      <Script src="/script.js" strategy="afterInteractive" />
      <Script src="/design.js" strategy="afterInteractive" />
    </>
  );
}
