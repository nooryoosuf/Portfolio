"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowRight } from "lucide-react";

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
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <header className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">Journal</span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 mb-8 leading-[1]">
                            Thoughts <span className="text-razzmatazz">&</span> <br />
                            Selected <span className="text-razzmatazz">Works</span>.
                        </h1>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className="animate-spin text-zinc-200" size={48} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="group block p-10 bg-white border border-zinc-100 rounded-[2.5rem] hover:border-zinc-300 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                                                <span className="text-razzmatazz">{post.category}</span>
                                                <span className="italic">{post.read_time}</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-heading font-medium text-zinc-900 group-hover:text-razzmatazz transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-zinc-500 font-light italic max-w-xl line-clamp-2 leading-relaxed">
                                                {post.description}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 transform group-hover:rotate-45">
                                                <ArrowRight size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-32 border border-dashed border-zinc-100 rounded-[3rem]">
                        <p className="text-zinc-300 italic">No journal entries found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
