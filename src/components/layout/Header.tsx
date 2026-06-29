"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MegaRjesenjaItem, MegaProizvodiItem } from "./SiteLayout";

const RJESENJA_ICONS: Record<string, React.ReactNode> = {
  supermarketi: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg>,
  "mesnice-ribarnice": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v6H4z"/><path d="M6 10v10"/><path d="M18 10v10"/><path d="M6 15h12"/></svg>,
  horeca: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2v7a3 3 0 006 0V2"/><path d="M9 2v20"/><path d="M16 2c-1.5 1.5-2 4-2 6s.5 4 2 5v9"/></svg>,
  pekare: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 13a8 8 0 0116 0v3H4z"/><path d="M2 20h20"/></svg>,
  "apoteke-drogerije": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 7v10M7 12h10"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>,
};

const DEFAULT_ICON = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;

export default function Header({
  currentPage = "",
  megaRjesenja = [],
  megaProizvodi = [],
}: {
  currentPage?: string;
  megaRjesenja?: MegaRjesenjaItem[];
  megaProizvodi?: MegaProizvodiItem[];
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accOpen, setAccOpen] = useState<"rjesenja" | "proizvodi" | null>(null);

  // Zatvori meni pri promjeni rute ili resize na desktop
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mega menu hover
    const items = header.querySelectorAll<HTMLElement>(".has-mega");
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => item.classList.add("is-open"));
      item.addEventListener("mouseleave", () => item.classList.remove("is-open"));
    });

    // Mega menu image preview (rješenja)
    const megaItems = header.querySelectorAll<HTMLElement>(".mega-item[data-img]");
    megaItems.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const img = el.dataset.img;
        const title = el.dataset.title;
        const desc = el.dataset.desc;
        const feature = header.querySelector<HTMLAnchorElement>("#megaFeatureRjesenja");
        if (!feature) return;
        const imgEl = feature.querySelector<HTMLElement>(".mega-feature-img");
        const titleEl = feature.querySelector<HTMLElement>(".mega-feature-title");
        const descEl = feature.querySelector<HTMLElement>(".mega-feature-desc");
        if (imgEl && img) imgEl.style.backgroundImage = `url('${img}')`;
        if (titleEl && title) titleEl.textContent = title;
        if (descEl && desc) descEl.textContent = desc;
        header.querySelectorAll(".mega-item").forEach(i => i.classList.remove("is-active"));
        el.classList.add("is-active");
      });
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, [megaRjesenja]);

  const firstRjesenja = megaRjesenja[0];

  return (
    <>
      {/* UTILITY BAR */}
      <div className="utility-bar" id="utilityBar">
        <div className="utility-container">
          <div className="utility-left">
            <span className="utility-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              <a href="tel:+38267038777">+382 67 038 777</a>
            </span>
            <span className="utility-divider"></span>
            <span className="utility-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:info@miaretailsolutions.com">info@miaretailsolutions.com</a>
            </span>
          </div>
          <div className="utility-right">
            <span className="utility-item utility-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Podgorica, Crna Gora
            </span>
            <span className="utility-divider"></span>
            <span className="utility-item utility-hours">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Pon — Pet: 08:00 — 17:00
            </span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="site-header" id="siteHeader" ref={headerRef}>
        <div className="header-container">
          <Link href="/" className="logo-link" aria-label="MIA Retail Solutions - Početna">
            <Image src="/assets/images/logo/mia-retail-solutions-vectorized-clean.svg" alt="MIA Retail Solutions" className="logo" width={160} height={40} priority />
          </Link>

          <nav className={`main-nav${mobileOpen ? " is-open" : ""}`} aria-label="Glavna navigacija">
            <ul className="nav-list">
              {/* RJEŠENJA — dinamički iz DB */}
              <li className="nav-item has-mega" data-mega="rjesenja">
                <a href="#" className="nav-link">
                  Rješenja <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <div className="mega-menu mega-menu--rjesenja">
                  <div className="mega-inner">
                    <div className="mega-list">
                      <span className="mega-eyebrow">Rješenja po industriji</span>
                      {megaRjesenja.map((item) => (
                        <a
                          key={item.slug}
                          href={`/rjesenja/${item.slug}`}
                          className={`mega-item${currentPage === `/rjesenja/${item.slug}` ? " is-active" : ""}`}
                          data-img={item.img}
                          data-title={item.title}
                          data-desc={item.desc}
                        >
                          <span className="mega-item-icon">{RJESENJA_ICONS[item.slug] ?? DEFAULT_ICON}</span>
                          <span className="mega-item-text"><strong>{item.title}</strong><small>{item.sub}</small></span>
                        </a>
                      ))}
                    </div>
                    {firstRjesenja && (
                      <a href={`/rjesenja/${firstRjesenja.slug}`} className="mega-feature" id="megaFeatureRjesenja">
                        <span className="mega-feature-img" style={{ backgroundImage: `url('${firstRjesenja.img}')` }}></span>
                        <span className="mega-feature-body">
                          <strong className="mega-feature-title">{firstRjesenja.title}</strong>
                          <span className="mega-feature-desc">{firstRjesenja.desc}</span>
                          <span className="mega-feature-cta">Pogledajte rješenje <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </li>

              {/* PROIZVODI — dinamički iz DB */}
              <li className="nav-item has-mega" data-mega="proizvodi">
                <a href="#" className="nav-link">
                  Proizvodi <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <div className="mega-menu mega-menu--proizvodi">
                  <div className="mega-grid">
                    {megaProizvodi.map((item) => (
                      <a key={item.slug} href={`/proizvodi/${item.slug}`} className="mega-card">
                        <span className="mega-card-thumb"><img src={item.img} alt={item.title} loading="lazy" decoding="async" /></span>
                        <span className="mega-card-text"><strong>{item.title}</strong><small>{item.sub}</small></span>
                      </a>
                    ))}
                  </div>
                  <div className="mega-foot">
                    <span>Tražite nešto specifično?</span>
                    <a href="/katalog" className="mega-foot-link">Pogledajte cijeli katalog <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
                  </div>
                </div>
              </li>

              {[
                { href: "/pomoc-u-izboru", label: "Pomoć u izboru" },
                { href: "/realizacije", label: "Realizacije" },
                { href: "/dizajn-enterijera", label: "Dizajn enterijera" },
                { href: "/o-nama", label: "O nama" },
                { href: "/blog", label: "Blog" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((item) => (
                <li key={item.href} className="nav-item">
                  <Link href={item.href} className={`nav-link${currentPage === item.href ? " is-current" : ""}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <a href="/kontakt" className="header-cta">
              <span className="cta-text">Zatražite ponudu</span>
              <svg className="cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>

          <button
            className={`mobile-menu-toggle${mobileOpen ? " is-open" : ""}`}
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`mnav-backdrop${mobileOpen ? " is-open" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`mnav${mobileOpen ? " is-open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mnav-head">
          <span className="mnav-head-title">Meni</span>
          <button className="mnav-close" onClick={() => setMobileOpen(false)} aria-label="Zatvori meni">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mnav-body">
          {/* Rješenja accordion */}
          <div className={`mnav-acc${accOpen === "rjesenja" ? " is-open" : ""}`}>
            <button className="mnav-acc-trigger" onClick={() => setAccOpen(a => a === "rjesenja" ? null : "rjesenja")}>
              Rješenja
              <svg className="mnav-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className="mnav-acc-panel">
              <div className="mnav-acc-inner">
                {megaRjesenja.map(item => (
                  <a key={item.slug} href={`/rjesenja/${item.slug}`} className="mnav-sub" onClick={() => setMobileOpen(false)}>
                    <span className="mnav-sub-thumb" style={{ backgroundImage: `url('${item.img}')` }} />
                    <span className="mnav-sub-text"><strong>{item.title}</strong><small>{item.sub}</small></span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Proizvodi accordion */}
          <div className={`mnav-acc${accOpen === "proizvodi" ? " is-open" : ""}`}>
            <button className="mnav-acc-trigger" onClick={() => setAccOpen(a => a === "proizvodi" ? null : "proizvodi")}>
              Proizvodi
              <svg className="mnav-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className="mnav-acc-panel">
              <div className="mnav-acc-inner">
                {megaProizvodi.map(item => (
                  <a key={item.slug} href={`/proizvodi/${item.slug}`} className="mnav-sub" onClick={() => setMobileOpen(false)}>
                    <span className="mnav-sub-thumb" style={{ backgroundImage: `url('${item.img}')` }} />
                    <span className="mnav-sub-text"><strong>{item.title}</strong><small>{item.sub}</small></span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Ostale stranice */}
          {[
            { href: "/pomoc-u-izboru", label: "Pomoć u izboru" },
            { href: "/realizacije", label: "Realizacije" },
            { href: "/dizajn-enterijera", label: "Dizajn enterijera" },
            { href: "/o-nama", label: "O nama" },
            { href: "/blog", label: "Blog" },
            { href: "/kontakt", label: "Kontakt" },
          ].map(link => (
            <a key={link.href} href={link.href} className="mnav-link" onClick={() => setMobileOpen(false)}>{link.label}</a>
          ))}
        </div>

        <div className="mnav-foot">
          <a href="/kontakt" className="mnav-cta" onClick={() => setMobileOpen(false)}>
            Zatražite ponudu
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="tel:+38267038777" className="mnav-phone">+382 67 038 777</a>
        </div>
      </div>
    </>
  );
}
