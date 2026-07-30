"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowUpRight } from "lucide-react";

export default function Blog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="pt-40 pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-widest uppercase mb-4 block">Insights</span>
                            <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 dark:text-white mb-8 leading-[1.1]">
                                The <span className="text-razzmatazz underline decoration-zinc-100 dark:decoration-zinc-800 decoration-4 underline-offset-8">Journal.</span>
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                                Thoughtful explorations into the world of design, technology, and user experience.
                            </p>
                        </motion.div>
                    </header>

                    {loading ? (
                        <div className="flex justify-center py-32">
                            <Loader2 className="animate-spin text-zinc-300 dark:text-zinc-700" size={48} />
                        </div>
                    ) : (
                        <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-800 border-y border-zinc-100 dark:border-zinc-800 mb-32">
                            {posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group py-16 transition-all duration-300 hover:px-8 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 rounded-2xl"
                                    >
                                        <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                            <div className="max-w-3xl">
                                                <div className="flex gap-4 items-center mb-6">
                                                    <span className="text-zinc-900 dark:text-zinc-100 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                                        {post.category || 'Design'}
                                                    </span>
                                                    <span className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest">
                                                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recently'}
                                                    </span>
                                                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                                    <span className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest">
                                                        {post.read_time || '5 min read'}
                                                    </span>
                                                </div>
                                                <h2 className="text-3xl md:text-5xl font-heading font-medium text-zinc-900 dark:text-white mb-6 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors leading-tight">
                                                    {post.title}
                                                </h2>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-light leading-relaxed">
                                                    {post.description}
                                                </p>
                                            </div>
                                            <div className="w-16 h-16 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 group-hover:border-zinc-900 dark:group-hover:border-white transition-all duration-500">
                                                <ArrowUpRight size={24} />
                                            </div>
                                        </Link>
                                    </motion.article>
                                ))
                            ) : (
                                <div className="py-16 text-center text-zinc-400 dark:text-zinc-500 italic">
                                    No journal entries found.
                                </div>
                            )}
                        </div>
                    )}

                    <section className="bg-zinc-50 dark:bg-zinc-900/60 rounded-[3rem] p-12 md:p-24 border border-zinc-100 dark:border-zinc-800">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-4xl font-heading font-medium text-zinc-900 dark:text-white mb-6">Stay in the loop.</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 font-light mb-10">Get the latest design insights delivered directly to your inbox. No spam, just pure inspiration.</p>
                            <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    placeholder="Enter your email"
                                    className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full px-8 py-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                                    type="email"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-4 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
