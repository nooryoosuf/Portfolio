"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
    title?: string;
    category?: string;
    color?: string;
    span?: string;
    slug?: string;
    aspect?: "square" | "video" | "portrait";
    featured_image?: string;
}

export default function ProjectCard({
    title = "Untitled",
    category = "Project",
    color = "#ff0059",
    slug = "",
    span = "",
    aspect = "portrait",
    featured_image
}: ProjectCardProps) {
    const aspectClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[4/5]"
    };

    const safeTitle = title || "Untitled";
    const safeCategory = category || "Project";
    const safeColor = color || "#ff0059";
    const safeSlug = slug || "";
    const initialChar = safeTitle.length > 0 ? safeTitle.charAt(0).toUpperCase() : "P";

    return (
        <Link href={`/portfolio/project?slug=${safeSlug}`} className={span}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[2rem] overflow-hidden bg-white border border-zinc-100 hover:border-zinc-200 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 cursor-pointer h-full"
            >
                <div className={`${aspectClasses[aspect] || aspectClasses.portrait} w-full bg-zinc-50 relative overflow-hidden`}>
                    <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: safeColor }}
                    />

                    {featured_image ? (
                        <img
                            src={featured_image}
                            alt={safeTitle}
                            style={{ filter: "none", WebkitFilter: "none", opacity: 1 }}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-zinc-200 font-heading text-[6rem] md:text-[8rem] font-medium select-none group-hover:scale-110 transition-transform duration-1000">
                                {initialChar}
                            </span>
                        </div>
                    )}

                    <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-sm z-10">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                <div className="p-8">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium mb-2 block">
                        {safeCategory}
                    </span>
                    <h3 className="text-2xl font-heading font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors duration-300">
                        {safeTitle}
                    </h3>
                </div>
            </motion.div>
        </Link>
    );
}
