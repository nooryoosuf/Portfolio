"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Loader2, FileText as BlogIcon, ExternalLink, Filter, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminBlog() {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        if (!confirm("Are you sure you want to scrub this entry from the records?")) return;

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

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Journal <span className="text-razzmatazz">Management</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Curating {posts.length} published thoughts.</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-medium hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Write Article
                </Link>
            </header>

            {/* Modern Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-razzmatazz transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by title or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 text-sm text-zinc-900 focus:outline-none focus:border-zinc-300 transition-all shadow-sm focus:shadow-xl"
                    />
                </div>
                <button className="px-8 py-5 bg-white border border-zinc-100 rounded-[2rem] text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all flex items-center gap-3 shadow-sm">
                    <Filter size={18} />
                    Category
                </button>
            </div>

            {/* Grid Interface (Replacing Table for Professional Feel) */}
            {loading ? (
                <div className="p-40 flex flex-col items-center justify-center text-zinc-400 gap-6">
                    <Loader2 className="animate-spin text-razzmatazz" size={48} />
                    <p className="text-sm font-bold uppercase tracking-[0.2em] italic">Accessing Archives...</p>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="p-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[3rem] text-zinc-400 gap-6">
                    <BlogIcon size={48} className="opacity-10" />
                    <p className="text-sm font-bold uppercase tracking-[0.2em] italic">No matching entries found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-200 group-hover:text-razzmatazz group-hover:bg-razzmatazz/5 transition-all duration-500">
                                    <BlogIcon size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/blog/edit?id=${post.id}`)}
                                        className="p-3 bg-zinc-50 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="p-3 bg-zinc-50 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-razzmatazz italic">{post.category}</span>
                                <h3 className="text-2xl font-heading font-medium text-zinc-900 leading-tight line-clamp-2">{post.title}</h3>
                                <p className="text-sm text-zinc-400 font-light italic line-clamp-2">{post.description}</p>
                            </div>

                            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">{new Date(post.created_at).toLocaleDateString()}</div>
                                <Link href={`/blog/post?slug=${post.slug}`} target="_blank" className="text-zinc-400 hover:text-razzmatazz transition-colors">
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Professional Notification System */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 z-[100]"
                    >
                        <CheckCircle2 className="text-razzmatazz" size={20} />
                        <span className="text-sm font-medium italic">Record successfully scrubbed from archives.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
