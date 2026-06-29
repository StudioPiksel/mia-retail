"use client";
import { useState } from "react";
import Link from "next/link";

type Realizacija = { id: string; name: string; country: string; images: string; categories: string; order: number };

const FILTERS = [
  { key: "all", label: "Sve realizacije" },
  { key: "supermarketi", label: "Supermarketi" },
  { key: "police", label: "Police i opremanje" },
  { key: "korpe", label: "Korpe i kolica" },
  { key: "horeca", label: "HoReCa & specijalizovano" },
];

export default function RealizacijeClient({ items }: { items: Realizacija[] }) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<{ imgs: string[]; name: string; country: string; idx: number } | null>(null);

  function openLightbox(item: Realizacija, startIdx = 0) {
    const imgs: string[] = (() => { try { return JSON.parse(item.images); } catch { return []; } })();
    if (!imgs.length) return;
    setLightbox({ imgs, name: item.name, country: item.country, idx: startIdx });
  }

  const filtered = items.filter(item => {
    if (filter === "all") return true;
    const cats: string[] = (() => { try { return JSON.parse(item.categories); } catch { return []; } })();
    return cats.includes(filter);
  });

  return (
    <>
      {/* HERO */}
      <section style={{
        position: "relative", background: "linear-gradient(120deg, #0B1D33 0%, #0d2237 100%)",
        color: "#fff", padding: "120px 0 72px", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,118,110,0.35), transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 820 }}>
            <nav className="breadcrumb" style={{ marginBottom: 20 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Početna</Link>
              <span style={{ color: "rgba(255,255,255,0.45)", margin: "0 8px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.45)" }}>Realizacije</span>
            </nav>
            <span style={{ display: "inline-block", padding: "6px 14px", background: "rgba(199,241,230,0.15)", border: "1px solid rgba(199,241,230,0.4)", color: "#C7F1E6", fontSize: 13, fontWeight: 600, borderRadius: 100, letterSpacing: "0.05em", marginBottom: 20 }}>REALIZACIJE</span>
            <h1 style={{ fontSize: "3.25rem", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
              Naša rješenja u vodećim{" "}
              <span style={{ color: "#0F766E" }}>svjetskim<br />trgovinama</span>
            </h1>
            <p style={{ fontSize: "1.075rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: 660, margin: 0 }}>
              Oprema koju nudimo ugrađena je u objekte vodećih svjetskih maloprodajnih lanaca.
              Pogledajte realizacije naših provjerenih partnera — grupisane po brendu i tipu objekta.
            </p>
            <div className="reference-stats">
              <div className="stat-item"><span className="stat-number">37+</span><span className="stat-label">Realizacija</span></div>
              <div className="stat-item"><span className="stat-number">15+</span><span className="stat-label">Zemalja</span></div>
              <div className="stat-item"><span className="stat-number">Top</span><span className="stat-label">Svjetski brendovi</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="reference-gallery-section">
        <div className="container">
          <div className="gallery-filters">
            {FILTERS.map(f => (
              <button key={f.key} className={`filter-btn${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="brand-grid">
            {filtered.map((item) => {
              const imgs: string[] = (() => { try { return JSON.parse(item.images); } catch { return []; } })();
              return (
                <article key={item.id} className="brand-card" tabIndex={0}
                  onClick={() => openLightbox(item)} onKeyDown={e => (e.key === "Enter" || e.key === " ") && openLightbox(item)}
                  style={{ cursor: "pointer" }}>
                  <div className="brand-card-media">
                    {imgs[0] && <img src={imgs[0]} alt={`${item.name} — ${item.country}`} loading="lazy" decoding="async" />}
                    {imgs.length > 1 && <span className="card-count">{imgs.length} fotografije</span>}
                    <span className="card-zoom" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </span>
                  </div>
                  <div className="brand-card-body">
                    <h3 className="brand-card-name">{item.name}</h3>
                    <span className="brand-card-country">{item.country}</span>
                  </div>
                </article>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#6B7B8A" }}>Nema realizacija u ovoj kategoriji.</div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <>
          <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9998 }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <button onClick={() => setLightbox(null)} style={{ position: "fixed", top: 20, right: 24, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 20, pointerEvents: "all", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            {lightbox.idx > 0 && (
              <button onClick={() => setLightbox({ ...lightbox, idx: lightbox.idx - 1 })} style={{ position: "fixed", top: "50%", left: 20, transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "50%", width: 52, height: 52, cursor: "pointer", fontSize: 32, pointerEvents: "all", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            )}
            <img src={lightbox.imgs[lightbox.idx]} alt={lightbox.name} style={{ maxWidth: "88vw", maxHeight: "82vh", objectFit: "contain", borderRadius: 8, pointerEvents: "none" }} />
            {lightbox.idx < lightbox.imgs.length - 1 && (
              <button onClick={() => setLightbox({ ...lightbox, idx: lightbox.idx + 1 })} style={{ position: "fixed", top: "50%", right: 20, transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "50%", width: 52, height: 52, cursor: "pointer", fontSize: 32, pointerEvents: "all", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            )}
            <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", color: "#fff", textAlign: "center", pointerEvents: "none" }}>
              <div style={{ fontWeight: 700 }}>{lightbox.name} · {lightbox.country}</div>
              {lightbox.imgs.length > 1 && (
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
                  {lightbox.imgs.map((_, i) => (
                    <button key={i} onClick={() => setLightbox({ ...lightbox, idx: i })}
                      style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, pointerEvents: "all", background: i === lightbox.idx ? "#fff" : "rgba(255,255,255,0.35)" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <link rel="stylesheet" href="/reference.css" />
    </>
  );
}
