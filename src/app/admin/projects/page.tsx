"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Loader2, LayoutGrid, CheckCircle2, ExternalLink, ArrowUp, ArrowDown, Star } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminProjects() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingOrder, setSavingOrder] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("Action completed.");

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            setLoading(true);
            const [projectsRes, settingsRes] = await Promise.all([
                supabase.from('projects').select('*'),
                supabase.from('site_settings').select('about_text').single()
            ]);

            if (projectsRes.error) throw projectsRes.error;
            let rawProjects = projectsRes.data || [];

            let projectOrder: string[] = [];
            if (settingsRes.data?.about_text) {
                try {
                    const parsed = JSON.parse(settingsRes.data.about_text);
                    if (parsed && Array.isArray(parsed.project_order)) {
                        projectOrder = parsed.project_order;
                    }
                } catch (e) {}
            }

            if (projectOrder.length > 0) {
                const orderMap = new Map(projectOrder.map((id: string, idx: number) => [id, idx]));
                rawProjects.sort((a, b) => {
                    const orderA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
                    const orderB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
                    return orderA - orderB;
                });
            } else {
                rawProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            }

            setProjects(rawProjects);
        } catch (error: any) {
            console.error("Error fetching projects:", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function saveProjectOrder(updatedProjects: any[]) {
        try {
            setSavingOrder(true);
            const orderedIds = updatedProjects.map(p => p.id);
            const { data: existing } = await supabase.from('site_settings').select('about_text').single();

            let baseObj: any = {};
            if (existing?.about_text) {
                try { baseObj = JSON.parse(existing.about_text); } catch (e) { baseObj = { text: existing.about_text }; }
            }
            baseObj.project_order = orderedIds;

            const { error } = await supabase
                .from('site_settings')
                .update({ about_text: JSON.stringify(baseObj) })
                .eq('id', 'main');

            if (error) throw error;
        } catch (err: any) {
            console.error("Failed to save project order:", err.message);
            alert("Failed to save order: " + err.message);
        } finally {
            setSavingOrder(false);
        }
    }

    const moveProject = async (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === projects.length - 1)) return;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const newProjects = [...projects];
        const temp = newProjects[index];
        newProjects[index] = newProjects[targetIndex];
        newProjects[targetIndex] = temp;

        setProjects(newProjects);
        await saveProjectOrder(newProjects);
        setToastMessage("Project sequence saved!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const makeHero = async (index: number) => {
        if (index === 0) return;
        const newProjects = [...projects];
        const [hero] = newProjects.splice(index, 1);
        newProjects.unshift(hero);

        setProjects(newProjects);
        await saveProjectOrder(newProjects);
        setToastMessage(`"${hero.title}" saved as Homepage Hero Card!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    async function deleteProject(id: string) {
        if (!confirm("Are you sure you want to dismantle this project?")) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .match({ id });

            if (error) throw error;
            const updated = projects.filter(p => p.id !== id);
            setProjects(updated);
            await saveProjectOrder(updated);
            setToastMessage("Project removed.");
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
                    <p className="text-zinc-500 font-light italic">
                        Arranging {projects.length} portfolio items. Position #1 is featured as Homepage Hero Card.
                    </p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-medium hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Commission New
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
                <div className="flex-1 relative group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-razzmatazz transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search archives by title or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 text-sm text-zinc-900 focus:outline-none focus:border-zinc-300 transition-all shadow-sm focus:shadow-xl"
                    />
                </div>
                {savingOrder && (
                    <span className="text-xs font-bold text-razzmatazz uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full border border-pink-100 animate-pulse">
                        <Loader2 size={14} className="animate-spin" /> Saving Order...
                    </span>
                )}
            </div>

            {/* Grid Interface */}
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
                    {filteredProjects.map((project, index) => {
                        const isHero = index === 0 && !searchQuery;
                        return (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`group bg-white border rounded-[3rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative ${
                                    isHero ? 'border-razzmatazz/40 ring-4 ring-razzmatazz/5 bg-gradient-to-b from-pink-50/20 to-white' : 'border-zinc-100'
                                }`}
                            >
                                {/* Position Badge */}
                                <div className="flex justify-between items-center mb-6">
                                    {isHero ? (
                                        <span className="px-4 py-1.5 bg-zinc-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-md">
                                            <Star size={12} className="text-razzmatazz fill-razzmatazz" /> #1 HOMEPAGE HERO
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-[10px] font-bold tracking-widest">
                                            #{index + 1} SLUG CARD
                                        </span>
                                    )}

                                    {/* Re-order Arrows & Hero Button */}
                                    {!searchQuery && (
                                        <div className="flex items-center gap-1 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
                                            <button
                                                onClick={() => moveProject(index, 'up')}
                                                disabled={index === 0}
                                                title="Move Up"
                                                className="p-1.5 hover:bg-white text-zinc-400 hover:text-zinc-900 rounded-xl transition-all disabled:opacity-20"
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveProject(index, 'down')}
                                                disabled={index === projects.length - 1}
                                                title="Move Down"
                                                className="p-1.5 hover:bg-white text-zinc-400 hover:text-zinc-900 rounded-xl transition-all disabled:opacity-20"
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                            {index > 0 && (
                                                <button
                                                    onClick={() => makeHero(index)}
                                                    title="Make Homepage Hero Card"
                                                    className="p-1.5 hover:bg-razzmatazz/10 text-zinc-400 hover:text-razzmatazz rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
                                                >
                                                    <Star size={14} /> Star
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div
                                        className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-900 transition-all duration-500"
                                    >
                                        <div className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: project.color }} />
                                        {project.featured_image ? (
                                            <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <LayoutGrid size={24} className="text-zinc-200 group-hover:text-white relative z-10 transition-colors" />
                                        )}
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

                                <div className="flex-1 space-y-3 mb-8">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-razzmatazz italic">{project.category}</span>
                                        <span className="text-[10px] font-bold text-zinc-300 italic opacity-40">{project.year}</span>
                                    </div>
                                    <h3 className="text-2xl font-heading font-medium text-zinc-900 leading-tight group-hover:text-razzmatazz transition-colors">{project.title}</h3>
                                    <p className="text-sm text-zinc-400 font-light italic line-clamp-2">{project.client || "Self-Initiated"}</p>
                                </div>

                                <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">{project.role || "Lead Designer"}</span>
                                    <Link href={`/portfolio/${project.slug}`} target="_blank" className="text-zinc-300 hover:text-zinc-900 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest italic group/link">
                                        Live Preview
                                        <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Notification Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 z-[100]"
                    >
                        <CheckCircle2 className="text-razzmatazz" size={20} />
                        <span className="text-sm font-medium italic">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
