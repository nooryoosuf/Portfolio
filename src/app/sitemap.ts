import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE = "https://nooryoosuf.com";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = ["", "/portfolio", "/blog", "/about", "/contact"].map(
    (route) => ({
      url: `${BASE}${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.8,
    })
  );

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [{ data: projects }, { data: posts }] = await Promise.all([
      supabase.from("projects").select("slug, created_at"),
      supabase.from("blog_posts").select("slug, created_at"),
    ]);
    const dynamic: MetadataRoute.Sitemap = [
      ...(projects || []).map((p: any) => ({
        url: `${BASE}/portfolio/${p.slug}`,
        lastModified: p.created_at ? new Date(p.created_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...(posts || []).map((p: any) => ({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.created_at ? new Date(p.created_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
    return [...staticRoutes, ...dynamic];
  } catch {
    return staticRoutes;
  }
}
