import type { Metadata } from "next";
import ProjectDetailContent from "@/components/ProjectDetailContent";
import { createClient } from "@supabase/supabase-js";

// We create a server-side only client for the build process
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const { data } = await supabase
            .from("projects")
            .select("title, description, category, featured_image")
            .eq("slug", slug)
            .single();
        if (!data) return { title: { absolute: "Work — Noor Yoosuf" } };
        const title = `${data.title} — Noor Yoosuf`;
        const description = data.description || `${data.category || "Design"} case study by Noor Yoosuf.`;
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
        return { title: "Work — Noor Yoosuf" };
    }
}

export async function generateStaticParams() {
    try {
        const { data: projects } = await supabase
            .from('projects')
            .select('slug');

        return (projects || []).map((project) => ({
            slug: project.slug,
        }));
    } catch (err) {
        console.error("Failed to generate static params:", err);
        return [];
    }
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    return <ProjectDetailContent params={params} />;
}
