"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedTooltip from "@/components/ui/AnimatedTooltip";

interface BlockProps {
    blocks: any[];
}

/**
 * Renders CMS content blocks with editorial typography.
 * Authors can add contextual tooltips with [[term|short definition]] syntax.
 */
function renderRichText(text: string) {
    const parts = text.split(/(\[\[.+?\]\])/g);
    return parts.map((part, i) => {
        const m = part.match(/^\[\[(.+?)\|(.+?)\]\]$/);
        if (m) {
            return (
                <AnimatedTooltip key={i} content={m[2]}>
                    {m[1]}
                </AnimatedTooltip>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

function youtubeId(url: string): string | null {
    const m = String(url || "").match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    return m ? m[1] : null;
}

function VideoBlock({ url }: { url: string }) {
    const id = youtubeId(url);
    if (id) {
        return (
            <div className="img-frame relative block aspect-video">
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title="Embedded video"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                />
            </div>
        );
    }
    return (
        <div className="img-frame relative block aspect-video bg-black">
            <video src={url} controls preload="none" playsInline className="absolute inset-0 h-full w-full object-contain" />
        </div>
    );
}

function CompareSlider({ before, after, beforeLabel, afterLabel }: { before: string; after: string; beforeLabel?: string; afterLabel?: string }) {
    const [pos, setPos] = useState(50);
    if (!before || !after) return null;
    return (
        <div className="img-frame relative block aspect-[16/10] select-none">
            <Image src={after} alt={afterLabel || "After"} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" draggable={false} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <Image src={before} alt={beforeLabel || "Before"} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" draggable={false} />
            </div>
            <span aria-hidden className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ left: `${pos}%` }} />
            <span aria-hidden className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white font-heading text-sm font-semibold text-zinc-950 shadow-lg" style={{ left: `${pos}%` }}>
                ↔
            </span>
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                {beforeLabel || "Before"}
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                {afterLabel || "After"}
            </span>
            <label htmlFor={`compare-${before.slice(-12)}`} className="sr-only">Reveal before and after</label>
            <input
                id={`compare-${before.slice(-12)}`}
                type="range"
                min={0}
                max={100}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
        </div>
    );
}

export default function BlockRenderer({ blocks }: BlockProps) {
    const reduce = useReducedMotion();
    if (!blocks || !Array.isArray(blocks)) return null;
    const renderableBlocks = blocks.filter((b: any) => b && b.type !== 'meta');

    const anim = (delay = 0) =>
        reduce
            ? {}
            : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-60px" },
                  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
              };

    return (
        <div className="w-full space-y-14 md:space-y-16">
            {renderableBlocks.map((block, index) => {
                switch (block.type) {
                    case 'section':
                        return (
                            <motion.section key={index} {...anim()} className="w-full">
                                {block.title && (
                                    <h2 className="font-heading text-2xl md:text-[1.75rem] font-medium tracking-tight text-zinc-950 dark:text-white">
                                        {block.title}
                                    </h2>
                                )}
                                {block.content && (
                                    <div className={`space-y-5 text-[1.05rem] md:text-lg font-light leading-[1.85] text-zinc-600 dark:text-zinc-300 ${block.title ? "mt-5" : ""}`}>
                                        {String(block.content).split(/\n\n+/).map((para: string, pi: number) => (
                                            <p key={pi} className="whitespace-pre-line">
                                                {renderRichText(para)}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </motion.section>
                        );

                    case 'image_grid': {
                        const gridCols: Record<number, string> = {
                            1: 'md:grid-cols-1',
                            2: 'md:grid-cols-2',
                            3: 'md:grid-cols-3',
                        };
                        return (
                            <motion.figure key={index} {...anim()} className={`grid grid-cols-1 ${gridCols[block.columns] || 'md:grid-cols-1'} gap-4 md:gap-5 w-full`}>
                                {block.images?.map((url: string, i: number) => (
                                    <span key={i} className="img-frame relative block aspect-[16/10]">
                                        <Image src={url} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                                    </span>
                                ))}
                            </motion.figure>
                        );
                    }

                    case 'quote':
                        return (
                            <motion.aside key={index} {...anim()} className="border-l-2 border-razzmatazz pl-6 md:pl-8 py-1 w-full">
                                <p className="font-serif italic text-2xl md:text-[1.9rem] leading-[1.4] text-zinc-900 dark:text-zinc-100">
                                    {renderRichText(block.content)}
                                </p>
                                {block.author && (
                                    <cite className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500 not-italic">
                                        — {block.author}
                                    </cite>
                                )}
                            </motion.aside>
                        );

                    case 'video':
                        if (!block.url) return null;
                        return (
                            <motion.div key={index} {...anim()}>
                                <VideoBlock url={block.url} />
                            </motion.div>
                        );

                    case 'compare':
                        return (
                            <motion.div key={index} {...anim()}>
                                <CompareSlider
                                    before={block.before}
                                    after={block.after}
                                    beforeLabel={block.beforeLabel}
                                    afterLabel={block.afterLabel}
                                />
                            </motion.div>
                        );

                    case 'list':
                        return (
                            <motion.div key={index} {...anim()} className="w-full">
                                {block.title && (
                                    <h3 className="font-heading text-xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                        {block.title}
                                    </h3>
                                )}
                                <ul className={`divide-y divide-zinc-200/70 dark:divide-zinc-800/70 border-y border-zinc-200/70 dark:border-zinc-800/70 ${block.title ? "mt-5" : ""}`}>
                                    {block.items?.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-4 items-baseline py-4">
                                            <span aria-hidden className="font-serif italic text-sm text-razzmatazz tabular-nums">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-[1.02rem] font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                                                {renderRichText(item)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
