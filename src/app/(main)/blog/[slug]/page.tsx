import ArticleDetailContent from "@/components/ArticleDetailContent";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
