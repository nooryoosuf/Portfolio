"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BlockRenderer from "@/components/BlockRenderer";

export default function ProjectDetailContent({ params }: { params: any }) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            try {
                let slugVal = "";
                if (params && typeof params.then === 'function') {
                    const resolved = await params;
                    slugVal = resolved?.slug || "";
                } else if (params && params.slug) {
                    slugVal = params.slug;
                }

                if (!slugVal) {
                    setProject(null);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('slug', slugVal)
                    .single();

                if (error || !data) {
                    setProject(null);
                } else {
                    setProject(data);
                }
            } catch (err) {
                console.error("Error fetching project:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [params]);

    if (loading) {
        return (
            <div className="pt-40 pb-32 px-6 flex justify-center items-center min-h-screen bg-white dark:bg-zinc-950">
                <Loader2 className="animate-spin text-zinc-300 dark:text-zinc-700" size={48} />
            </div>
        );
    }

    if (!project) {
        notFound();
    }

    return (
        <div className="pt-40 pb-32 px-6 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-razzmatazz text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
                            {project.category}
                        </span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 dark:text-white mb-12 leading-[1.05]">
                            {project.title}
                        </h1>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-zinc-100 dark:border-zinc-800">
                            {project.client && (
                                <div className="space-y-1">
                                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold block">Client</span>
                                    <span className="text-zinc-900 dark:text-white font-medium">{project.client}</span>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold block">Year</span>
                                <span className="text-zinc-900 dark:text-white font-medium">{project.year}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold block">Services</span>
                                <span className="text-zinc-900 dark:text-white font-medium">
                                    {Array.isArray(project.services) ? project.services.join(", ") : project.services}
                                </span>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold block">Role</span>
                                <span className="text-zinc-900 dark:text-white font-medium">
                                    {project.content_blocks?.find((b: any) => b.type === 'meta')?.role || project.role || "Lead Designer"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="space-y-20">
                    {project.featured_image && (
                        <div className="aspect-video bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-100 dark:border-zinc-800">
                            <img src={project.featured_image} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="w-full">
                        <BlockRenderer blocks={project.content_blocks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
