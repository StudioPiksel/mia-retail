"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header({ currentPage = "" }: { currentPage?: string }) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Sticky scroll
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
        feature.href = el.closest("a")?.href ?? "#";
        header.querySelectorAll(".mega-item").forEach(i => i.classList.remove("is-active"));
        el.classList.add("is-active");
      });
    });

    // Mobile toggle
    const toggle = header.querySelector<HTMLButtonElement>(".mobile-menu-toggle");
    const nav = header.querySelector<HTMLElement>(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open");
      });
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

          <nav className="main-nav" aria-label="Glavna navigacija">
            <ul className="nav-list">
              {/* RJEŠENJA */}
              <li className="nav-item has-mega" data-mega="rjesenja">
                <a href="#" className="nav-link">
                  Rješenja <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <div className="mega-menu mega-menu--rjesenja">
                  <div className="mega-inner">
                    <div className="mega-list">
                      <span className="mega-eyebrow">Rješenja po industriji</span>
                      {[
                        { href: "/rjesenja/supermarketi", img: "/assets/images/megamenu/supermarketi.jpg", title: "Supermarketi & Maloprodaja", desc: "Kompletno opremanje objekata od 200 do 5.000 m² — rashlada, checkout, police i kolica.", sub: "Rashlada · Checkout · Police · Kolica", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg> },
                        { href: "/rjesenja/mesnice-ribarnice", img: "/assets/images/megamenu/mesnice.jpg", title: "Mesnice & Ribarnice", desc: "Rashladne vitrine, inox oprema i radne površine za svjež program.", sub: "Vitrine · Inox · Radne površine", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v6H4z"/><path d="M6 10v10"/><path d="M18 10v10"/><path d="M6 15h12"/></svg> },
                        { href: "/rjesenja/horeca", img: "/assets/images/megamenu/horeca.jpg", title: "HoReCa & Ugostiteljstvo", desc: "Profesionalne kuhinje, šankovi i rashladni sistemi za restorane i hotele.", sub: "Kuhinje · Šankovi · Rashlada", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2v7a3 3 0 006 0V2"/><path d="M9 2v20"/><path d="M16 2c-1.5 1.5-2 4-2 6s.5 4 2 5v9"/></svg> },
                        { href: "/rjesenja/pekare", img: "/assets/images/megamenu/pekare-v2.jpg", title: "Pekare & Poslastičarnice", desc: "Vitrine za pekarski i poslastičarski program uz toplu prezentaciju.", sub: "Tople vitrine · Izlozi · Police", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 13a8 8 0 0116 0v3H4z"/><path d="M2 20h20"/></svg> },
                        { href: "/rjesenja/apoteke-drogerije", img: "/assets/images/megamenu/apoteke.jpg", title: "Apoteke & Drogerije", desc: "Polični sistemi, pultovi i rasvjeta za uredan i pregledan prostor.", sub: "Police · Pultovi · Rasvjeta", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 7v10M7 12h10"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg> },
                      ].map((item) => (
                        <a key={item.href} href={item.href} className={`mega-item${currentPage === item.href ? " is-active" : ""}`} data-img={item.img} data-title={item.title} data-desc={item.desc}>
                          <span className="mega-item-icon">{item.icon}</span>
                          <span className="mega-item-text"><strong>{item.title}</strong><small>{item.sub}</small></span>
                        </a>
                      ))}
                    </div>
                    <a href="/rjesenja/supermarketi" className="mega-feature" id="megaFeatureRjesenja">
                      <span className="mega-feature-img" style={{ backgroundImage: "url('/assets/images/megamenu/supermarketi.jpg')" }}></span>
                      <span className="mega-feature-body">
                        <strong className="mega-feature-title">Supermarketi & Maloprodaja</strong>
                        <span className="mega-feature-desc">Kompletno opremanje objekata od 200 do 5.000 m² — rashlada, checkout, police i kolica.</span>
                        <span className="mega-feature-cta">Pogledajte rješenje <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                      </span>
                    </a>
                  </div>
                </div>
              </li>

              {/* PROIZVODI */}
              <li className="nav-item has-mega" data-mega="proizvodi">
                <a href="#" className="nav-link">
                  Proizvodi <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <div className="mega-menu mega-menu--proizvodi">
                  <div className="mega-grid">
                    {[
                      { href: "/proizvodi/rashladne-vitrine", img: "/assets/images/megamenu/thumb-rashladna.jpg", title: "Rashladne vitrine", sub: "CURVE · CUBE · zakrivljeno i ravno staklo" },
                      { href: "/proizvodi/frizideri-komore", img: "/assets/images/megamenu/thumb-frizideri.jpg", title: "Frižideri & komore", sub: "Uspravni · staklena vrata · hladne komore" },
                      { href: "/proizvodi/checkout-kase", img: "/assets/images/megamenu/thumb-kasa.jpg", title: "Checkout & Kasa pultovi", sub: "Standard · Premium · SmartPos · Netris" },
                      { href: "/proizvodi/policni-sistemi", img: "/assets/images/megamenu/thumb-polica.jpg", title: "Polični sistemi", sub: "Gondole · pusheri · cjenovne šine · LED" },
                      { href: "/proizvodi/kolica-korpe", img: "/assets/images/megamenu/thumb-kolica.jpg", title: "Kolica & Korpe", sub: "Samba · žičana · korpe · trolley" },
                      { href: "/proizvodi/inox-kuhinja", img: "/assets/images/megamenu/thumb-inox.jpg", title: "Inox & Kuhinjska oprema", sub: "Radni stolovi · sudopere · termička linija" },
                      { href: "/proizvodi/usmjeravanje", img: "/assets/images/megamenu/thumb-usmjeravanje.jpg", title: "Usmjeravanje kupaca", sub: "Ulazne rampe · turniketi · barijere · ITAB" },
                    ].map((item) => (
                      <a key={item.href} href={item.href} className="mega-card">
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
                { href: "/reference", label: "Reference" },
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

          <button className="mobile-menu-toggle" aria-label="Otvori meni" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    </>
  );
}
