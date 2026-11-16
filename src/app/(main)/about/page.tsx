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
    { name: "Adobe Illustrator", category: "Vector, Logo & Identity" },
    { name: "Adobe Photoshop", category: "Visuals & Raster Craft" },
    { name: "Adobe XD", category: "UI/UX Prototyping" },
    { name: "Adobe Premiere Pro", category: "Motion & Video Editing" },
    { name: "MS Office", category: "Documentation & Workflow" },
];

const DEFAULT_INTRO = [
    "I'm Noor Yoosuf — a UI/UX and visual designer based in Malé, Maldives, working at the intersection of digital product design, brand identity, and visual storytelling.",
    "Over the past five-plus years at Javaabu and through independent commissions, I've designed more than 60 digital products — ranging from national government portals and enterprise systems to commercial websites, dashboards, and mobile applications for teams in the Maldives and abroad.",
    "Working side-by-side with engineers shaped how I approach every brief: I care not only about how an interface looks in Figma, but how every spacing token, state, and interaction holds up in production. Beyond product screens, I love crafting tournament identities, rebrands, and expressive calligraphy that carry a story of their own.",
];

const DEFAULT_STATS = [
    { value: 5, suffix: "+", label: "Years in UI/UX & brand" },
    { value: 60, suffix: "+", label: "Digital products designed" },
    { value: 30, suffix: "+", label: "Brands & teams partnered" },
];

const DEFAULT_DISCIPLINES = [
    {
        title: "UI/UX & Product Design",
        text: "End-to-end interface design for government portals, web applications, dashboards, and mobile apps — turning complex workflows into calm, intuitive user journeys.",
    },
    {
        title: "Brand & Tournament Identity",
        text: "Distinctive logos, visual systems, and multi-year event identities — from futsal tournaments like Rashu Cup and Relax Kamana to commercial rebrands like Dunk n Dip.",
    },
    {
        title: "Web & Editorial Design",
        text: "Responsive, typography-led websites built around clear hierarchy, subtle motion, and seamless developer handoff.",
    },
    {
        title: "Illustration & Calligraphy",
        text: "Custom artwork, expressive typography, and culturally rooted lettering that give projects personality beyond standard templates.",
    },
];

const DEFAULT_EXPERIENCE = [
    {
        period: "2021 — Present",
        role: "UI/UX & Product Designer",
        org: "Javaabu",
        location: "Malé, Maldives",
        summary:
            "Designing government services, enterprise portals, web platforms, and mobile apps across 60+ shipped products — collaborating closely with engineering from discovery and wireframes to pixel-level design reviews.",
    },
    {
        period: "2018 — Present",
        role: "Independent Brand & Visual Designer",
        org: "Selected Commissions & Studios",
        location: "Maldives & Remote",
        summary:
            "Partnering with sports clubs, businesses, and community organizations on brand identities, tournament systems, kit & campaign visuals, and custom lettering.",
    },
];

const DEFAULT_PHILOSOPHY = {
    quote: "Consistency doesn't always have to look the same — sometimes it's something you feel more than you see.",
    paras: [
        "I'm drawn to work that feels simple, intentional, and effortless to navigate. Typography, spacing, hierarchy, and two pixels of alignment often make a bigger difference than adding another decorative element.",
        "At the same time, I never want two projects to feel like copies of each other. Whether it's embedding a hidden five-point DNA across three seasons of a futsal cup or simplifying a twenty-step public portal, every project deserves its own visual logic.",
        "For me, good design lives right between functional clarity and human warmth — something that solves the problem cleanly, while still feeling like someone genuinely cared about making it.",
    ],
};

const DEFAULT_JOURNEY = [
    {
        title: "Started in IT",
        text: "My foundation began in IT — close to how systems and software operate under the hood, long before I ever called myself a designer.",
    },
    {
        title: "Discovering UI/UX at Javaabu",
        text: "Five years ago, opening Adobe XD and Figma at Javaabu changed everything. Suddenly design wasn't just about making things look nice — every screen had purpose, every button had intention, and rigorous design reviews trained my eye to notice every pixel.",
    },
    {
        title: "Sixty+ products & counting",
        text: "From simplifying public-facing government services to helping startups define their very first product, working across dozens of industries taught me how to translate complex requirements into interfaces anyone can use.",
    },
    {
        title: "Today — product, brand & vibe coding",
        text: "Today I balance full-time UI/UX product work with branding, illustration, and building on the web myself — including bringing this portfolio to life through code.",
    },
];

const DEFAULT_BEYOND_TITLE = "Beyond the screen.";
const DEFAULT_BEYOND_TEXT =
    "When I'm not inside a Figma file or tweaking typography, you'll usually find me on the futsal pitch, deep into a tactical anime series, sketching personal illustration concepts, or traveling for fresh perspective.";
const DEFAULT_OUTSIDE_P2 =
    "My journal is an extension of that curiosity — a space to document lessons from five years in UI/UX, break down identity systems like Rashu Cup, and share ideas that don't fit neatly into a single case study.";

const DEFAULT_INTERESTS = [
    "Football & Futsal",
    "Anime",
    "Calligraphy",
    "Illustration",
    "Vibe Coding",
    "Travel",
];

/** Ignore truncated placeholder strings like "Based in the Maldives..." saved from old form defaults */
function cleanText(val: unknown, fallback: string): string {
    if (typeof val !== "string") return fallback;
    const trimmed = val.trim();
    if (!trimmed || trimmed.endsWith("...") || trimmed.length < 35) {
        return fallback;
    }
    return trimmed;
}

export default function About() {
    const [settings, setSettings] = useState<any>(null);
    const [clients, setClients] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const reduce = useReducedMotion();

    useEffect(() => {
        async function fetchSettings() {
            try {
                const [settingsRes, projectsRes] = await Promise.all([
                    supabase.from("site_settings").select("*").single(),
                    supabase.from("projects").select("client"),
                ]);
                if (settingsRes.data?.about_text) {
                    try {
                        setSettings(JSON.parse(settingsRes.data.about_text));
                    } catch (e) {}
                }
                if (projectsRes.data) {
                    const uniqueClients = Array.from(
                        new Set(projectsRes.data.map((p: any) => p.client).filter(Boolean))
                    ) as string[];
                    setClients(uniqueClients);
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
    const intro = [
        cleanText(a.about_bio_1, DEFAULT_INTRO[0]),
        cleanText(a.about_bio_2, DEFAULT_INTRO[1]),
        cleanText(a.about_bio_3, DEFAULT_INTRO[2]),
    ];
    const stats = Array.isArray(a.about_stats) && a.about_stats.length > 0 ? a.about_stats : DEFAULT_STATS;
    const disciplines =
        Array.isArray(a.about_disciplines) && a.about_disciplines.length > 0 ? a.about_disciplines : DEFAULT_DISCIPLINES;
    const quote = cleanText(a.about_philosophy_quote, DEFAULT_PHILOSOPHY.quote);
    const philParas = [
        cleanText(a.about_philosophy_p1, DEFAULT_PHILOSOPHY.paras[0]),
        cleanText(a.about_philosophy_p2, DEFAULT_PHILOSOPHY.paras[1]),
        cleanText(a.about_philosophy_p3, DEFAULT_PHILOSOPHY.paras[2]),
    ];
    const journey = Array.isArray(a.about_journey) && a.about_journey.length > 0 ? a.about_journey : DEFAULT_JOURNEY;
    const beyondTitle = a.about_beyond_title || DEFAULT_BEYOND_TITLE;
    const beyondText = cleanText(a.about_beyond_text, DEFAULT_BEYOND_TEXT);
    const outsideP2 = cleanText(a.about_outside_p2, DEFAULT_OUTSIDE_P2);
    const interests =
        Array.isArray(a.about_interests) && a.about_interests.length > 3 ? a.about_interests : DEFAULT_INTERESTS;
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
                        <p className="mt-4 font-serif italic text-xl md:text-2xl text-zinc-500 dark:text-zinc-400">
                            Designing interfaces, identities, and digital products that feel clear, human, and considered.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="mt-8 max-w-xl space-y-6 text-base md:text-lg font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {intro.map((p: string, i: number) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={0.16}>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <Link
                                href="/portfolio"
                                className="group inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                            >
                                Explore selected work
                                <ArrowUpRight
                                    size={16}
                                    aria-hidden
                                    className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 px-6 py-3 text-[14px] font-medium text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-white dark:hover:text-white"
                            >
                                Get in touch
                            </Link>
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
                    <div className="mt-4 flex items-center justify-between text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                        <span>Noor Yoosuf — UI/UX &amp; Brand Designer</span>
                        <span>Mal&eacute;, Maldives</span>
                    </div>
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

            {/* Experience */}
            <section className="mt-16 md:mt-24">
                <SectionHeading
                    eyebrow="Experience"
                    title={<>Where I&apos;ve <em className="serif-accent">practiced.</em></>}
                    lede="Balancing studio product design with independent brand and tournament identity commissions."
                />
                <div className="mt-8 divide-y divide-zinc-200/80 border-y border-zinc-200/80 dark:divide-zinc-800/80 dark:border-zinc-800/80">
                    {DEFAULT_EXPERIENCE.map((exp, i) => (
                        <Reveal key={exp.role} delay={i * 0.06}>
                            <div className="grid gap-4 py-8 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-8">
                                <p className="eyebrow text-razzmatazz">{exp.period}</p>
                                <div>
                                    <h3 className="font-heading text-xl md:text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                        {exp.role}{" "}
                                        <span className="font-serif italic font-normal text-zinc-500 dark:text-zinc-400">
                                            at {exp.org}
                                        </span>
                                    </h3>
                                    <p className="mt-2.5 max-w-2xl text-[15px] md:text-base font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        {exp.summary}
                                    </p>
                                </div>
                                <p className="text-xs font-normal tracking-wide text-zinc-400 dark:text-zinc-500">
                                    {exp.location}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

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
                                <p aria-hidden className="font-serif italic text-base text-razzmatazz tabular-nums">
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
                        <blockquote className="border-l-2 border-razzmatazz pl-6 font-serif italic text-2xl md:text-[1.9rem] leading-[1.45] text-zinc-900 dark:text-zinc-100">
                            &ldquo;{quote}&rdquo;
                        </blockquote>
                        <div className="space-y-5 text-base md:text-lg font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
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

            {/* Selected Collaborations / Clients */}
            {clients.length > 0 && (
                <section className="mt-16 md:mt-24">
                    <SectionHeading
                        eyebrow="Collaborations"
                        title={<>Teams &amp; <em className="serif-accent">organizations.</em></>}
                        lede="A few of the clubs, companies, and institutions I've designed identities and digital experiences for."
                    />
                    <Reveal delay={0.08}>
                        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {clients.map((client) => (
                                <li
                                    key={client}
                                    className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 text-[14px] font-medium text-zinc-700 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-200"
                                >
                                    <span>{client}</span>
                                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-razzmatazz/70" />
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </section>
            )}

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
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-zinc-950 transition-colors duration-300 hover:bg-zinc-200"
                        >
                            Read the journal
                            <ArrowUpRight size={17} aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
                        >
                            Start a conversation
                        </Link>
                    </div>
                </section>
            </Reveal>
        </div>
    );
}
