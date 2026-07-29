"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Edit, Trash2, Loader2, LayoutGrid, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminProjects() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error: any) {
            console.error("Error fetching projects:", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProject(id: string) {
        if (!confirm("Are you sure you want to dismantle this project?")) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .match({ id });

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error: any) {
            alert(error.message);
        }
    }

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Work <span className="text-razzmatazz">Archive</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Orchestrating {projects.length} total builds.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-medium hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Commission New
                </Link>
            </header>

            {/* Professional Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-razzmatazz transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search archives by title or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 text-sm text-zinc-900 focus:outline-none focus:border-zinc-300 transition-all shadow-sm focus:shadow-xl"
                    />
                </div>
            </div>

            {/* Modern Grid Interface */}
            {loading ? (
                <div className="p-40 flex flex-col items-center justify-center text-zinc-400 gap-6">
                    <Loader2 className="animate-spin text-razzmatazz" size={48} />
                    <p className="text-sm font-bold uppercase tracking-[0.2em] italic">Accessing Data Nodes...</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="p-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[3rem] text-zinc-400 gap-6">
                    <LayoutGrid size={48} className="opacity-10" />
                    <p className="text-sm font-bold uppercase tracking-[0.2em] italic">No projects found in the system.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-white border border-zinc-100 rounded-[3rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div
                                    className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-900 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: project.color }} />
                                    <LayoutGrid size={24} className="text-zinc-200 group-hover:text-white relative z-10 transition-colors" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/projects/edit?id=${project.id}`)}
                                        className="p-3 bg-zinc-50 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="p-3 bg-zinc-50 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-razzmatazz italic">{project.category}</span>
                                    <span className="text-[10px] font-bold text-zinc-300 italic opacity-40">{project.year}</span>
                                </div>
                                <h3 className="text-2xl font-heading font-medium text-zinc-900 leading-tight group-hover:text-razzmatazz transition-colors">{project.title}</h3>
                                <p className="text-sm text-zinc-400 font-light italic line-clamp-2">{project.client || "Self-Initiated"}</p>
                            </div>

                            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full border border-white bg-zinc-100" />
                                    <div className="w-6 h-6 rounded-full border border-white bg-zinc-200" />
                                </div>
                                <Link href={`/portfolio/project?slug=${project.slug}`} target="_blank" className="text-zinc-300 hover:text-zinc-900 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest italic group/link">
                                    Live Preview
                                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Notification System */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 z-[100]"
                    >
                        <CheckCircle2 className="text-razzmatazz" size={20} />
                        <span className="text-sm font-medium italic">Project successfully dismantled.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
