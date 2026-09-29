"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BlockRenderer from "@/components/BlockRenderer";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ImageReveal from "@/components/ui/ImageReveal";

export default function ProjectDetailContent({ params }: { params: any }) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const reduce = useReducedMotion();

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
            <div className="shell pt-40 pb-32 text-center" aria-label="Loading project">
                <p className="eyebrow animate-pulse">Opening project</p>
            </div>
        );
    }

    if (!project) {
        notFound();
    }

    return (
        <div className="shell pb-20 md:pb-28 pt-32 md:pt-44">
            <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" />
                All projects
            </Link>

            <header className="mt-10 mb-12 md:mb-16">
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <CategoryBadge label={project.category || "Project"} tone="brand" />
                    <h1 className="display mt-5 max-w-5xl text-5xl sm:text-6xl md:text-7xl">
                        {project.title}
                    </h1>
                    {project.description && (
                        <p className="lede mt-6 max-w-2xl">{project.description}</p>
                    )}

                    {/* Metadata Grid */}
                    <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-zinc-200/80 dark:border-zinc-800/80 py-6 md:grid-cols-4">
                        {project.client && (
                            <div>
                                <dt className="eyebrow">Client</dt>
                                <dd className="mt-1.5 font-medium text-zinc-900 dark:text-white">{project.client}</dd>
                            </div>
                        )}
                        {project.year && (
                            <div>
                                <dt className="eyebrow">Year</dt>
                                <dd className="mt-1.5 font-medium text-zinc-900 dark:text-white">{project.year}</dd>
                            </div>
                        )}
                        {project.services && (
                            <div>
                                <dt className="eyebrow">Services</dt>
                                <dd className="mt-1.5 font-medium text-zinc-900 dark:text-white">
                                    {Array.isArray(project.services) ? project.services.join(", ") : project.services}
                                </dd>
                            </div>
                        )}
                        <div>
                            <dt className="eyebrow">Role</dt>
                            <dd className="mt-1.5 font-medium text-zinc-900 dark:text-white">
                                {project.content_blocks?.find((b: any) => b.type === 'meta')?.role || project.role || "Lead Designer"}
                            </dd>
                        </div>
                    </dl>
                </motion.div>
            </header>

            {project.featured_image && (
                <ImageReveal src={project.featured_image} alt={project.title} aspect="aspect-[16/9]" />
            )}

            <div className="mx-auto mt-12 max-w-3xl md:mt-16">
                <BlockRenderer blocks={project.content_blocks} />
            </div>
        </div>
    );
}
