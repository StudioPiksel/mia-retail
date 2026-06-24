import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog & Vodiči | MIA Retail Solutions",
  description: "Kratki tekstovi iz naše svakodnevne prakse koji vam pomažu da bolje razumijete opremu, izbjegnete greške i optimizujete vaš objekat.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;

  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      ...(cat && cat !== "Sve" ? { category: cat } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  const categories = ["Sve", "Vodiči", "Analize", "Trendovi"];
  const activeCategory = cat || "Sve";

  const [featured, ...rest] = posts;

  return (
    <SiteLayout currentPage="/blog">
      {/* HERO */}
      <section className="solution-hero blog-index-hero">
        <div className="container">
          <div className="breadcrumb-container" style={{ border: "none", paddingBottom: 20, paddingTop: 0 }}>
            <nav className="breadcrumb" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Početna</Link>
              <span className="sep">/</span>
              <span className="current" style={{ color: "#fff" }}>Blog</span>
            </nav>
          </div>
          <div className="solution-hero-content">
            <span className="section-eyebrow" style={{ color: "var(--mint)", background: "rgba(255,255,255,0.1)" }}>Znanje iz prakse</span>
            <h1>MIA Insights: <br /><em>Vodiči i trendovi</em></h1>
            <p className="hero-desc">Kratki tekstovi iz naše svakodnevne prakse koji vam pomažu da bolje razumijete opremu, izbjegnete greške i optimizujete vaš objekat.</p>
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="blog-index-section">
        <div className="container">
          {/* Filters */}
          <div className="blog-filters">
            {categories.map((c) => (
              <Link
                key={c}
                href={c === "Sve" ? "/blog" : `/blog?cat=${c}`}
                className={`blog-filter${activeCategory === c ? " active" : ""}`}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="blog-grid blog-grid--index">
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="blog-card blog-card--featured" data-category={featured.category}>
                <span className="blog-card-image">
                  <span className="blog-category">{featured.category}</span>
                  {featured.thumbnail && <img src={featured.thumbnail} alt={featured.title} loading="lazy" decoding="async" />}
                </span>
                <span className="blog-card-body">
                  {featured.publishedAt && (
                    <time>{new Date(featured.publishedAt).toLocaleDateString("sr-Latn", { day: "numeric", month: "long", year: "numeric" })}</time>
                  )}
                  <h3>{featured.title}</h3>
                  {featured.excerpt && <p>{featured.excerpt}</p>}
                  <span className="blog-read-more">Pročitajte članak &rarr;</span>
                </span>
              </Link>
            )}

            {/* Rest of posts */}
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card" data-category={post.category}>
                <span className="blog-card-image">
                  <span className="blog-category">{post.category}</span>
                  {post.thumbnail && <img src={post.thumbnail} alt={post.title} loading="lazy" decoding="async" />}
                </span>
                <span className="blog-card-body">
                  {post.publishedAt && (
                    <time>{new Date(post.publishedAt).toLocaleDateString("sr-Latn", { day: "numeric", month: "long", year: "numeric" })}</time>
                  )}
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <span className="blog-read-more">Pročitajte &rarr;</span>
                </span>
              </Link>
            ))}

            {posts.length === 0 && (
              <p style={{ color: "#6B7B8A", padding: "40px 0" }}>Nema objavljenih postova u ovoj kategoriji.</p>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
