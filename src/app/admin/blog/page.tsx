"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, FileText as BlogIcon, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminBlog() {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error: any) {
            console.error("Error fetching posts:", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function deletePost(id: string) {
        if (!confirm("Delete this entry permanently?")) return;

        try {
            const { error } = await supabase.from('blog_posts').delete().match({ id });
            if (error) throw error;
            setPosts(posts.filter(p => p.id !== id));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error: any) {
            alert(error.message);
        }
    }

    const categories = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => p.category && set.add(p.category));
        return ["All", ...Array.from(set)];
    }, [posts]);

    const filteredPosts = posts.filter(post => {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
            post.title.toLowerCase().includes(q) ||
            (post.category || "").toLowerCase().includes(q);
        const matchesCat = category === "All" || post.category === category;
        return matchesQuery && matchesCat;
    });

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">Journal</h1>
                    <p className="lede mt-3 !text-base">
                        {posts.length} {posts.length === 1 ? "entry" : "entries"} published.
                    </p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-zinc-950 px-7 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                    <Plus size={18} aria-hidden />
                    Write article
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search aria-hidden className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <label htmlFor="post-search" className="sr-only">Search entries</label>
                    <input
                        id="post-search"
                        type="text"
                        placeholder="Filter by title or topic…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="min-h-[52px] w-full rounded-full border border-zinc-200 bg-white py-3 pl-12 pr-6 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-100"
                    />
                </div>
                <label htmlFor="post-category" className="sr-only">Filter by category</label>
                <select
                    id="post-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="min-h-[52px] rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-600 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-zinc-100"
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <p className="eyebrow animate-pulse py-24 text-center">Loading entries</p>
            ) : filteredPosts.length === 0 ? (
                <div className="border-y border-zinc-200/80 py-20 text-center dark:border-zinc-800/80">
                    <BlogIcon size={36} aria-hidden className="mx-auto text-zinc-200 dark:text-zinc-800" />
                    <p className="mt-4 font-serif text-2xl italic text-zinc-400">No matching entries.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <motion.article
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-rest group relative flex flex-col p-6 transition-shadow duration-300 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 text-zinc-400 transition-colors duration-300 group-hover:border-razzmatazz/40 group-hover:text-razzmatazz dark:border-zinc-800/80 dark:text-zinc-500">
                                    <BlogIcon size={22} aria-hidden />
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/blog/edit?id=${post.id}`)}
                                        aria-label={`Edit ${post.title}`}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                                    >
                                        <Edit size={16} aria-hidden />
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        aria-label={`Delete ${post.title}`}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:hover:border-red-900 dark:hover:text-red-400"
                                    >
                                        <Trash2 size={16} aria-hidden />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">{post.category || "Design"}</p>
                                <h3 className="mt-1.5 line-clamp-2 font-heading text-[1.35rem] font-medium leading-snug tracking-tight text-zinc-950 dark:text-white">
                                    {post.title}
                                </h3>
                                <p className="mt-1.5 line-clamp-2 text-sm font-light text-zinc-500 dark:text-zinc-400">
                                    {post.description || "No summary yet."}
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70">
                                <span className="text-[12px] font-light text-zinc-400 dark:text-zinc-500">
                                    {post.created_at ? new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                                    {post.read_time ? ` · ${post.read_time}` : ""}
                                </span>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    aria-label={`Preview ${post.title}`}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
                                >
                                    <ExternalLink size={16} aria-hidden />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        role="status"
                        className="fixed bottom-8 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-zinc-950"
                    >
                        <CheckCircle2 aria-hidden className="text-razzmatazz" size={18} />
                        Entry deleted.
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
