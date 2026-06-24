"use client";
import { useEffect, useState, useRef } from "react";

export default function BlogScrollPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(1);
  const [interest, setInterest] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const triggered = useRef(false);

  useEffect(() => {
    // Don't show again this session if dismissed
    if (sessionStorage.getItem("mia-popup-dismissed")) return;

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
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("mia-popup-dismissed", "1");
  }

  function nextStep() {
    if (step === 1 && !interest) { setError("Molimo odaberite oblast interesa."); return; }
    if (step === 2 && !name.trim()) { setError("Molimo unesite vaše ime."); return; }
    setError("");
    setStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) { setError("Molimo unesite telefon."); return; }
    setError("");
    // In production: send to API
    setSubmitted(true);
  }

  if (dismissed || !visible) return null;

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0, background: "rgba(11,29,51,0.55)",
          zIndex: 9998, backdropFilter: "blur(2px)",
          animation: "miafade 0.25s ease"
        }}
      />

      {/* Card */}
      <div style={{
        position: "fixed", bottom: 32, right: 32, width: 420,
        background: "#fff", borderRadius: 20,
        boxShadow: "0 24px 64px rgba(11,29,51,0.25)",
        zIndex: 9999, fontFamily: "'Satoshi', sans-serif",
        animation: "miaslide 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        overflow: "hidden",
        maxWidth: "calc(100vw - 32px)"
      }}>
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Zatvorite"
          style={{
            position: "absolute", top: 16, right: 16, background: "none",
            border: "none", cursor: "pointer", color: "#6B7B8A", padding: 4,
            borderRadius: 6, display: "flex"
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div style={{ padding: "28px 28px 0" }}>
          {!submitted ? (
            <>
              {/* Head */}
              <span style={{
                display: "inline-block", background: "#C7F1E6", color: "#0A5C56",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, marginBottom: 12
              }}>Kompletna ponuda</span>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", marginBottom: 8, lineHeight: 1.3 }}>
                Ovo je samo dio našeg asortimana
              </h3>
              <p style={{ fontSize: 14, color: "#6B7B8A", marginBottom: 20, lineHeight: 1.6 }}>
                Nudimo mnogo više nego što stane na jednu stranicu. Ostavite nam par detalja — javimo se sa konkretnim prijedlogom.
              </p>

              {/* Progress */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ height: 4, background: "#E6EEF2", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: "#0F766E", borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontSize: 12, color: "#6B7B8A" }}>Korak <strong style={{ color: "#0B1D33" }}>{step}</strong> / 3</span>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1 */}
                {step === 1 && (
                  <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
                      Šta vas zanima?
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                      {["Supermarket / Maloprodaja","Mesnica / Ribarnica","HoReCa / Ugostiteljstvo","Pekara / Poslastičarnica","Apoteka / Drogerija","Rashladna oprema","Polični sistemi","Inox & kuhinja","Nešto drugo"].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setInterest(opt); setError(""); }}
                          style={{
                            padding: "7px 14px", borderRadius: 20, border: "1.5px solid",
                            borderColor: interest === opt ? "#0F766E" : "#E2E8ED",
                            background: interest === opt ? "#C7F1E6" : "#fff",
                            color: interest === opt ? "#0A5C56" : "#374151",
                            fontSize: 13, cursor: "pointer", fontFamily: "'Satoshi', sans-serif",
                            fontWeight: interest === opt ? 600 : 400, transition: "all 0.15s"
                          }}
                        >{opt}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={lbl}>Ime i prezime *</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Vaše ime" style={inp} autoFocus />
                    </div>
                    <div>
                      <label style={lbl}>Naziv firme (opciono)</label>
                      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Kompanija" style={inp} />
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={lbl}>Telefon *</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+382 ..." type="tel" style={inp} autoFocus />
                    </div>
                    <div>
                      <label style={lbl}>Email (opciono)</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@firma.com" type="email" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Poruka (opciono)</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2}
                        placeholder="Ukratko o projektu, lokaciji, rokovima..."
                        style={{ ...inp, resize: "none" }} />
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: 10, fontSize: 13, color: "#DC2626", background: "#FEF2F2", padding: "8px 12px", borderRadius: 8 }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 20, paddingBottom: 24 }}>
                  {step > 1 && (
                    <button type="button" onClick={() => { setStep(s => s - 1); setError(""); }}
                      style={{ padding: "11px 18px", border: "1.5px solid #E2E8ED", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "'Satoshi', sans-serif", color: "#374151" }}>
                      Nazad
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={nextStep}
                      style={{ flex: 1, padding: "11px 20px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Dalje
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  ) : (
                    <button type="submit"
                      style={{ flex: 1, padding: "11px 20px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Pošaljite upit
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  )}
                </div>
              </form>
              <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", paddingBottom: 20, marginTop: -8 }}>
                Bez obaveze · Vaši podaci su zaštićeni · Odgovor u najkraćem roku
              </p>
            </>
          ) : (
            /* Success */
            <div style={{ textAlign: "center", padding: "20px 0 32px" }}>
              <div style={{ width: 64, height: 64, background: "#C7F1E6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", marginBottom: 8 }}>Hvala! Vaš upit je poslat.</h3>
              <p style={{ fontSize: 14, color: "#6B7B8A", marginBottom: 20 }}>Javićemo vam se u najkraćem roku.</p>
              <button onClick={dismiss}
                style={{ padding: "10px 24px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>
                Zatvori
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes miafade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes miaslide { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inp: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 10,
  fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none",
  boxSizing: "border-box", color: "#111827", background: "#fff", display: "block"
};
