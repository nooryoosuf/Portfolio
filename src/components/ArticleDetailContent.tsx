"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { ArrowLeft, Loader2, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BlockRenderer from "@/components/BlockRenderer";

export default function ArticleDetailContent({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('slug', slug)
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
    }, [slug]);

    if (loading) {
        return (
            <div className="pt-40 pb-32 px-6 flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-zinc-100" size={48} />
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <article className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Journal Index
                </Link>

                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-6 mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                            <span className="text-razzmatazz">{post.category}</span>
                            <div className="flex items-center gap-1.5 italic"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                            <div className="flex items-center gap-1.5 italic"><Clock size={12} /> {post.read_time}</div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tight text-zinc-900 mb-12 leading-[1.05]">
                            {post.title}
                        </h1>

                        <p className="text-2xl md:text-3xl font-heading font-light italic text-zinc-500 mb-12 leading-relaxed">
                            "{post.description}"
                        </p>
                    </motion.div>
                </header>

                <div className="space-y-20">
                    {post.featured_image && (
                        <div className="aspect-video bg-zinc-50 rounded-[3rem] overflow-hidden border border-zinc-100">
                            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
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
