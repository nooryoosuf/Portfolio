import type { Metadata } from "next";
import ArticleDetailContent from "@/components/ArticleDetailContent";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const { data } = await supabase
            .from("blog_posts")
            .select("title, description, category, featured_image")
            .eq("slug", slug)
            .single();
        if (!data) return { title: { absolute: "Journal — Noor Yoosuf" } };
        const title = `${data.title} — Noor Yoosuf`;
        const description = data.description || `A journal entry on ${data.category || "design"} by Noor Yoosuf.`;
        return {
            title: { absolute: title },
            description,
            openGraph: {
                title,
                description,
                type: "article",
                ...(data.featured_image ? { images: [{ url: data.featured_image }] } : {}),
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                ...(data.featured_image ? { images: [data.featured_image] } : {}),
            },
        };
    } catch {
        return { title: "Journal — Noor Yoosuf" };
    }
}

export async function generateStaticParams() {
    try {
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('slug');

        return (posts || []).map((post) => ({
            slug: post.slug,
        }));
    } catch (err) {
        console.error("Failed to generate static params for blog:", err);
        return [];
    }
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    return <ArticleDetailContent params={params} />;
}
