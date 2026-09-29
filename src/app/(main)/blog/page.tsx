"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ArticleCard from "@/components/ui/ArticleCard";
import Reveal from "@/components/ui/Reveal";

export default function Blog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("All");

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const categories = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => p.category && set.add(p.category));
        return ["All", ...Array.from(set)];
    }, [posts]);

    const visible = filter === "All" ? posts : posts.filter((p) => p.category === filter);

    return (
        <main className="shell pt-32 md:pt-44 pb-20 md:pb-28">
            <header>
                <Reveal>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Journal — {posts.length} {posts.length === 1 ? "entry" : "entries"}
                    </p>
                    <h1 className="display mt-5 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
                        Notes on <em className="serif-accent text-razzmatazz">process.</em>
                    </h1>
                    <p className="lede mt-6 max-w-2xl">
                        Practical entries on branding, interface design, and the decisions behind the work — written to be useful, not just decorative.
                    </p>
                </Reveal>

                {categories.length > 2 && (
                    <Reveal delay={0.1}>
                        <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                            {categories.map((cat) => {
                                const active = filter === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        aria-pressed={active}
                                        className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                                            active
                                                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                                : "border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                )}
            </header>

            <div className="mt-12 md:mt-16">
                {loading ? (
                    <div className="py-24 text-center" aria-label="Loading entries">
                        <p className="eyebrow animate-pulse">Gathering entries</p>
                    </div>
                ) : visible.length > 0 ? (
                    <div>
                        {visible.map((post, index) => (
                            <ArticleCard
                                key={post.id}
                                index={index}
                                slug={post.slug}
                                title={post.title}
                                description={post.description}
                                category={post.category}
                                createdAt={post.created_at}
                                readTime={post.read_time}
                                featuredImage={post.featured_image}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border-y border-zinc-200/80 dark:border-zinc-800/80 py-20 text-center">
                        <p className="font-serif italic text-2xl text-zinc-400 dark:text-zinc-500">Nothing filed here yet.</p>
                        <p className="mt-2 text-sm font-light text-zinc-500 dark:text-zinc-400">New entries are on the way — check back soon.</p>
                    </div>
                )}
            </div>

        </main>
    );
}
