"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Portfolio() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const [projectsRes, settingsRes] = await Promise.all([
                    supabase.from('projects').select('*'),
                    supabase.from('site_settings').select('*').single()
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
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const getSpan = (index: number) => {
        // Custom bento grid logic: 
        // 1st item: full width
        // 2nd & 3rd: half width
        // Others: third width
        if (index === 0) return "md:col-span-6";
        if (index === 1 || index === 2) return "md:col-span-3";
        return "md:col-span-2";
    };

    const getAspect = (index: number) => {
        if (index === 0) return "video";
        if (index === 1 || index === 2) return "square";
        return "portrait";
    };

    return (
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                <header className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">Archive</span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 mb-8">
                            Selected <span className="text-razzmatazz">Work</span>
                        </h1>

                        <p className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            A curated selection of projects focusing on minimal aesthetics and functional design.
                        </p>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className="animate-spin text-zinc-200" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                title={project.title}
                                category={project.category}
                                color={project.color}
                                slug={project.slug}
                                featured_image={project.featured_image}
                                span={getSpan(index)}
                                aspect={getAspect(index) as any}
                            />
                        ))}
                    </div>
                )}

                {!loading && projects.length === 0 && (
                    <div className="text-center py-32 border border-dashed border-zinc-100 rounded-[2rem]">
                        <p className="text-zinc-400 italic">No projects have been published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
