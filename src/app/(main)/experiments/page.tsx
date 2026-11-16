"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, GitBranch, Globe } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ExperimentCard, { StatusPill } from "@/components/ExperimentCard";
import {
    EXPERIMENT_CATEGORIES,
    fetchExperiments,
    fetchTinkeringItems,
    type ExperimentProject,
    type TinkeringItem,
} from "@/lib/experiments";

const FILTER_TABS = ["All", ...EXPERIMENT_CATEGORIES];

export default function ExperimentsPage() {
    const [experiments, setExperiments] = useState<ExperimentProject[]>([]);
    const [tinkering, setTinkering] = useState<TinkeringItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const reduce = useReducedMotion();

    useEffect(() => {
        async function load() {
            try {
                const [expList, tinkList] = await Promise.all([
                    fetchExperiments({ includeDrafts: false }),
                    fetchTinkeringItems(),
                ]);
                setExperiments(expList);
                setTinkering(tinkList);
            } catch (err) {
                console.error("Error loading experiments:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        if (activeCategory === "All") return experiments;
        return experiments.filter((item) => item.category === activeCategory);
    }, [experiments, activeCategory]);

    const featuredItems = useMemo(
        () => (activeCategory === "All" ? filtered.filter((x) => x.featured) : []),
        [filtered, activeCategory]
    );

    const archiveItems = useMemo(
        () => (activeCategory === "All" ? filtered.filter((x) => !x.featured) : filtered),
        [filtered, activeCategory]
    );

    const getAsymmetricSpan = (index: number) => {
        const pattern = index % 4;
        if (pattern === 0) return "md:col-span-4";
        if (pattern === 1) return "md:col-span-2";
        if (pattern === 2) return "md:col-span-3";
        return "md:col-span-3";
    };

    const getAsymmetricAspect = (index: number): "video" | "portrait" | "square" | "wide" => {
        const pattern = index % 4;
        if (pattern === 0) return "wide";
        if (pattern === 1) return "portrait";
        if (pattern === 2) return "video";
        return "video";
    };

    return (
        <div className="shell pt-32 md:pt-44 pb-20 md:pb-28">
            {/* Editorial Introduction */}
            <header>
                <Reveal>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Experiments — {experiments.length} {experiments.length === 1 ? "build" : "builds"}
                    </p>
                    <h1 className="display mt-5 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
                        Things I&apos;ve been <em className="serif-accent text-razzmatazz">building.</em>
                    </h1>
                    <p className="lede mt-6 max-w-2xl">
                        A collection of ideas, experiments, side projects and occasionally questionable decisions that turned into software.
                    </p>
                </Reveal>

                {/* Category Filter */}
                <Reveal delay={0.1}>
                    <div
                        role="tablist"
                        aria-label="Filter experiments by category"
                        className="mt-10 flex flex-wrap items-center gap-2 border-y border-zinc-200/80 py-4 dark:border-zinc-800/80"
                    >
                        {FILTER_TABS.map((cat) => {
                            const active = activeCategory === cat;
                            const count =
                                cat === "All"
                                    ? experiments.length
                                    : experiments.filter((e) => e.category === cat).length;
                            return (
                                <button
                                    key={cat}
                                    role="tab"
                                    type="button"
                                    aria-selected={active}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200 ${
                                        active
                                            ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span
                                        className={`text-[10px] tabular-nums ${
                                            active ? "text-razzmatazz" : "text-zinc-400 dark:text-zinc-600"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Reveal>
            </header>

            {loading ? (
                <div className="py-24 text-center" aria-label="Loading experiments">
                    <p className="eyebrow animate-pulse">Opening build log</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="mt-12 border-b border-zinc-200/80 py-20 text-center dark:border-zinc-800/80">
                    <p className="font-serif italic text-2xl text-zinc-400 dark:text-zinc-500">
                        No experiments in &ldquo;{activeCategory}&rdquo; yet.
                    </p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Featured Experiments */}
                        {featuredItems.length > 0 && (
                            <section className="mt-12 space-y-16 md:mt-16" aria-label="Featured experiments">
                                {featuredItems.map((project, idx) => (
                                    <ExperimentCard
                                        key={project.id}
                                        project={project}
                                        index={idx}
                                        span="col-span-full"
                                        aspect="wide"
                                        featuredLayout
                                    />
                                ))}
                            </section>
                        )}

                        {/* Asymmetric Archive Grid */}
                        {archiveItems.length > 0 && (
                            <section
                                className={`${
                                    featuredItems.length > 0
                                        ? "mt-20 border-t border-zinc-200/80 pt-16 dark:border-zinc-800/80"
                                        : "mt-12 md:mt-16"
                                }`}
                                aria-label="Experiments archive"
                            >
                                {featuredItems.length > 0 && (
                                    <div className="mb-12">
                                        <SectionHeading
                                            eyebrow="Archive"
                                            title={
                                                <>
                                                    More <em className="serif-accent">builds &amp; explorations.</em>
                                                </>
                                            }
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-6">
                                    {archiveItems.map((project, index) => (
                                        <ExperimentCard
                                            key={project.id}
                                            project={project}
                                            index={featuredItems.length + index}
                                            span={getAsymmetricSpan(index)}
                                            aspect={getAsymmetricAspect(index)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Currently Tinkering With */}
            {tinkering.length > 0 && (
                <section className="mt-24 border-t border-zinc-200/80 pt-16 md:mt-32 md:pt-20 dark:border-zinc-800/80">
                    <div className="grid gap-10 lg:grid-cols-[1fr_1.65fr] lg:gap-16">
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <SectionHeading
                                eyebrow="Workbench"
                                title={
                                    <>
                                        Currently <em className="serif-accent text-razzmatazz">tinkering with.</em>
                                    </>
                                }
                                lede="Smaller prototypes, half-formed tools, and side quests that live on the workbench before becoming full case notes."
                            />
                        </div>

                        <div className="divide-y divide-zinc-200/80 border-y border-zinc-200/80 dark:divide-zinc-800/80 dark:border-zinc-800/80">
                            {tinkering.map((item, i) => (
                                <Reveal key={item.id || i} delay={Math.min(i * 0.05, 0.2)}>
                                    <article className="py-7">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    aria-hidden
                                                    className="font-serif italic text-sm text-razzmatazz tabular-nums"
                                                >
                                                    0{i + 1}
                                                </span>
                                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <StatusPill status={item.status} />
                                        </div>

                                        <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-4">
                                            <h3 className="font-heading text-xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                {item.live_url && (
                                                    <a
                                                        href={item.live_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 transition-colors hover:text-zinc-950 dark:hover:text-white"
                                                    >
                                                        <Globe size={13} aria-hidden />
                                                        Preview
                                                        <ArrowUpRight size={12} aria-hidden />
                                                    </a>
                                                )}
                                                {item.github_url && (
                                                    <a
                                                        href={item.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 transition-colors hover:text-zinc-950 dark:hover:text-white"
                                                    >
                                                        <GitBranch size={13} aria-hidden />
                                                        Repo
                                                        <ArrowUpRight size={12} aria-hidden />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <p className="mt-2 max-w-2xl text-[15px] font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                                            {item.note}
                                        </p>

                                        {item.technologies && item.technologies.length > 0 && (
                                            <div className="mt-3.5 flex flex-wrap gap-1.5">
                                                {item.technologies.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-normal text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
