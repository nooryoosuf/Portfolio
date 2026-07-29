import EditProjectClient from "@/components/EditProjectClient";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateStaticParams() {
    try {
        const { data: projects } = await supabase
            .from('projects')
            .select('id');

        return (projects || []).map((project) => ({
            id: project.id.toString(),
        }));
    } catch (err) {
        console.error("Failed to generate static params for edit project:", err);
        return [];
    }
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    return <EditProjectClient params={params} />;
}
