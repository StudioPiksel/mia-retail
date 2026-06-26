"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type NavItem = { href: string; label: string; icon: string } | { separator: string };

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "⬛" },

  { separator: "SADRŽAJ" },
  { href: "/admin/navigacija", label: "Navigacija", icon: "🧭" },
  { href: "/admin/blog", label: "Blog", icon: "✏" },
  { href: "/admin/media", label: "Media Library", icon: "🖼" },

  { separator: "PROIZVODI" },
  { href: "/admin/products", label: "Baza proizvoda", icon: "📦" },

  { separator: "STRANICE" },
  { href: "/admin/rjesenja", label: "Rješenja", icon: "🏪" },
  { href: "/admin/stranice/proizvodi", label: "Proizvodi stranice", icon: "🗂" },
  { href: "/admin/realizacije", label: "Realizacije", icon: "🏆" },
  { href: "/admin/dizajn-enterijera", label: "Dizajn enterijera", icon: "🎨" },
  { href: "/admin/o-nama", label: "O nama", icon: "🏢" },
  { href: "/admin/pomoc-u-izboru", label: "Pomoć u izboru", icon: "❓" },
  { href: "/admin/kontakt", label: "Kontakt", icon: "📬" },

  { separator: "SISTEM" },
  { href: "/admin/settings", label: "Postavke", icon: "⚙" },
  { href: "/admin/users", label: "Korisnici", icon: "👤" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/admin/login") return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Satoshi', sans-serif", background: "#F8FAFB" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#0B1D33", color: "#fff",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100
      }}>
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <img src="/assets/images/logo/mia-retail-solutions-vectorized-clean.svg"
            alt="MIA" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <div style={{ fontSize: 11, color: "#C7F1E6", marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Admin Panel
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          {nav.map((item, idx) => {
            if ("separator" in item) {
              return (
                <div key={idx} style={{
                  fontSize: 9, fontWeight: 700, color: "rgba(199,241,230,0.45)",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "14px 10px 5px", marginTop: idx > 0 ? 4 : 0,
                  borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  {item.separator}
                </div>
              );
            }
            const active = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 8, marginBottom: 4,
                color: active ? "#C7F1E6" : "rgba(255,255,255,0.65)",
                background: active ? "rgba(199,241,230,0.1)" : "transparent",
                fontSize: 14, fontWeight: active ? 600 : 400,
                textDecoration: "none", transition: "all 0.2s"
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: 14,
            fontFamily: "'Satoshi', sans-serif"
          }}>
            Odjava
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{
          height: 60, background: "#fff", borderBottom: "1px solid #E2E8ED",
          display: "flex", alignItems: "center", padding: "0 32px",
          position: "sticky", top: 0, zIndex: 50
        }}>
          <span style={{ fontSize: 13, color: "#6B7B8A" }}>
            miaretailsolutions.com &mdash; <strong style={{ color: "#0B1D33" }}>Admin</strong>
          </span>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#6B7B8A" }}>
            <a href="/" target="_blank" style={{ color: "#0F766E", textDecoration: "none" }}>
              Pogledaj sajt →
            </a>
          </span>
        </div>
        <div style={{ padding: 32 }}>{children}</div>
      </main>
    </div>
  );
}
