"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Category = { id: string; name: string; slug: string; order: number };

export default function StraniceProizvodiPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories").then(r => r.json()).then(setCategories);
  }, []);

  async function seedFromConfig() {
    setSeeding(true);
    setSeedMsg("");
    const r = await fetch("/api/admin/seed-proizvodi", { method: "POST" });
    const data = await r.json();
    if (data.inserted === 0) {
      setSeedMsg("Podaci već postoje u bazi — nema šta sinhronizovati.");
    } else {
      setSeedMsg(`Sinhronizovano ${data.inserted} polja iz koda u bazu.`);
    }
    setSeeding(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Proizvodi — stranice</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Uređujte hero, feature sekciju i CTA za svaku kategoriju proizvoda.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <button
            onClick={seedFromConfig}
            disabled={seeding}
            style={{ padding: "9px 18px", background: "#0B1D33", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: seeding ? "not-allowed" : "pointer", opacity: seeding ? 0.7 : 1 }}
          >
            {seeding ? "Sinhronizujem..." : "⬇ Popuni iz koda"}
          </button>
          {seedMsg && <span style={{ fontSize: 12, color: "#0F766E" }}>{seedMsg}</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
            <div style={{ height: 80, background: "linear-gradient(135deg, #0B1D33, #0F766E)", display: "flex", alignItems: "center", padding: "0 20px" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: "rgba(199,241,230,0.7)" }}>/proizvodi/{cat.slug}</div>
              </div>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", gap: 8 }}>
              <Link href={`/admin/stranice/proizvodi/${cat.slug}`} style={{ flex: 1, padding: "9px 14px", background: "#0F766E", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                ✏️ Uredi stranicu
              </Link>
              <a href={`/proizvodi/${cat.slug}`} target="_blank" style={{ padding: "9px 12px", background: "#E6EEF2", color: "#0B1D33", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>👁</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
