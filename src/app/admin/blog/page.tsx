"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = { id: string; title: string; category: string; published: boolean; createdAt: string; slug: string; };

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("Sve");

  async function load() {
    const res = await fetch("/api/blog");
    setPosts(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Obrisati post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(post: Post) {
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published, publishedAt: !post.published ? new Date() : null })
    });
    await load();
  }

  const categories = ["Sve", "Vodiči", "Analize", "Trendovi"];
  const filtered = filter === "Sve" ? posts : posts.filter(p => p.category === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Blog postovi</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{posts.length} postova ukupno</p>
        </div>
        <Link href="/admin/blog/new" style={{
          padding: "11px 22px", background: "#0F766E", color: "#fff",
          borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600
        }}>+ Novi post</Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "7px 16px", borderRadius: 20, border: "1.5px solid",
            borderColor: filter === c ? "#0F766E" : "#E2E8ED",
            background: filter === c ? "#C7F1E6" : "#fff",
            color: filter === c ? "#0A5C56" : "#6B7B8A",
            cursor: "pointer", fontSize: 13, fontWeight: filter === c ? 600 : 400,
            fontFamily: "'Satoshi', sans-serif"
          }}>{c}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFB" }}>
              {["Naslov", "Kategorija", "Status", "Datum", "Akcije"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#6B7B8A", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(post => (
              <tr key={post.id} style={{ borderTop: "1px solid #F1F5F7" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7B8A", marginTop: 2 }}>/blog/{post.slug}</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ background: "#C7F1E6", color: "#0A5C56", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    {post.category}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button onClick={() => togglePublish(post)} style={{
                    background: post.published ? "#DCFCE7" : "#F1F5F7",
                    color: post.published ? "#16A34A" : "#6B7B8A",
                    border: "none", padding: "4px 12px", borderRadius: 20, fontSize: 12,
                    fontWeight: 500, cursor: "pointer", fontFamily: "'Satoshi', sans-serif"
                  }}>
                    {post.published ? "✓ Objavljeno" : "○ Draft"}
                  </button>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6B7B8A" }}>
                  {new Date(post.createdAt).toLocaleDateString("sr-Latn")}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/admin/blog/${post.id}`} style={{
                      background: "#E6EEF2", color: "#0B1D33", padding: "6px 14px",
                      borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: "none"
                    }}>Uredi</Link>
                    <button onClick={() => handleDelete(post.id)} style={{
                      background: "#FEF2F2", color: "#DC2626", border: "none",
                      padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500
                    }}>Obriši</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#6B7B8A", fontSize: 14 }}>Nema postova.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
