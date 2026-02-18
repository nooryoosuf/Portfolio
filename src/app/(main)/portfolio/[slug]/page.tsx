import ProjectDetailContent from "@/components/ProjectDetailContent";
import { createClient } from "@supabase/supabase-js";

// We create a server-side only client for the build process
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
