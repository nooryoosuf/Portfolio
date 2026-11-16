"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    GitBranch,
    Globe,
    Star,
    Clock,
    Code2,
} from "lucide-react";
import BlockRenderer from "@/components/BlockRenderer";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ImageReveal from "@/components/ui/ImageReveal";
import ReadingProgress from "@/components/ui/ReadingProgress";
import Reveal from "@/components/ui/Reveal";
import ExperimentCard, { StatusPill } from "@/components/ExperimentCard";
import {
    fetchExperimentBySlug,
    fetchExperiments,
    type ExperimentProject,
} from "@/lib/experiments";
import { fetchGitHubRepoMetadata, type GitHubRepoMetadata } from "@/lib/github";

export default function ExperimentDetailContent({ params }: { params: any }) {
    const [project, setProject] = useState<ExperimentProject | null>(null);
    const [related, setRelated] = useState<ExperimentProject[]>([]);
    const [repoMeta, setRepoMeta] = useState<GitHubRepoMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const reduce = useReducedMotion();

    useEffect(() => {
        async function load() {
            try {
                let slugVal = "";
                if (params && typeof params.then === "function") {
                    const resolved = await params;
                    slugVal = resolved?.slug || "";
                } else if (params && params.slug) {
                    slugVal = params.slug;
                }

                if (!slugVal && typeof window !== "undefined") {
                    const sp = new URLSearchParams(window.location.search);
                    slugVal = sp.get("slug") || "";
                }

                if (!slugVal) {
                    setProject(null);
                    setLoading(false);
                    return;
                }

                const found = await fetchExperimentBySlug(slugVal, { includeDrafts: true });
                setProject(found);

                if (found) {
                    if (found.github_url) {
                        fetchGitHubRepoMetadata(found.github_url, found.github_metadata)
                            .then((meta) => {
                                if (meta) setRepoMeta(meta);
                            })
                            .catch(() => {});
                    }

                    const all = await fetchExperiments({ includeDrafts: false });
                    const others = all.filter((x) => x.slug !== found.slug);
                    const sameCat = others.filter((x) => x.category === found.category);
                    const diffCat = others.filter((x) => x.category !== found.category);
                    setRelated([...sameCat, ...diffCat].slice(0, 2));
                }
            } catch (err) {
                console.error("Error loading experiment:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params]);

    if (loading) {
        return (
            <div className="shell pt-40 pb-32 text-center" aria-label="Loading experiment">
                <p className="eyebrow animate-pulse">Opening build log</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="shell-narrow pt-40 pb-32 text-center">
                <p className="eyebrow">Missing experiment</p>
                <h1 className="display mt-4 text-4xl md:text-5xl">Experiment not found</h1>
                <p className="lede mt-5">
                    The build log you are looking for does not exist or hasn&apos;t been published yet.
                </p>
                <Link
                    href="/experiments"
                    className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
                >
                    <ArrowLeft size={16} aria-hidden /> Back to Experiments
                </Link>
            </div>
        );
    }

    const validGallery = (project.gallery || []).filter((g) => g && g.url);

    return (
        <article className="pb-20 md:pb-28">
            <ReadingProgress />

            <div className="shell pt-32 md:pt-44">
                <Link
                    href="/experiments"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"
                >
                    <ArrowLeft
                        size={16}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    All experiments
                </Link>

                {/* Project Header */}
                <header className="mt-10">
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <CategoryBadge label={project.category || "Experiment"} tone="brand" />
                            <StatusPill status={project.status} />
                            {project.year && (
                                <span className="text-xs font-light text-zinc-400 dark:text-zinc-500 tabular-nums">
                                    {project.year}
                                </span>
                            )}
                        </div>

                        <h1 className="display mt-5 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
                            {project.title}
                        </h1>

                        {project.short_description && (
                            <p className="mt-6 max-w-3xl font-serif italic text-2xl md:text-[1.75rem] leading-snug text-zinc-600 dark:text-zinc-300">
                                {project.short_description}
                            </p>
                        )}

                        {project.full_story && (
                            <p className="lede mt-5 max-w-2xl !text-base md:!text-lg">
                                {project.full_story}
                            </p>
                        )}

                        {/* Action links + Metadata Grid */}
                        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-zinc-200/80 py-6 dark:border-zinc-800/80">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="eyebrow mr-2">Stack</span>
                                {(project.technologies || []).map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-zinc-200/80 bg-zinc-50 px-3.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex min-h-[42px] items-center gap-2 rounded-full bg-zinc-950 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                    >
                                        <Globe size={14} aria-hidden />
                                        Live project
                                        <ArrowUpRight
                                            size={14}
                                            aria-hidden
                                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </a>
                                )}

                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex min-h-[42px] items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white"
                                    >
                                        <GitBranch size={14} aria-hidden />
                                        Repository
                                        <ArrowUpRight
                                            size={14}
                                            aria-hidden
                                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Cover Visual */}
                {project.cover_image && (
                    <div className="mt-10 md:mt-14">
                        <ImageReveal
                            src={project.cover_image}
                            alt={project.title}
                            aspect="aspect-[16/9]"
                        />
                    </div>
                )}

                {/* Optional GitHub Repository Metadata Card */}
                {project.github_url && repoMeta && (
                    <Reveal className="mt-10 md:mt-12">
                        <aside
                            aria-label="GitHub repository metadata"
                            className="mx-auto max-w-3xl rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span
                                        aria-hidden
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                                    >
                                        <GitBranch size={18} />
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <a
                                                href={repoMeta.html_url || project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate font-mono text-sm font-semibold text-zinc-950 hover:text-razzmatazz dark:text-white dark:hover:text-razzmatazz"
                                            >
                                                {repoMeta.full_name}
                                            </a>
                                            <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                                                {repoMeta.visibility || "Public"}
                                            </span>
                                        </div>
                                        {repoMeta.description && (
                                            <p className="mt-1 line-clamp-2 text-xs font-light text-zinc-500 dark:text-zinc-400">
                                                {repoMeta.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                                    {repoMeta.language && (
                                        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                                            <Code2 size={14} aria-hidden className="text-razzmatazz" />
                                            {repoMeta.language}
                                        </span>
                                    )}
                                    {repoMeta.stargazers_count > 0 && (
                                        <span className="inline-flex items-center gap-1 tabular-nums">
                                            <Star size={13} aria-hidden className="text-amber-500" />
                                            {repoMeta.stargazers_count}
                                        </span>
                                    )}
                                    {repoMeta.pushed_at && (
                                        <span className="inline-flex items-center gap-1.5 font-light">
                                            <Clock size={13} aria-hidden />
                                            Updated{" "}
                                            {new Date(repoMeta.pushed_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {repoMeta.topics && repoMeta.topics.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-zinc-200/70 pt-3.5 dark:border-zinc-800/70">
                                    {repoMeta.topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[11px] text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400"
                                        >
                                            #{topic}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </aside>
                    </Reveal>
                )}

                {/* Story Content Blocks */}
                <div className="mx-auto mt-14 max-w-3xl md:mt-20">
                    <BlockRenderer blocks={project.content_blocks} />
                </div>

                {/* Project Gallery (if present) */}
                {validGallery.length > 0 && (
                    <section className="mx-auto mt-16 max-w-5xl border-t border-zinc-200/80 pt-14 dark:border-zinc-800/80">
                        <p className="eyebrow mb-6">Visual artifacts &amp; screens</p>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {validGallery.map((item, idx) => (
                                <Reveal
                                    key={idx}
                                    className={item.layout === "full" ? "md:col-span-2" : "md:col-span-1"}
                                >
                                    <figure className="space-y-2.5">
                                        <div
                                            className={`img-frame relative w-full ${
                                                item.layout === "mobile"
                                                    ? "mx-auto aspect-[9/16] max-w-xs"
                                                    : "aspect-[16/10]"
                                            }`}
                                        >
                                            <Image
                                                src={item.url}
                                                alt={item.caption || `${project.title} screen ${idx + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 896px"
                                                className="object-cover"
                                            />
                                        </div>
                                        {item.caption && (
                                            <figcaption className="text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                                                {item.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer navigation */}
                <div className="mx-auto mt-16 max-w-3xl md:mt-20">
                    <Reveal>
                        <nav
                            aria-label="Experiment footer"
                            className="flex flex-col gap-4 border-t border-zinc-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/80"
                        >
                            <Link
                                href="/experiments"
                                className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                            >
                                <ArrowLeft
                                    size={16}
                                    aria-hidden
                                    className="transition-transform duration-300 group-hover:-translate-x-1"
                                />
                                All experiments
                            </Link>
                            <Link
                                href="/contact"
                                className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-950 dark:text-white"
                            >
                                Have thoughts on this build?
                                <ArrowRight
                                    size={16}
                                    aria-hidden
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </nav>
                    </Reveal>
                </div>

                {/* More Experiments */}
                {related.length > 0 && (
                    <section className="mt-20 border-t border-zinc-200/80 pt-16 md:mt-28 dark:border-zinc-800/80">
                        <Reveal>
                            <p className="eyebrow flex items-center gap-3">
                                <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                                Keep exploring
                            </p>
                            <h2 className="display mt-4 text-3xl md:text-4xl">
                                Other <em className="serif-accent">experiments.</em>
                            </h2>
                        </Reveal>
                        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-6">
                            {related.map((item, idx) => (
                                <ExperimentCard
                                    key={item.id}
                                    project={item}
                                    index={idx}
                                    span="md:col-span-3"
                                    aspect="video"
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
}
