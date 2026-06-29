"use client";
import { useState, useRef } from "react";

type Product = {
  id: string; title: string; series?: string | null;
  specs: string; images: string; description?: string | null;
};

export function ProductCard({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const images: string[] = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
  const specs: string[] = (() => { try { return JSON.parse(product.specs); } catch { return []; } })();

  function lbPrev() { setLightbox(i => i !== null && i > 0 ? i - 1 : i); }
  function lbNext() { setLightbox(i => i !== null && i < images.length - 1 ? i + 1 : i); }
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) lbNext();
    else if (diff < -50) lbPrev();
    touchStartX.current = null;
  }

  if (images.length === 0) return null;

  return (
    <>
      <div className="pcard">
        {/* Main image */}
        <div className="pcard-media is-photo" onClick={() => setLightbox(activeImg)} style={{ cursor: "zoom-in" }}>
          <img src={images[activeImg]} alt={product.title} loading="lazy" decoding="async" />
          <span className="pcard-zoom">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </span>
          {images.length > 1 && (
            <span className="pcard-count">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              {images.length}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="pcard-thumbs">
            {images.map((img, i) => (
              <div
                key={i}
                className={`pcard-thumb${activeImg === i ? " active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="pcard-body">
          {product.series && <span className="pcard-series">{product.series}</span>}
          <h3>{product.title}</h3>
          {product.description && <p>{product.description}</p>}
          {specs.length > 0 && (
            <div className="pcard-specs">
              {specs.map(s => <span key={s}>{s}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
        >
          <button onClick={e => { e.stopPropagation(); setLightbox(null); }}
            style={{ position: "fixed", top: 20, right: 24, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>

          {lightbox > 0 && (
            <button onClick={e => { e.stopPropagation(); lbPrev(); }} style={navBtn("left")}>‹</button>
          )}

          <img src={images[lightbox]} alt={product.title} onClick={e => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "82vh", objectFit: "contain", borderRadius: 8, userSelect: "none" }}
            draggable={false} />

          {lightbox < images.length - 1 && (
            <button onClick={e => { e.stopPropagation(); lbNext(); }} style={navBtn("right")}>›</button>
          )}

          <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 10 }}>
              {product.title}{product.series ? ` — ${product.series}` : ""} ({lightbox + 1}/{images.length})
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 6, justifyContent: "center", pointerEvents: "all" }}>
                {images.map((_, i) => (
                  <button key={i} onClick={e => { e.stopPropagation(); setLightbox(i); }} style={{
                    width: i === lightbox ? 20 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.2s", background: i === lightbox ? "#fff" : "rgba(255,255,255,0.35)"
                  }} />
                ))}
              </div>
            )}
            {images.length > 1 && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>← swipe →</div>}
          </div>
        </div>
      )}
    </>
  );
}

const navBtn = (side: "left" | "right"): React.CSSProperties => ({
  position: "fixed", top: "50%", [side]: 20, transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
  borderRadius: "50%", width: 48, height: 48, cursor: "pointer", fontSize: 28,
  display: "flex", alignItems: "center", justifyContent: "center"
});
