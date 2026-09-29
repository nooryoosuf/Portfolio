"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import CountUp from "react-countup";
import { User, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SoftwareIcon from "@/components/SoftwareIcon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageReveal from "@/components/ui/ImageReveal";

const DEFAULT_SOFTWARES = [
    { name: "Figma", category: "Interface & Design Systems" },
    { name: "Adobe Photoshop", category: "Photo & Raster Design" },
    { name: "Adobe Illustrator", category: "Vector & Branding" },
    { name: "Adobe XD", category: "UI/UX Prototyping" },
];

/** Fallbacks match the approved site copy; CMS values override when present. */
const DEFAULT_INTRO = [
    "I'm a UI/UX and visual designer from the Maldives, interested in the space where design, technology, and creativity meet.",
    "I design digital experiences that aim to be clear, useful, and visually considered. My work spans websites, web applications, digital products, design systems, branding, and visual communication. I enjoy taking something that might feel complicated and turning it into something that feels simple and intuitive.",
    "Over the years, I've had the opportunity to work on a wide range of digital projects, from government and institutional platforms to commercial websites, portals, and emerging digital products. Working closely with developers has also shaped the way I design — I care not only about how something looks in Figma, but about how it actually works once it leaves the design file.",
];

const DEFAULT_STATS = [
    { value: 8, suffix: "+", label: "Years designing" },
    { value: 120, suffix: "+", label: "Projects shipped" },
    { value: 30, suffix: "+", label: "Happy clients" },
];

const DEFAULT_DISCIPLINES = [
    {
        title: "UI/UX Design",
        text: "Designing interfaces and experiences for websites, applications, portals, and digital products.",
    },
    {
        title: "Web Design",
        text: "Creating responsive, modern websites with a strong focus on hierarchy, usability, and visual consistency.",
    },
    {
        title: "Visual & Graphic Design",
        text: "From branding and illustrations to marketing materials, social content, and other visual communication.",
    },
    {
        title: "Design Systems",
        text: "Creating reusable components, patterns, and visual rules that help products stay consistent as they grow.",
    },
];

const DEFAULT_PHILOSOPHY = {
    quote: "I don't think good design is necessarily about adding more.",
    paras: [
        "I'm usually drawn to work that feels simple, intentional, and easy to understand. Typography, spacing, hierarchy, interaction, and small details can make a bigger difference than adding another visual element.",
        "At the same time, I don't want everything to feel the same. I enjoy experimenting with interaction, motion, illustration, and visual ideas when they have a reason to exist.",
        "For me, the goal is somewhere between functional and expressive — something that works well, but still feels like someone cared about making it.",
    ],
};

const DEFAULT_JOURNEY = [
    {
        title: "Started in IT",
        text: "My background started in IT — working close to how software gets built, long before I thought of myself as a designer.",
    },
    {
        title: "Pulled toward the human side",
        text: "Over time I became more interested in the visual and human side of technology — how people interact with software, how information is presented, and how an idea becomes a real digital experience.",
    },
    {
        title: "Across the full range",
        text: "That grew into UI/UX design and eventually into working across a much broader range of creative projects — from government and institutional platforms to commercial websites, portals, and emerging digital products.",
    },
    {
        title: "Today",
        text: "I work primarily in UI/UX and digital design, while continuing to explore illustration, branding, visual design, and the technologies that make digital products possible. Still learning, still experimenting.",
    },
];

const DEFAULT_OUTSIDE_P2 =
    "This blog is part of that — a place to document what I'm working on, share ideas, and explore things that don't fit neatly into a portfolio case study.";

const DEFAULT_INTERESTS = ["Football", "Anime", "Travel"];

export default function About() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const reduce = useReducedMotion();

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase.from("site_settings").select("*").single();
                if (data?.about_text) {
                    try {
                        setSettings(JSON.parse(data.about_text));
                    } catch (e) {}
                }
            } catch (err) {
                console.error("Error fetching about settings:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="shell pt-40 pb-32 text-center" aria-label="Loading about">
                <p className="eyebrow animate-pulse">Opening the narrative</p>
            </div>
        );
    }

    const a = settings || {};
    const intro = [a.about_bio_1 || DEFAULT_INTRO[0], a.about_bio_2 || DEFAULT_INTRO[1], a.about_bio_3 || DEFAULT_INTRO[2]];
    const stats = Array.isArray(a.about_stats) && a.about_stats.length > 0 ? a.about_stats : DEFAULT_STATS;
    const disciplines =
        Array.isArray(a.about_disciplines) && a.about_disciplines.length > 0 ? a.about_disciplines : DEFAULT_DISCIPLINES;
    const quote = a.about_philosophy_quote || DEFAULT_PHILOSOPHY.quote;
    const philParas = [
        a.about_philosophy_p1 || DEFAULT_PHILOSOPHY.paras[0],
        a.about_philosophy_p2 || DEFAULT_PHILOSOPHY.paras[1],
        a.about_philosophy_p3 || DEFAULT_PHILOSOPHY.paras[2],
    ];
    const journey = Array.isArray(a.about_journey) && a.about_journey.length > 0 ? a.about_journey : DEFAULT_JOURNEY;
    const beyondTitle = a.about_beyond_title || "Beyond the Screen.";
    const beyondText =
        a.about_beyond_text ||
        "When I'm not designing, you'll find me on the football pitch, deep in a tactical anime series, or traveling to find fresh perspectives.";
    const outsideP2 = a.about_outside_p2 || DEFAULT_OUTSIDE_P2;
    const interests = Array.isArray(a.about_interests) && a.about_interests.length > 0 ? a.about_interests : DEFAULT_INTERESTS;
    const softwareList =
        Array.isArray(a.software_stack) && a.software_stack.length > 0 ? a.software_stack : DEFAULT_SOFTWARES;
    const portrait = a.about_image || null;

    return (
        <div className="shell pt-32 md:pt-44 pb-20 md:pb-28">
            {/* Intro */}
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                <div>
                    <Reveal>
                        <p className="eyebrow flex items-center gap-3">
                            <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                            About me
                        </p>
                        <h1 className="display mt-5 text-5xl sm:text-6xl md:text-7xl">
                            Hi, I&apos;m <em className="serif-accent text-razzmatazz">Noor.</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="mt-8 max-w-xl space-y-6 text-lg md:text-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {intro.map((p: string, i: number) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.12} className="lg:sticky lg:top-28">
                    {portrait ? (
                        <ImageReveal src={portrait} alt="Portrait of Noor Yoosuf" aspect="aspect-[4/5]" />
                    ) : (
                        <div className="img-frame flex aspect-[4/5] items-center justify-center">
                            <User size={96} aria-hidden className="text-zinc-200 dark:text-zinc-800" />
                        </div>
                    )}
                    <p className="mt-4 text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                        Noor Yoosuf — designer, Mal&eacute;, Maldives
                    </p>
                </Reveal>
            </div>

            {/* Counters */}
            <Reveal className="mt-16 md:mt-24">
                <dl className="grid grid-cols-1 gap-8 border-y border-zinc-200/80 dark:border-zinc-800/80 py-10 sm:grid-cols-3">
                    {stats.map((s: any) => (
                        <div key={s.label}>
                            <dd className="font-heading text-5xl md:text-6xl font-medium tracking-tight text-zinc-950 dark:text-white tabular-nums">
                                {reduce ? (
                                    <span>{s.value}{s.suffix}</span>
                                ) : (
                                    <CountUp
                                        end={Number(s.value) || 0}
                                        suffix={s.suffix || ""}
                                        duration={2.2}
                                        enableScrollSpy
                                        scrollSpyOnce
                                    />
                                )}
                            </dd>
                            <dt className="eyebrow mt-2">{s.label}</dt>
                        </div>
                    ))}
                </dl>
            </Reveal>

            {/* What I do */}
            <section className="mt-16 md:mt-24">
                <SectionHeading
                    eyebrow="Practice"
                    title={<>What <em className="serif-accent">I do.</em></>}
                />
                <div className="mt-4 grid gap-x-10 md:grid-cols-2">
                    {disciplines.map((d: any, i: number) => (
                        <Reveal key={d.title || i} delay={Math.min(i * 0.06, 0.2)}>
                            <div className="group border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 last:border-b md:[&:nth-last-child(2)]:border-b">
                                <p aria-hidden className="font-serif italic text-base text-zinc-300 dark:text-zinc-700 tabular-nums">
                                    0{i + 1}
                                </p>
                                <h3 className="mt-2 font-heading text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                    {d.title}
                                </h3>
                                <p className="mt-3 max-w-md text-[15px] font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {d.text}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Philosophy */}
            <section className="mt-16 md:mt-24">
                <SectionHeading
                    eyebrow="Perspective"
                    title={<>How I think <em className="serif-accent">about design.</em></>}
                />
                <Reveal delay={0.08}>
                    <div className="mt-8 max-w-3xl space-y-6">
                        <p className="font-serif italic text-2xl md:text-[1.9rem] leading-[1.45] text-zinc-900 dark:text-zinc-100">
                            &ldquo;{quote}&rdquo;
                        </p>
                        <div className="space-y-5 text-lg font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {philParas.map((p: string, i: number) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Journey timeline */}
            <section className="mt-16 md:mt-24">
                <SectionHeading
                    eyebrow="Background"
                    title={<>My <em className="serif-accent">journey.</em></>}
                />
                <ol className="mt-10">
                    {journey.map((j: any, i: number) => (
                        <Reveal key={j.title || i} delay={Math.min(i * 0.05, 0.2)}>
                            <li className="relative grid gap-3 border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 last:border-b sm:grid-cols-[4rem_1fr] sm:gap-6">
                                <span aria-hidden className="font-serif italic text-lg text-razzmatazz tabular-nums">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h3 className="font-heading text-xl md:text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                        {j.title}
                                    </h3>
                                    <p className="mt-2 max-w-2xl text-[15px] md:text-base font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        {j.text}
                                    </p>
                                </div>
                            </li>
                        </Reveal>
                    ))}
                </ol>
            </section>

            {/* Toolbox */}
            <section className="mt-16 md:mt-24">
                <SectionHeading
                    eyebrow="Toolbox"
                    title={<>Instruments of <em className="serif-accent">the trade.</em></>}
                />
                <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                    {softwareList.slice(0, 6).map((sw: any, i: number) => (
                        <Reveal key={sw.name || i} delay={Math.min(i * 0.05, 0.25)}>
                            <li className="group flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 text-center transition-colors duration-300 hover:border-razzmatazz dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-razzmatazz">
                                <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-800">
                                    <SoftwareIcon name={sw.name} size={26} />
                                </span>
                                <span>
                                    <span className="block font-heading text-[15px] font-medium tracking-tight text-zinc-950 dark:text-white">{sw.name}</span>
                                    <span className="mt-0.5 block text-xs font-light italic text-zinc-400 dark:text-zinc-500">{sw.category || "Tool"}</span>
                                </span>
                            </li>
                        </Reveal>
                    ))}
                </ul>
            </section>

            {/* Outside */}
            <Reveal className="mt-16 md:mt-24">
                <section className="overflow-hidden rounded-2xl bg-zinc-950 px-8 py-12 text-white dark:bg-zinc-900 md:px-14 md:py-16">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Outside the screen</p>
                    <h2 className="display mt-4 max-w-2xl text-3xl text-white md:text-5xl">{beyondTitle}</h2>
                    <div className="mt-6 max-w-2xl space-y-5 text-lg font-light leading-relaxed text-zinc-300">
                        <p>{beyondText}</p>
                        <p>{outsideP2}</p>
                    </div>
                    {interests.length > 0 && (
                        <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Interests">
                            {interests.map((item: string) => (
                                <li key={item} className="rounded-full border border-white/15 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-200">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link
                        href="/blog"
                        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-zinc-950 transition-colors duration-300 hover:bg-zinc-200"
                    >
                        Read the journal
                        <ArrowUpRight size={17} aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </section>
            </Reveal>
        </div>
    );
}
