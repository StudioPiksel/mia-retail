import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [menuCount, blogCount, userCount] = await Promise.all([
    prisma.menuItem.count(),
    prisma.blogPost.count(),
    prisma.user.count(),
  ]);
  const recentPosts = await prisma.blogPost.findMany({
    take: 5, orderBy: { createdAt: "desc" },
    select: { title: true, category: true, published: true, createdAt: true }
  });

  const cards = [
    { label: "Stavke menija", value: menuCount, color: "#0F766E", href: "/admin/menu" },
    { label: "Blog postovi", value: blogCount, color: "#0B1D33", href: "/admin/blog" },
    { label: "Korisnici", value: userCount, color: "#374151", href: "/admin/users" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0B1D33", margin: 0 }}>
          Dobrodošli, {session.user?.name} 👋
        </h1>
        <p style={{ color: "#6B7B8A", marginTop: 6, fontSize: 14 }}>
          Pregled stanja sajta miaretailsolutions.com
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
        {cards.map((card) => (
          <a key={card.href} href={card.href} style={{
            background: "#fff", borderRadius: 12, padding: "24px 28px",
            border: "1px solid #E2E8ED", textDecoration: "none",
            display: "block", transition: "box-shadow 0.2s"
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 14, color: "#6B7B8A", marginTop: 4 }}>{card.label}</div>
          </a>
        ))}
      </div>

      {/* Recent posts */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8ED", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#0B1D33", margin: 0 }}>Zadnji blog postovi</h2>
          <a href="/admin/blog" style={{ fontSize: 13, color: "#0F766E", textDecoration: "none" }}>Vidi sve →</a>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFB" }}>
              {["Naslov", "Kategorija", "Status", "Datum"].map((h) => (
                <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 12, color: "#6B7B8A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F1F5F7" }}>
                <td style={{ padding: "14px 24px", fontSize: 14, color: "#111827" }}>{post.title}</td>
                <td style={{ padding: "14px 24px" }}>
                  <span style={{ background: "#C7F1E6", color: "#0A5C56", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    {post.category}
                  </span>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <span style={{ background: post.published ? "#DCFCE7" : "#F1F5F7", color: post.published ? "#16A34A" : "#6B7B8A", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    {post.published ? "Objavljeno" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "14px 24px", fontSize: 13, color: "#6B7B8A" }}>
                  {new Date(post.createdAt).toLocaleDateString("sr-Latn")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
