"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Edit, Trash2, Loader2, FileText } from "lucide-center";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FileText as BlogIcon } from "lucide-react";

export default function AdminBlog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        if (!confirm("Remove this article?")) return;

        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .match({ id });

            if (error) throw error;
            setPosts(posts.filter(p => p.id !== id));
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <div>
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Journal <span className="text-razzmatazz">Index</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Managing {posts.length} published articles.</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    Write Article
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search journal..."
                        className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <Loader2 className="animate-spin" size={32} />
                        <p className="text-sm font-medium">Loading journal entries...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <p className="text-sm font-medium uppercase tracking-widest text-[10px]">Your journal is currently empty.</p>
                        <Link href="/admin/blog/new" className="text-razzmatazz hover:underline text-sm font-bold uppercase tracking-widest mt-4">Draft Your First Post _</Link>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-50 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                                <th className="px-8 py-5 text-zinc-300">Article Title</th>
                                <th className="px-8 py-5 text-zinc-300">Category</th>
                                <th className="px-8 py-5 text-zinc-300">Published</th>
                                <th className="px-8 py-5 sr-only">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {posts.map((post) => (
                                <tr key={post.id} className="group hover:bg-zinc-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-200">
                                                <BlogIcon size={18} />
                                            </div>
                                            <span className="text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">{post.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-zinc-500 font-light italic">{post.category}</td>
                                    <td className="px-8 py-6 text-sm text-zinc-300 font-medium italic">{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
