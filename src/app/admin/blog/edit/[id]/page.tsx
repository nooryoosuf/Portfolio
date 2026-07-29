import EditBlogPostClient from "@/components/EditBlogPostClient";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateStaticParams() {
    try {
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('id');

        return (posts || []).map((post) => ({
            id: post.id.toString(),
        }));
    } catch (err) {
        console.error("Failed to generate static params for edit blog:", err);
        return [];
    }
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    return <EditBlogPostClient params={params} />;
}
