"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Globe } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import {
    GRADIENT_PRESETS,
    type ExperimentProject,
    type ExperimentStatus,
} from "@/lib/experiments";

export function StatusPill({ status }: { status?: ExperimentStatus }) {
    const label = status || "Experimental";
    const dotStyles: Record<string, string> = {
        Live: "bg-emerald-500",
        "In Progress": "bg-amber-500",
        Experimental: "bg-razzmatazz",
        Archived: "bg-zinc-400 dark:bg-zinc-600",
    };

    return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">
            <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${dotStyles[label] || "bg-razzmatazz"}`}
            />
            {label}
        </span>
    );
}

/** Resolves a 3-color mesh palette from a preset ID, project accent color, or index. */
export function resolveGradientPalette(project: ExperimentProject, index = 0) {
    if (project.gradient_preset) {
        const found = GRADIENT_PRESETS.find((p) => p.id === project.gradient_preset);
        if (found) return found;
    }

    const colorUpper = (project.color || "").toUpperCase();
    if (colorUpper === "#E3256B") return GRADIENT_PRESETS[0]; // Crimson Dusk (Euphex)
    if (colorUpper === "#F7095E") return GRADIENT_PRESETS[1]; // Razzmatazz Glow (Pebble)
    if (colorUpper === "#E11D48") return GRADIENT_PRESETS[2]; // Ember Coral (Chonky)
    if (colorUpper === "#6366F1" || colorUpper === "#8B5CF6") return GRADIENT_PRESETS[3]; // Indigo Nebula (MLBB Codex)
    if (colorUpper === "#0EA5E9") return GRADIENT_PRESETS[4]; // Oceanic Atoll (Maldives Travel)
    if (colorUpper === "#10B981") return GRADIENT_PRESETS[5]; // Emerald Aurora (Asters)
    if (colorUpper === "#F59E0B") return GRADIENT_PRESETS[6]; // Amber Horizon (Espada SC)

    const fallback = GRADIENT_PRESETS[index % GRADIENT_PRESETS.length];
    return {
        ...fallback,
        primary: project.color || fallback.primary,
    };
}

const ASCII_PATTERNS = ["wave", "vortex", "topography", "matrix", "pulse"] as const;
export type AsciiPatternType = (typeof ASCII_PATTERNS)[number];

/**
 * Interactive procedural ASCII shader canvas for experiment cards.
 * - Uses IntersectionObserver to pause when scrolled off-screen.
 * - Responds to pointer hover/movement with a live ripple field.
 * - Respects prefers-reduced-motion.
 */
export function AsciiCanvasLayer({
    primary,
    secondary,
    pattern = "wave",
    seed = 1,
}: {
    primary: string;
    secondary: string;
    pattern?: AsciiPatternType;
    seed?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
        x: -1000,
        y: -1000,
        active: false,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const parent = canvas.parentElement?.parentElement;
        const onPointerMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
        };
        const onPointerLeave = () => {
            pointerRef.current.active = false;
        };

        if (parent) {
            parent.addEventListener("mousemove", onPointerMove, { passive: true });
            parent.addEventListener("mouseleave", onPointerLeave, { passive: true });
        }

        const chars =
            pattern === "matrix"
                ? " ·:01+*#@"
                : pattern === "topography"
                ? " ·:-=/\\|+#"
                : " ·:-=+*#%@";

        let width = 0;
        let height = 0;
        let cols = 0;
        let rows = 0;
        const cellW = 11;
        const cellH = 14;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(width / cellW);
            rows = Math.ceil(height / cellH);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        let visible = true;
        const io = new IntersectionObserver(
            (entries) => {
                visible = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0.05 }
        );
        io.observe(canvas);

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        let rafId = 0;
        let startTime = performance.now();

        const renderFrame = (now: number) => {
            if (!visible && !reduceMotion) {
                rafId = requestAnimationFrame(renderFrame);
                return;
            }

            const t = ((now - startTime) * 0.0018) + seed * 1.7;
            const isDark = document.documentElement.classList.contains("dark");

            ctx.clearRect(0, 0, width, height);
            ctx.font = '600 10.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
            ctx.textBaseline = "top";

            const ptr = pointerRef.current;

            for (let r = 0; r < rows; r++) {
                const y = r * cellH;
                const ny = (r / Math.max(1, rows)) * 2 - 1;

                for (let c = 0; c < cols; c++) {
                    const x = c * cellW;
                    const nx = (c / Math.max(1, cols)) * 2 - 1;

                    let val = 0;
                    if (pattern === "vortex") {
                        const dist = Math.sqrt(nx * nx + ny * ny);
                        const angle = Math.atan2(ny, nx);
                        val =
                            Math.sin(dist * 7 - t * 2.1 + angle * 2) * 0.55 +
                            Math.cos(nx * 4 - ny * 4 + t) * 0.45;
                    } else if (pattern === "topography") {
                        val =
                            Math.sin(nx * 3.5 + Math.cos(ny * 3.2 + t * 0.8)) *
                            Math.cos(ny * 3.5 - Math.sin(nx * 2.8 - t * 0.7));
                    } else if (pattern === "matrix") {
                        const colSpeed = 1.2 + ((c * 7 + seed * 13) % 9) * 0.22;
                        const drop = (r * 0.32 - t * colSpeed + Math.sin(c * 1.9) * 3) % 3.5;
                        val = drop < 0 ? drop + 3.5 : drop;
                        val = 1 - val / 2.2;
                    } else if (pattern === "pulse") {
                        const d1 = Math.sqrt((nx - 0.35) ** 2 + (ny + 0.2) ** 2);
                        const d2 = Math.sqrt((nx + 0.4) ** 2 + (ny - 0.3) ** 2);
                        val = Math.sin(d1 * 9 - t * 2.2) * 0.5 + Math.cos(d2 * 8 - t * 1.7) * 0.5;
                    } else {
                        // wave (default)
                        val =
                            Math.sin(nx * 3.8 + t * 1.3 + Math.sin(ny * 2.5 + t * 0.7)) * 0.55 +
                            Math.cos(ny * 4.2 - t * 1.1 + nx * 1.8) * 0.45;
                    }

                    // Cursor ripple boost
                    let cursorBoost = 0;
                    if (ptr.active) {
                        const dx = x - ptr.x;
                        const dy = y - ptr.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 150) {
                            cursorBoost = (1 - d / 150) * 0.65 * Math.cos(d * 0.08 - t * 4);
                            val += cursorBoost;
                        }
                    }

                    // Normalize [-1, 1] -> [0, 1]
                    const norm = Math.max(0, Math.min(0.999, (val + 1) * 0.5));
                    const charIdx = Math.floor(norm * chars.length);
                    const ch = chars[charIdx];

                    if (ch === " ") continue;

                    // Highlight peak characters with the project's primary/secondary accent color
                    if (norm > 0.76 || cursorBoost > 0.22) {
                        ctx.fillStyle = norm > 0.87 ? primary : secondary;
                        ctx.globalAlpha = isDark ? 0.55 + (norm - 0.7) * 0.9 : 0.42 + (norm - 0.7) * 0.85;
                    } else {
                        ctx.fillStyle = isDark ? "#e4e4e7" : "#27272a";
                        ctx.globalAlpha = isDark ? 0.12 + norm * 0.22 : 0.09 + norm * 0.18;
                    }

                    ctx.fillText(ch, x, y);
                }
            }

            ctx.globalAlpha = 1;

            if (!reduceMotion) {
                rafId = requestAnimationFrame(renderFrame);
            }
        };

        rafId = requestAnimationFrame(renderFrame);

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            io.disconnect();
            if (parent) {
                parent.removeEventListener("mousemove", onPointerMove);
                parent.removeEventListener("mouseleave", onPointerLeave);
            }
        };
    }, [primary, secondary, pattern, seed]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    );
}

/**
 * Tactile grainy mesh gradient backdrop with optional live ASCII shader layer.
 */
export function GrainyGradientBackdrop({
    primary,
    secondary,
    tertiary,
    seed = 1,
    showAscii = true,
    asciiPattern,
}: {
    primary: string;
    secondary: string;
    tertiary: string;
    seed?: number;
    showAscii?: boolean;
    asciiPattern?: AsciiPatternType;
}) {
    const filterId = `grain-filter-${seed}-${primary.replace("#", "")}`;
    const resolvedPattern =
        asciiPattern || ASCII_PATTERNS[(seed - 1) % ASCII_PATTERNS.length];

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Soft mesh gradient blobs */}
            <div
                className="absolute -inset-6 opacity-35 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 dark:opacity-50"
                style={{
                    backgroundImage: [
                        `radial-gradient(85% 85% at 14% 18%, ${primary}66 0%, transparent 65%)`,
                        `radial-gradient(75% 80% at 88% 22%, ${secondary}55 0%, transparent 62%)`,
                        `radial-gradient(80% 85% at 68% 88%, ${tertiary}4D 0%, transparent 68%)`,
                        `linear-gradient(135deg, ${primary}1F 0%, ${secondary}14 52%, ${tertiary}24 100%)`,
                    ].join(", "),
                }}
            />

            {/* Subtle luminous core glow */}
            <div
                className="absolute -right-12 -top-12 h-56 w-56 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50 dark:opacity-40"
                style={{ backgroundColor: primary }}
            />
            <div
                className="absolute -bottom-14 -left-10 h-52 w-52 rounded-full blur-3xl opacity-25 transition-opacity duration-500 group-hover:opacity-45 dark:opacity-35"
                style={{ backgroundColor: secondary }}
            />

            {/* Live procedural ASCII animation layer */}
            {showAscii && (
                <AsciiCanvasLayer
                    primary={primary}
                    secondary={secondary}
                    pattern={resolvedPattern}
                    seed={seed}
                />
            )}

            {/* Tactile SVG film grain overlay */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.26] mix-blend-overlay dark:opacity-[0.32]">
                <filter id={filterId}>
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="4"
                        seed={seed}
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#${filterId})`} />
            </svg>

            {/* Soft radial readability scrim behind text */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/55 via-white/15 to-white/30 dark:from-zinc-950/65 dark:via-zinc-950/20 dark:to-zinc-950/35" />
        </div>
    );
}

interface ExperimentCardProps {
    project: ExperimentProject;
    index: number;
    span?: string;
    aspect?: "video" | "portrait" | "square" | "wide";
    featuredLayout?: boolean;
}

export default function ExperimentCard({
    project,
    index,
    span = "md:col-span-3",
    aspect = "video",
    featuredLayout = false,
}: ExperimentCardProps) {
    const aspectClasses: Record<string, string> = {
        video: "aspect-[16/10]",
        wide: "aspect-[16/9]",
        portrait: "aspect-[4/5]",
        square: "aspect-square",
    };

    const mdAspectClasses: Record<string, string> = {
        video: "md:aspect-[16/10]",
        wide: "md:aspect-[16/9]",
        portrait: "md:aspect-[4/5]",
        square: "md:aspect-square",
    };

    const numLabel = String(index + 1).padStart(2, "0");
    const href = `/experiments/${project.slug}`;
    const hasBgImage = Boolean(
        project.cover_image &&
            project.cover_mode !== "gradient" &&
            project.cover_mode !== "ascii"
    );
    const showAscii = project.cover_mode !== "gradient";
    const palette = resolveGradientPalette(project, index);

    if (featuredLayout) {
        return (
            <Reveal className={span}>
                <article className="group relative grid grid-cols-1 gap-8 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80 lg:grid-cols-12 lg:items-center lg:gap-12">
                    <Link href={href} className="block lg:col-span-7">
                        <div
                            className={`img-frame relative ${
                                hasBgImage
                                    ? aspectClasses[aspect] || aspectClasses.wide
                                    : "min-h-[260px] sm:min-h-[320px] lg:aspect-[16/10]"
                            }`}
                        >
                            {hasBgImage ? (
                                <Image
                                    src={project.cover_image!}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 720px"
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                                />
                            ) : (
                                <>
                                    <GrainyGradientBackdrop
                                        primary={palette.primary}
                                        secondary={palette.secondary}
                                        tertiary={palette.tertiary}
                                        seed={index + 1}
                                        showAscii={showAscii}
                                        asciiPattern={project.ascii_pattern}
                                    />
                                    <div className="relative z-10 flex h-full min-h-[260px] sm:min-h-[320px] flex-col justify-between gap-7 p-6 sm:p-10">
                                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700/90 dark:text-zinc-300/90">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/70 px-3 py-1 backdrop-blur-md dark:border-white/15 dark:bg-zinc-950/65">
                                                Experiment {numLabel}
                                            </span>
                                            <span className="font-mono text-xs">{project.year || "2026"}</span>
                                        </div>
                                        <div className="py-2">
                                            <p className="font-serif italic text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
                                                {project.category}
                                            </p>
                                            <p className="mt-1.5 font-heading text-3xl sm:text-5xl font-medium leading-[1.08] tracking-tight text-zinc-950 dark:text-white transition-transform duration-500 group-hover:translate-x-1">
                                                {project.title}
                                                <span style={{ color: palette.primary }}>.</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            {(project.technologies || []).slice(0, 4).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="rounded-full border border-zinc-900/10 bg-white/80 px-3 py-1 text-[11px] font-medium text-zinc-800 backdrop-blur-md dark:border-white/15 dark:bg-zinc-950/70 dark:text-zinc-200"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            <span className="absolute right-4 top-4 z-20 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <ArrowUpRight size={19} aria-hidden />
                            </span>
                        </div>
                    </Link>

                    <div className="flex flex-col justify-between lg:col-span-5">
                        <div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="font-serif italic text-base text-razzmatazz tabular-nums">
                                    {numLabel}
                                </span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                                    {project.category}
                                </span>
                                <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
                                    ·
                                </span>
                                <StatusPill status={project.status} />
                                {project.year && (
                                    <>
                                        <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
                                            ·
                                        </span>
                                        <span className="text-xs font-light text-zinc-400 dark:text-zinc-500 tabular-nums">
                                            {project.year}
                                        </span>
                                    </>
                                )}
                            </div>

                            <Link href={href} className="mt-4 block">
                                <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-zinc-950 transition-colors duration-200 group-hover:text-razzmatazz dark:text-white dark:group-hover:text-razzmatazz">
                                    {project.title}
                                </h2>
                                <p className="mt-4 text-base sm:text-[17px] font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                                    {project.short_description}
                                </p>
                            </Link>

                            {project.technologies && project.technologies.length > 0 && (
                                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                                    {project.technologies.map((tech) => (
                                        <li
                                            key={tech}
                                            className="rounded-full border border-zinc-200/80 bg-zinc-50 px-3 py-1 text-xs font-normal text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-zinc-200/70 pt-5 dark:border-zinc-800/70">
                            <Link
                                href={href}
                                className="group/btn inline-flex items-center gap-1.5 text-sm font-medium text-zinc-950 transition-colors hover:text-razzmatazz dark:text-white dark:hover:text-razzmatazz"
                            >
                                Read build log
                                <ArrowUpRight
                                    size={15}
                                    aria-hidden
                                    className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                                />
                            </Link>

                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    <Globe size={13} aria-hidden />
                                    Live demo
                                </a>
                            )}

                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    <GitBranch size={13} aria-hidden />
                                    Source
                                </a>
                            )}
                        </div>
                    </div>
                </article>
            </Reveal>
        );
    }

    return (
        <Reveal className={span}>
            <article className="group flex h-full flex-col">
                <Link href={href} className="block">
                    <div
                        className={`img-frame relative ${
                            hasBgImage
                                ? aspectClasses[aspect] || aspectClasses.video
                                : `min-h-[250px] sm:min-h-[280px] ${mdAspectClasses[aspect] || mdAspectClasses.video}`
                        }`}
                    >
                        {hasBgImage ? (
                            <Image
                                src={project.cover_image!}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                            />
                        ) : (
                            <>
                                <GrainyGradientBackdrop
                                    primary={palette.primary}
                                    secondary={palette.secondary}
                                    tertiary={palette.tertiary}
                                    seed={index + 2}
                                    showAscii={showAscii}
                                    asciiPattern={project.ascii_pattern}
                                />
                                <div className="relative z-10 flex h-full min-h-[240px] sm:min-h-[270px] flex-col justify-between gap-6 p-6 sm:p-8">
                                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700/90 dark:text-zinc-300/90">
                                        <span
                                            className="inline-flex h-6 w-7 items-center justify-center rounded-full border border-zinc-900/10 bg-white/75 font-serif italic text-sm backdrop-blur-md dark:border-white/15 dark:bg-zinc-950/65"
                                            style={{ color: palette.primary }}
                                        >
                                            {numLabel}
                                        </span>
                                        <span className="font-mono text-xs">{project.year || "2026"}</span>
                                    </div>
                                    <div className="py-2">
                                        <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight text-zinc-950 dark:text-white transition-transform duration-500 group-hover:translate-x-1">
                                            {project.title}
                                            <span style={{ color: palette.primary }}>.</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                        <StatusPill status={project.status} />
                                        {project.technologies?.[0] && (
                                            <span className="rounded-full border border-zinc-900/10 bg-white/80 px-2.5 py-0.5 font-mono text-[11px] text-zinc-700 backdrop-blur-md dark:border-white/15 dark:bg-zinc-950/70 dark:text-zinc-300">
                                                {project.technologies[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        <span className="absolute right-4 top-4 z-20 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <ArrowUpRight size={18} aria-hidden />
                        </span>
                    </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between px-1 pt-5">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                                {project.category}
                            </p>
                            <StatusPill status={project.status} />
                        </div>

                        <Link href={href} className="mt-2 block">
                            <h3 className="font-heading text-2xl font-medium tracking-tight text-zinc-950 transition-colors duration-200 group-hover:text-razzmatazz dark:text-white dark:group-hover:text-razzmatazz">
                                {project.title}
                            </h3>
                            <p className="mt-2 line-clamp-3 text-[15px] font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {project.short_description}
                            </p>
                        </Link>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/70 pt-3.5 dark:border-zinc-800/70">
                        <div className="flex flex-wrap gap-1.5">
                            {(project.technologies || []).slice(0, 3).map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-normal text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                                >
                                    {tech}
                                </span>
                            ))}
                            {(project.technologies || []).length > 3 && (
                                <span className="px-1.5 py-0.5 text-[11px] font-light text-zinc-400">
                                    +{project.technologies.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${project.title} GitHub repository`}
                                    className="transition-colors hover:text-zinc-950 dark:hover:text-white"
                                >
                                    <GitBranch size={14} aria-hidden />
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${project.title} live site`}
                                    className="transition-colors hover:text-zinc-950 dark:hover:text-white"
                                >
                                    <Globe size={14} aria-hidden />
                                </a>
                            )}
                            {project.year && <span className="tabular-nums">{project.year}</span>}
                        </div>
                    </div>
                </div>
            </article>
        </Reveal>
    );
}
