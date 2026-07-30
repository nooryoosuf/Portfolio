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
        <Link href={`/portfolio/${safeSlug}`} className={span}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group relative rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/40 cursor-pointer h-full transform-gpu"
            >
                <div className={`${aspectClasses[aspect] || aspectClasses.portrait} w-full bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden`}>
                    <div
                        className="absolute inset-0 opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: safeColor }}
                    />

                    {featured_image ? (
                        <img
                            src={featured_image}
                            alt={safeTitle}
                            loading="lazy"
                            decoding="async"
                            style={{ filter: "none", WebkitFilter: "none", opacity: 1 }}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform transform-gpu"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-zinc-200 dark:text-zinc-800 font-heading text-[6rem] md:text-[8rem] font-medium select-none group-hover:scale-110 transition-transform duration-500">
                                {initialChar}
                            </span>
                        </div>
                    )}

                    <div className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-900 dark:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm z-10">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                <div className="p-8">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-medium mb-2 block">
                        {safeCategory}
                    </span>
                    <h3 className="text-2xl font-heading font-medium text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                        {safeTitle}
                    </h3>
                </div>
            </motion.div>
        </Link>
    );
}
