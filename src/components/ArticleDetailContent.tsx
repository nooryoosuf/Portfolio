"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BlockRenderer from "@/components/BlockRenderer";

export default function ArticleDetailContent({ params }: { params: any }) {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                let slugVal = "";
                if (params && typeof params.then === 'function') {
                    const resolved = await params;
                    slugVal = resolved?.slug || "";
                } else if (params && params.slug) {
                    slugVal = params.slug;
                }

                if (!slugVal) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('slug', slugVal)
                    .single();

                if (error || !data) {
                    setPost(null);
                } else {
                    setPost(data);
                }
            } catch (err) {
                console.error("Error fetching article:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [params]);

    if (loading) {
        return (
            <div className="pt-40 pb-32 px-6 flex justify-center items-center min-h-screen bg-white dark:bg-zinc-950">
                <Loader2 className="animate-spin text-zinc-300 dark:text-zinc-700" size={48} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="pt-40 pb-32 px-6 bg-white dark:bg-zinc-950 min-h-screen text-center transition-colors duration-300">
                <div className="max-w-xl mx-auto space-y-6">
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 dark:text-white">Article Not Found</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-light">The journal entry you are looking for does not exist or has been removed.</p>
                    <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article className="pt-40 pb-32 px-6 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Journal Index
                </Link>

                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-6 mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                            <span className="text-razzmatazz">{post.category || 'Design'}</span>
                            <div className="flex items-center gap-1.5 italic"><Calendar size={12} /> {post.created_at ? new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}</div>
                            <div className="flex items-center gap-1.5 italic"><Clock size={12} /> {post.read_time || '5 min read'}</div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tight text-zinc-900 dark:text-white mb-12 leading-[1.05]">
                            {post.title}
                        </h1>

                        {post.description && (
                            <p className="text-2xl md:text-3xl font-heading font-light italic text-zinc-500 dark:text-zinc-400 mb-12 leading-relaxed">
                                "{post.description}"
                            </p>
                        )}
                    </motion.div>
                </header>

                <div className="space-y-20">
                    {post.featured_image && (
                        <div className="aspect-video bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-100 dark:border-zinc-800">
                            <img src={post.featured_image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="max-w-3xl">
                        <BlockRenderer blocks={post.content_blocks} />
                    </div>
                </div>
            </div>
        </article>
    );
}
