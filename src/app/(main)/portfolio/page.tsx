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
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProjects(data || []);
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
