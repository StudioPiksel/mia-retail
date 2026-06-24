import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.productCategory.findUnique({ where: { slug } });
  if (!cat) return {};
  return { title: `${cat.name} | MIA Retail Solutions` };
}

export default async function ProizvodiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.productCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, published: true },
    orderBy: { order: "asc" },
  });

  const allCategories = await prisma.productCategory.findMany({ orderBy: { order: "asc" } });

  return (
    <SiteLayout currentPage={`/proizvodi/${slug}`} extraCss={["/rjesenja.css"]}>
      {/* Hero */}
      <section className="solution-hero blog-index-hero">
        <div className="container">
          <div className="breadcrumb-container" style={{ border: "none", paddingBottom: 20, paddingTop: 0 }}>
            <nav className="breadcrumb" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Početna</Link>
              <span className="sep">/</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Proizvodi</span>
              <span className="sep">/</span>
              <span className="current" style={{ color: "#fff" }}>{category.name}</span>
            </nav>
          </div>
          <div className="solution-hero-content">
            <span className="section-eyebrow" style={{ color: "var(--mint)", background: "rgba(255,255,255,0.1)" }}>
              Katalog opreme
            </span>
            <h1>{category.name}</h1>
            <p className="hero-desc">{products.length} proizvoda u ovoj kategoriji</p>
          </div>
        </div>
      </section>

      {/* Category nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8ED", position: "sticky", top: 60, zIndex: 40 }}>
        <div className="container" style={{ display: "flex", gap: 4, overflowX: "auto", padding: "12px 24px" }}>
          {allCategories.map(cat => (
            <Link key={cat.slug} href={`/proizvodi/${cat.slug}`} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: cat.slug === slug ? 600 : 400,
              background: cat.slug === slug ? "#C7F1E6" : "#F8FAFB",
              color: cat.slug === slug ? "#0A5C56" : "#374151",
              border: cat.slug === slug ? "1.5px solid #0F766E" : "1.5px solid #E2E8ED",
              textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0
            }}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container">
          <div className="pcard-grid pcard-grid--4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7B8A" }}>
              Nema objavljenih proizvoda u ovoj kategoriji.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" style={{ background: "var(--navy)", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 20 }}>Tražite specifičan model?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Kontaktirajte nas — naš tim će vam predložiti pravo rješenje za vaš objekat.
          </p>
          <Link href="/kontakt" className="btn-primary">Zatražite ponudu →</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
