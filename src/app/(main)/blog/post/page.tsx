"use client";
import ArticleDetailContent from "@/components/ArticleDetailContent";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function PostViewer() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug") || "";
    return <ArticleDetailContent params={Promise.resolve({ slug })} />;
}

export default function PostPage() {
    return (
        <Suspense fallback={<div className="pt-40 pb-32 px-6 flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-zinc-100" size={48} /></div>}>
            <PostViewer />
        </Suspense>
    );
}
