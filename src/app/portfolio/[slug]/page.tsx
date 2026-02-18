"use client";
import { use } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}


export default function ProjectDetail(props: { params: Promise<{ slug: string }> }) {
    const params = use(props.params);
    const { slug } = params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                <header className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">
                            {project.category}
                        </span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 mb-12">
                            {project.title}
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-zinc-100">
                            <div className="space-y-1">
                                <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold block">Client</span>
                                <span className="text-zinc-900 font-medium">{project.client}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold block">Year</span>
                                <span className="text-zinc-900 font-medium">{project.year}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold block">Services</span>
                                <span className="text-zinc-900 font-medium">{project.services.join(", ")}</span>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold block">Role</span>
                                <span className="text-zinc-900 font-medium">Lead Designer</span>
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    <div className="lg:col-span-4">
                        <h2 className="text-2xl font-heading font-medium text-zinc-900 mb-6">The <span className="text-razzmatazz">Brief.</span></h2>
                        <p className="text-zinc-500 text-lg font-light leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="aspect-video bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100 flex items-center justify-center relative group">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: project.color }} />
                            {/* Placeholder visual */}
                            <div className="text-zinc-200 font-heading text-6xl font-medium select-none group-hover:scale-110 transition-transform duration-1000">
                                {project.title}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="aspect-[16/9] bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100" />
                    <div className="grid grid-cols-2 gap-12">
                        <div className="aspect-square bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100" />
                        <div className="aspect-square bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
