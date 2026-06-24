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

  return (
    <SiteLayout currentPage="/blog" extraCss={["/blog-article.css"]}>
      <article className="single-article">
        <div className="container">
          <header className="article-header">
            <div className="article-meta">
              <span className="article-category">{post.category}</span>
              {post.publishedAt && (
                <span className="article-date">
                  {new Date(post.publishedAt).toLocaleDateString("sr-Latn", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
            <h1>{post.title}</h1>
          </header>

          <div className="article-container">
            {post.thumbnail && (
              <div className="article-hero-image">
                <img src={post.thumbnail} alt={post.title} decoding="async" loading="lazy" />
              </div>
            )}

            <div className="article-content">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <footer className="article-footer">
              <div className="article-share">
                <span>Podijelite članak:</span>
                <a href="#" className="share-btn">LinkedIn</a>
                <a href="#" className="share-btn">Facebook</a>
                <a href="#" className="share-btn">Email</a>
              </div>
            </footer>
          </div>
        </div>
      </article>

      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Trebate savjet za vaš objekat?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Naš tim stručnjaka vam stoji na raspolaganju za besplatne konsultacije i odabir prave opreme.
          </p>
          <Link href="/kontakt" className="btn-primary">
            Kontaktirajte nas <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
