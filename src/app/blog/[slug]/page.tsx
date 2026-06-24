import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: `${post.title} | MIA Retail Solutions`, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await prisma.blogPost.findMany({
    where: { published: true, category: post.category, NOT: { id: post.id } },
    take: 2,
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, category: true, thumbnail: true, publishedAt: true },
  });

  return (
    <SiteLayout currentPage="/blog">
      <article className="article-page">
        {/* Article Hero */}
        {post.thumbnail && (
          <div className="article-hero" style={{ backgroundImage: `url('${post.thumbnail}')` }}>
            <div className="article-hero-overlay"></div>
          </div>
        )}

        <div className="article-layout">
          <div className="article-main">
            {/* Breadcrumb */}
            <nav className="breadcrumb" style={{ marginBottom: 24 }}>
              <Link href="/">Početna</Link>
              <span className="sep">/</span>
              <Link href="/blog">Blog</Link>
              <span className="sep">/</span>
              <span className="current">{post.title}</span>
            </nav>

            <header className="article-header">
              <span className="blog-category">{post.category}</span>
              <h1>{post.title}</h1>
              {post.publishedAt && (
                <div className="article-meta">
                  <time>{new Date(post.publishedAt).toLocaleDateString("sr-Latn", { day: "numeric", month: "long", year: "numeric" })}</time>
                </div>
              )}
            </header>

            {post.excerpt && (
              <p className="article-lead">{post.excerpt}</p>
            )}

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className="article-footer">
              <div className="article-share">
                <span>Podijelite članak:</span>
                <a href="#" className="share-btn">LinkedIn</a>
                <a href="#" className="share-btn">Facebook</a>
                <a href="#" className="share-btn">Email</a>
              </div>
            </footer>
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            <div className="sidebar-widget">
              <h4>Kategorije</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Vodiči", "Analize", "Trendovi"].map((c) => (
                  <Link key={c} href={`/blog?cat=${c}`} style={{
                    padding: "8px 14px", background: post.category === c ? "var(--mint)" : "var(--gray-100)",
                    color: post.category === c ? "var(--teal-dark)" : "var(--gray-700)",
                    borderRadius: 8, fontSize: 14, fontWeight: post.category === c ? 600 : 400,
                    textDecoration: "none"
                  }}>{c}</Link>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div className="sidebar-widget" style={{ marginTop: 28 }}>
                <h4>Slični članci</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                      {r.thumbnail && <img src={r.thumbnail} alt={r.title} style={{ width: "100%", borderRadius: 8, marginBottom: 8, aspectRatio: "16/9", objectFit: "cover" }} />}
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="sidebar-widget sidebar-cta" style={{ marginTop: 28, background: "var(--navy)", borderRadius: 12, padding: 24, color: "#fff" }}>
              <h4 style={{ color: "#fff", marginBottom: 8 }}>Trebate savjet?</h4>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>Naš tim stoji na raspolaganju za besplatne konsultacije.</p>
              <Link href="/kontakt" className="btn-primary" style={{ display: "inline-block" }}>Kontaktirajte nas →</Link>
            </div>
          </aside>
        </div>
      </article>

      {/* CTA Band */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Trebate savjet za vaš objekat?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Naš tim stručnjaka vam stoji na raspolaganju za besplatne konsultacije i odabir prave opreme.
          </p>
          <Link href="/kontakt" className="btn-primary">Kontaktirajte nas →</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
