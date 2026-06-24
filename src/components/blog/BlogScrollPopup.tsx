"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function BlogScrollPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("mia-cta-dismissed")) return;

    const onScroll = () => {
      if (triggered.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.body.scrollHeight;
      if (scrolled / total >= 0.65) {
        triggered.current = true;
        setVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      sessionStorage.setItem("mia-cta-dismissed", "1");
    }, 280);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes mia-popup-in {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mia-popup-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(16px) scale(0.98); }
        }
        @keyframes mia-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mia-fade-out { from { opacity: 1 } to { opacity: 0 } }

        .mia-popup-backdrop {
          position: fixed; inset: 0;
          background: rgba(11,29,51,0.45);
          backdrop-filter: blur(3px);
          z-index: 9990;
          animation: mia-fade-in 0.25s ease forwards;
        }
        .mia-popup-backdrop.closing {
          animation: mia-fade-out 0.28s ease forwards;
        }

        .mia-popup-card {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 440px;
          max-width: calc(100vw - 32px);
          background: #0B1D33;
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(11,29,51,0.45), 0 0 0 1px rgba(199,241,230,0.1);
          z-index: 9991;
          overflow: hidden;
          animation: mia-popup-in 0.32s cubic-bezier(0.34,1.4,0.64,1) forwards;
          font-family: 'Satoshi', sans-serif;
        }
        .mia-popup-card.closing {
          animation: mia-popup-out 0.28s ease forwards;
        }

        .mia-popup-glow {
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(15,118,110,0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        .mia-popup-close {
          position: absolute;
          top: 14px; right: 14px;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .mia-popup-close:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .mia-popup-body {
          padding: 32px 32px 28px;
          text-align: center;
        }

        .mia-popup-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C7F1E6;
          background: rgba(199,241,230,0.12);
          border: 1px solid rgba(199,241,230,0.2);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .mia-popup-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin: 0 0 10px;
        }

        .mia-popup-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          line-height: 1.65;
          margin: 0 0 24px;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        .mia-popup-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: #0F766E;
          color: #fff;
          font-family: 'Satoshi', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .mia-popup-btn:hover {
          background: #0A5C56;
          transform: translateY(-1px);
        }

        .mia-popup-note {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 14px;
        }

        @media (max-width: 500px) {
          .mia-popup-card {
            bottom: 0; right: 0; left: 0;
            width: 100%;
            max-width: 100%;
            border-radius: 20px 20px 0 0;
          }
          .mia-popup-body { padding: 28px 24px 32px; }
          .mia-popup-title { font-size: 20px; }
        }
      `}</style>

      {/* Backdrop */}
      <div className={`mia-popup-backdrop${closing ? " closing" : ""}`} onClick={dismiss} />

      {/* Card */}
      <div className={`mia-popup-card${closing ? " closing" : ""}`} role="dialog" aria-modal="true" aria-label="Trebate savjet?">
        <div className="mia-popup-glow" />

        <button className="mia-popup-close" onClick={dismiss} aria-label="Zatvorite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="mia-popup-body">
          <span className="mia-popup-eyebrow">Besplatna konsultacija</span>
          <h3 className="mia-popup-title">Trebate savjet za vaš objekat?</h3>
          <p className="mia-popup-desc">
            Naš tim stručnjaka vam stoji na raspolaganju za besplatne konsultacije i odabir prave opreme za vaš projekat.
          </p>
          <Link href="/kontakt" className="mia-popup-btn" onClick={dismiss}>
            Kontaktirajte nas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <p className="mia-popup-note">Bez obaveze · Odgovor u roku 24h</p>
        </div>
      </div>
    </>
  );
}
