"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Pogrešan email ili lozinka.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0B1D33",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Satoshi', sans-serif"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "48px 40px",
        width: "100%", maxWidth: 400, boxShadow: "0 24px 64px rgba(11,29,51,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src="/assets/images/logo/mia-retail-solutions-vectorized-clean.svg"
            alt="MIA" style={{ height: 36, margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0B1D33", margin: 0 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 14, color: "#6B7B8A", margin: "6px 0 0" }}>
            Prijavite se na upravljački panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required placeholder="admin@miaretailsolutions.com"
              style={{
                width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8ED",
                borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif",
                outline: "none", boxSizing: "border-box", color: "#111827"
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
              Lozinka
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={{
                width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8ED",
                borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif",
                outline: "none", boxSizing: "border-box", color: "#111827"
              }}
            />
          </div>
          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8,
              padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16
            }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px", background: loading ? "#94a3b8" : "#0F766E",
            color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Satoshi', sans-serif",
            transition: "background 0.2s"
          }}>
            {loading ? "Prijava..." : "Prijavite se"}
          </button>
        </form>
      </div>
    </div>
  );
}
