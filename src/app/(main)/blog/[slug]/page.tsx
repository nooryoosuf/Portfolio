import { articles } from "@/data/blog";
import ArticleDetailContent from "@/components/ArticleDetailContent";

export function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    return <ArticleDetailContent params={params} />;
}
