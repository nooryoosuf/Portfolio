"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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
        setToastMessage(`"${hero.title}" is now the homepage hero.`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    async function deleteProject(id: string) {
        if (!confirm("Delete this project permanently?")) return;

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
        (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">Work archive</h1>
                    <p className="lede mt-3 !text-base">
                        {projects.length} {projects.length === 1 ? "project" : "projects"} — position #1 features on the homepage.
                    </p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-zinc-950 px-7 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                    <Plus size={18} aria-hidden />
                    New project
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search aria-hidden className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <label htmlFor="project-search" className="sr-only">Search projects</label>
                    <input
                        id="project-search"
                        type="text"
                        placeholder="Search by title or category…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="min-h-[52px] w-full rounded-full border border-zinc-200 bg-white py-3 pl-12 pr-6 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-100"
                    />
                </div>
                {savingOrder && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        <Loader2 size={14} aria-hidden className="animate-spin" /> Saving order
                    </span>
                )}
            </div>

            {/* Grid */}
            {loading ? (
                <p className="eyebrow animate-pulse py-24 text-center">Loading projects</p>
            ) : filteredProjects.length === 0 ? (
                <div className="border-y border-zinc-200/80 py-20 text-center dark:border-zinc-800/80">
                    <LayoutGrid size={36} aria-hidden className="mx-auto text-zinc-200 dark:text-zinc-800" />
                    <p className="mt-4 font-serif text-2xl italic text-zinc-400">No projects found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map((project, index) => {
                        const isHero = index === 0 && !searchQuery;
                        return (
                            <motion.article
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`card-rest group relative flex flex-col p-6 transition-shadow duration-300 hover:shadow-lg ${
                                    isHero ? "!border-razzmatazz/50" : ""
                                }`}
                            >
                                <div className="mb-5 flex items-center justify-between gap-2">
                                    {isHero ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white dark:bg-white dark:text-zinc-950">
                                            <Star size={11} aria-hidden className="text-razzmatazz" /> #1 Homepage hero
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                            #{index + 1}
                                        </span>
                                    )}

                                    {!searchQuery && (
                                        <div className="flex items-center gap-1 rounded-full border border-zinc-200 p-1 dark:border-zinc-800">
                                            <button
                                                onClick={() => moveProject(index, 'up')}
                                                disabled={index === 0}
                                                title="Move up"
                                                aria-label={`Move ${project.title} up`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-white"
                                            >
                                                <ArrowUp size={14} aria-hidden />
                                            </button>
                                            <button
                                                onClick={() => moveProject(index, 'down')}
                                                disabled={index === projects.length - 1}
                                                title="Move down"
                                                aria-label={`Move ${project.title} down`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-white"
                                            >
                                                <ArrowDown size={14} aria-hidden />
                                            </button>
                                            {index > 0 && (
                                                <button
                                                    onClick={() => makeHero(index)}
                                                    title="Make homepage hero"
                                                    className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:bg-razzmatazz/10 hover:text-razzmatazz"
                                                >
                                                    <Star size={13} aria-hidden /> Hero
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-5 flex items-start justify-between gap-3">
                                    <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900">
                                        {project.featured_image ? (
                                            <Image src={project.featured_image} alt="" fill sizes="56px" className="object-cover" />
                                        ) : (
                                            <span className="flex h-full w-full items-center justify-center">
                                                <LayoutGrid size={22} aria-hidden className="text-zinc-300 dark:text-zinc-700" />
                                            </span>
                                        )}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/admin/projects/edit?id=${project.id}`)}
                                            aria-label={`Edit ${project.title}`}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                                        >
                                            <Edit size={16} aria-hidden />
                                        </button>
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            aria-label={`Delete ${project.title}`}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:hover:border-red-900 dark:hover:text-red-400"
                                        >
                                            <Trash2 size={16} aria-hidden />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">
                                        {project.category || "Project"}
                                        {project.year && <span className="ml-2 text-zinc-400 dark:text-zinc-500">{project.year}</span>}
                                    </p>
                                    <h3 className="mt-1.5 font-heading text-[1.35rem] font-medium leading-snug tracking-tight text-zinc-950 dark:text-white">
                                        {project.title}
                                    </h3>
                                    <p className="mt-1.5 line-clamp-2 text-sm font-light text-zinc-500 dark:text-zinc-400">
                                        {project.client || "Self-initiated"}
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                                        {project.role || "Lead Designer"}
                                    </span>
                                    <Link
                                        href={`/portfolio/${project.slug}`}
                                        target="_blank"
                                        className="group/link inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white"
                                    >
                                        Live preview
                                        <ExternalLink size={12} aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                    </Link>
                                </div>
                            </motion.article>
                        );
                    })}
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
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
