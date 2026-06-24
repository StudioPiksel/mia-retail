import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import { prisma } from "@/lib/prisma";
import BlogScrollPopup from "@/components/blog/BlogScrollPopup";
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

      {/* Scroll popup — pojavljuje se na 65% skrola, samo na blog postovima */}
      <BlogScrollPopup />
    </SiteLayout>
  );
}
