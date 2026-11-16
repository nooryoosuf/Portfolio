import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { INITIAL_EXPERIMENTS, fetchExperiments } from "@/lib/experiments";

const BASE = "https://nooryoosuf.com";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticRoutes: MetadataRoute.Sitemap = [
        "",
        "/portfolio",
        "/experiments",
        "/blog",
        "/about",
        "/contact",
    ].map((route) => ({
        url: `${BASE}${route}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }));

    try {
        const [{ data: projects }, { data: posts }, experiments] = await Promise.all([
            supabase.from("projects").select("slug, created_at"),
            supabase.from("blog_posts").select("slug, created_at"),
            fetchExperiments({ includeDrafts: false }),
        ]);

        const expList = experiments && experiments.length > 0 ? experiments : INITIAL_EXPERIMENTS;

        const dynamicRoutes: MetadataRoute.Sitemap = [
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
            ...(expList || []).map((e) => ({
                url: `${BASE}/experiments/${e.slug}`,
                lastModified: e.updated_at ? new Date(e.updated_at) : now,
                changeFrequency: "monthly" as const,
                priority: 0.75,
            })),
        ];
        return [...staticRoutes, ...dynamicRoutes];
    } catch {
        return staticRoutes;
    }
}
