"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import { supabase } from "@/lib/supabase";

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
        <div className="shell pt-32 md:pt-44 pb-20 md:pb-28">
            <header>
                <Reveal>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Archive — {projects.length} {projects.length === 1 ? "project" : "projects"}
                    </p>
                    <h1 className="display mt-5 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
                        Selected <em className="serif-accent text-razzmatazz">work.</em>
                    </h1>
                    <p className="lede mt-6 max-w-2xl">
                        A curated selection of branding and interface projects — each one designed to be clear, useful, and quietly distinctive.
                    </p>
                </Reveal>
            </header>

            {loading ? (
                <div className="py-24 text-center" aria-label="Loading projects">
                    <p className="eyebrow animate-pulse">Gathering projects</p>
                </div>
            ) : projects.length > 0 ? (
                <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-16 md:grid-cols-6">
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
            ) : (
                <div className="mt-12 border-y border-zinc-200/80 dark:border-zinc-800/80 py-20 text-center">
                    <p className="font-serif italic text-2xl text-zinc-400 dark:text-zinc-500">No projects published yet.</p>
                </div>
            )}
        </div>
    );
}
