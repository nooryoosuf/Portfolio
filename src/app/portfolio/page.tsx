"use client";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

import { projects } from "@/data/projects";


export default function Portfolio() {
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

                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                    {/* Row 1: Size 3 (Full Column - 1 Card) */}
                    <ProjectCard
                        {...projects[0]}
                        span="md:col-span-6"
                        aspect="video"
                    />

                    {/* Row 2: Size 2 (Half Columns - 2 Cards) */}
                    <ProjectCard
                        {...projects[1]}
                        span="md:col-span-3"
                        aspect="square"
                    />
                    <ProjectCard
                        {...projects[2]}
                        span="md:col-span-3"
                        aspect="square"
                    />

                    {/* Row 3: Size 1 (Third Columns - 3 Cards) */}
                    <ProjectCard
                        {...projects[3]}
                        span="md:col-span-2"
                        aspect="portrait"
                    />
                    <ProjectCard
                        {...projects[0]}
                        title="Urban Identity"
                        slug="urban-identity"
                        span="md:col-span-2"
                        aspect="portrait"
                    />
                    <ProjectCard
                        {...projects[1]}
                        title="Studio Minimal"
                        slug="studio-minimal"
                        span="md:col-span-2"
                        aspect="portrait"
                    />
                </div>


            </div>
        </div>
    );
}

