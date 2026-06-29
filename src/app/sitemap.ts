import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://miaretailsolutions.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Blog postovi iz DB
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/o-nama`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/realizacije`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/pomoc-u-izboru`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/dizajn-enterijera`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Rješenja stranice
    { url: `${BASE}/rjesenja/supermarketi`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rjesenja/mesnice-ribarnice`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rjesenja/horeca`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rjesenja/pekare`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rjesenja/apoteke-drogerije`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // Proizvodi stranice
    { url: `${BASE}/proizvodi/rashladne-vitrine`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/proizvodi/frizideri-komore`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/proizvodi/checkout-kase`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/proizvodi/policni-sistemi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/proizvodi/kolica-korpe`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/proizvodi/inox-kuhinja`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/proizvodi/usmjeravanje`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
