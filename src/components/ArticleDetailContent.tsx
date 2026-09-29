"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BlockRenderer from "@/components/BlockRenderer";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ArticleMeta from "@/components/ui/ArticleMeta";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ImageReveal from "@/components/ui/ImageReveal";
import ArticleCard from "@/components/ui/ArticleCard";
import Reveal from "@/components/ui/Reveal";

export default function ArticleDetailContent({ params }: { params: any }) {
    const [post, setPost] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const reduce = useReducedMotion();

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
                    // Related: same category first, then newest — excluding current
                    const { data: rel } = await supabase
                        .from('blog_posts')
                        .select('id, slug, title, description, category, created_at, read_time, featured_image')
                        .neq('id', data.id)
                        .order('created_at', { ascending: false })
                        .limit(6);
                    const sameCat = (rel || []).filter((r: any) => r.category === data.category);
                    const others = (rel || []).filter((r: any) => r.category !== data.category);
                    setRelated([...sameCat, ...others].slice(0, 2));
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
            <div className="shell-narrow pt-40 pb-32 text-center" aria-label="Loading article">
                <p className="eyebrow animate-pulse">Opening entry</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="shell-narrow pt-40 pb-32 text-center">
                <p className="eyebrow">Missing entry</p>
                <h1 className="display mt-4 text-4xl md:text-5xl">Entry not found</h1>
                <p className="lede mt-5">The journal entry you are looking for does not exist or has been removed.</p>
                <Link href="/blog" className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white dark:bg-white dark:text-zinc-950">
                    <ArrowLeft size={16} aria-hidden /> Back to Journal
                </Link>
            </div>
        );
    }

    return (
        <article className="pb-20 md:pb-28">
            <ReadingProgress />
            <div className="shell-narrow pt-32 md:pt-44">
                <Link
                    href="/blog"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" />
                    Journal index
                </Link>

                <header className="mt-10">
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                            <CategoryBadge label={post.category || 'Design'} tone="brand" />
                            <ArticleMeta date={post.created_at} readTime={post.read_time} />
                        </div>

                        <h1 className="display mt-6 text-4xl sm:text-5xl md:text-6xl">
                            {post.title}
                        </h1>

                        {post.description && (
                            <p className="mt-6 font-serif italic text-xl md:text-2xl leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {post.description}
                            </p>
                        )}

                        <div className="mt-8 flex items-center gap-4 border-y border-zinc-200/80 dark:border-zinc-800/80 py-4">
                            <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 font-heading text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
                                N
                            </span>
                            <div className="text-sm">
                                <p className="font-medium text-zinc-900 dark:text-white">Noor Yoosuf</p>
                                <p className="font-light text-zinc-500 dark:text-zinc-400">Author &amp; designer</p>
                            </div>
                        </div>
                    </motion.div>
                </header>
            </div>

            {post.featured_image && (
                <div className="shell mt-10 md:mt-12">
                    <ImageReveal src={post.featured_image} alt={post.title} aspect="aspect-[16/9]" />
                </div>
            )}

            <div className="shell-narrow mt-12 md:mt-16">
                <BlockRenderer blocks={post.content_blocks} />

                <Reveal className="mt-16 md:mt-20">
                    <nav aria-label="Article footer" className="flex flex-col gap-4 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" />
                            All entries
                        </Link>
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-950 dark:text-white"
                        >
                            Discuss this entry
                            <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </nav>
                </Reveal>
            </div>

            {related.length > 0 ? (
                <div className="shell mt-16 md:mt-24">
                    <Reveal>
                        <p className="eyebrow flex items-center gap-3">
                            <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                            Keep reading
                        </p>
                        <h2 className="display mt-4 text-3xl md:text-4xl">Related entries</h2>
                    </Reveal>
                    <div className="mt-2">
                        {related.map((r, i) => (
                            <ArticleCard
                                key={r.id}
                                index={i}
                                slug={r.slug}
                                title={r.title}
                                description={r.description}
                                category={r.category}
                                createdAt={r.created_at}
                                readTime={r.read_time}
                                featuredImage={r.featured_image}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="shell mt-16 md:mt-24">
                    <Reveal>
                        <nav aria-label="More journal" className="flex items-center justify-between gap-6 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-8">
                            <p className="font-serif italic text-xl text-zinc-500 dark:text-zinc-400">
                                More notes from the journal.
                            </p>
                            <Link
                                href="/blog"
                                className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-950 dark:text-white"
                            >
                                Browse all entries
                                <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </nav>
                    </Reveal>
                </div>
            )}
        </article>
    );
}
