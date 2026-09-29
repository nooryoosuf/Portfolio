"use client";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

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
    color = "#F7095E",
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
    const safeColor = color || "#F7095E";
    const safeSlug = slug || "";
    const initialChar = safeTitle.length > 0 ? safeTitle.charAt(0).toUpperCase() : "P";

    return (
        <Reveal className={span}>
            <Link href={`/portfolio/${safeSlug}`} className="group block">
                <div className={`${aspectClasses[aspect] || aspectClasses.portrait} img-frame relative`}>
                    <span
                        aria-hidden
                        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.16] transition-opacity duration-500 group-hover:opacity-[0.16] dark:group-hover:opacity-[0.28]"
                        style={{ backgroundColor: safeColor }}
                    />
                    {featured_image ? (
                        <Image
                            src={featured_image}
                            alt={safeTitle}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 800px"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                    ) : (
                        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                            <span className="font-heading text-[5rem] md:text-[7rem] font-medium text-zinc-200 dark:text-zinc-800 select-none transition-transform duration-500 group-hover:scale-110">
                                {initialChar}
                            </span>
                        </span>
                    )}
                    <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 shadow-lg translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 dark:bg-white">
                        <ArrowUpRight size={19} aria-hidden />
                    </span>
                </div>

                <div className="flex items-baseline justify-between gap-4 px-1 pt-5">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                            {safeCategory}
                        </p>
                        <h3 className="mt-1 truncate font-heading text-xl md:text-2xl font-medium tracking-tight text-zinc-950 dark:text-white transition-colors duration-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                            {safeTitle}
                        </h3>
                    </div>
                    <span aria-hidden className="hidden sm:block h-px w-10 shrink-0 self-center bg-zinc-200 dark:bg-zinc-800 transition-all duration-300 group-hover:w-16 group-hover:bg-razzmatazz" />
                </div>
            </Link>
        </Reveal>
    );
}
