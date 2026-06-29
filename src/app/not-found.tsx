import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Stranica nije pronađena | MIA Retail Solutions",
};

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/rebuild.css" />
      <link rel="stylesheet" href="/badges.css" />

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0B1D33 0%, #0d2237 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Satoshi', sans-serif", position: "relative", overflow: "hidden",
        padding: "40px 24px",
      }}>
        {/* Glow */}
        <div style={{ position: "absolute", right: -100, top: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,118,110,0.2), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -80, bottom: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(199,241,230,0.08), transparent 70%)", pointerEvents: "none" }} />

        {/* Logo */}
        <Link href="/" style={{ marginBottom: 48 }}>
          <img src="/assets/images/logo/mia-retail-solutions-vectorized-clean.svg" alt="MIA Retail Solutions" style={{ height: 36, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
        </Link>

        {/* 404 number */}
        <div style={{
          fontSize: "clamp(80px, 15vw, 140px)", fontWeight: 900, lineHeight: 1,
          background: "linear-gradient(135deg, #0F766E, #C7F1E6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: 16, letterSpacing: "-0.04em",
        }}>
          404
        </div>

        {/* Message */}
        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", textAlign: "center" }}>
          Stranica nije pronađena
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", margin: "0 0 40px", maxWidth: 480, textAlign: "center", lineHeight: 1.65 }}>
          Stranica koju tražite ne postoji ili je premještena. Provjerite URL ili se vratite na početnu stranicu.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" style={{
            padding: "13px 28px", background: "#0F766E", color: "#fff",
            borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Početna stranica
          </Link>
          <Link href="/kontakt" style={{
            padding: "13px 28px", background: "transparent", color: "rgba(255,255,255,0.85)",
            borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600,
            border: "1.5px solid rgba(255,255,255,0.2)",
          }}>
            Kontaktirajte nas
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 56, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { href: "/rjesenja/supermarketi", label: "Supermarketi" },
            { href: "/proizvodi/rashladne-vitrine", label: "Rashladne vitrine" },
            { href: "/realizacije", label: "Realizacije" },
            { href: "/blog", label: "Blog" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: "rgba(199,241,230,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
              onMouseEnter={undefined}>
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
