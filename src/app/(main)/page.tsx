"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Palette, Layout, Globe, PenTool } from "lucide-react";
import Link from "next/link";
import CapabilityCard from "@/components/CapabilityCard";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import ClientMarquee from "@/components/ui/ClientMarquee";
import Testimonials from "@/components/ui/Testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import ArticleCard from "@/components/ui/ArticleCard";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedLink from "@/components/ui/AnimatedLink";
import { supabase } from "@/lib/supabase";

const ICONS: Record<string, any> = {
    Palette: <Palette size={20} />,
    Layout: <Layout size={20} />,
    Globe: <Globe size={20} />,
    PenTool: <PenTool size={20} />,
};

function renderTitle(title: string) {
    const words = title.split(" ").filter(Boolean);
    if (words.length <= 1) return <>{title}</>;
    const head = words.slice(0, -2).join(" ");
    const tail = words.slice(-2).join(" ");
    return (
        <>
            {head}{" "}
            <em className="serif-accent text-razzmatazz">{tail}</em>
        </>
    );
}

export default function Home() {
    const [settings, setSettings] = useState<any>(null);
    const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [clients, setClients] = useState<string[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [totals, setTotals] = useState({ works: 0, posts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, projectsRes, postsRes, worksCount, postsCount] = await Promise.all([
                    supabase.from('site_settings').select('*').single(),
                    supabase.from('projects').select('*'),
                    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(3),
                    supabase.from('projects').select('id', { count: 'exact', head: true }),
                    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
                ]);

                let rawProjects = projectsRes.data || [];
                let projectOrder: string[] = [];
                if (settingsRes.data?.about_text) {
                    try {
                        const parsed = JSON.parse(settingsRes.data.about_text);
                        if (parsed && Array.isArray(parsed.project_order)) {
                            projectOrder = parsed.project_order;
                        }
                    } catch (e) {}
                }

                if (projectOrder.length > 0) {
                    const orderMap = new Map(projectOrder.map((id: string, idx: number) => [id, idx]));
                    rawProjects.sort((a, b) => {
                        const orderA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
                        const orderB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
                        return orderA - orderB;
                    });
                } else {
                    rawProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                }

                if (settingsRes.data) setSettings(settingsRes.data);
                setFeaturedProjects(rawProjects.slice(0, 3));
                setLatestPosts(postsRes.data || []);
                setClients(Array.from(new Set(rawProjects.map((p: any) => p.client).filter(Boolean))) as string[]);
                try {
                    const parsed = settingsRes.data?.about_text ? JSON.parse(settingsRes.data.about_text) : {};
                    if (Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0) {
                        setTestimonials(parsed.testimonials);
                    }
                } catch (e) {}
                setTotals({ works: worksCount.count || 0, posts: postsCount.count || 0 });
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" aria-label="Loading">
                <p className="font-heading text-xl font-medium tracking-tight text-zinc-950 dark:text-white">
                    Noor<span className="text-razzmatazz">.</span>
                </p>
                <p className="eyebrow animate-pulse">Preparing the studio</p>
            </div>
        );
    }

    const heroTitle = typeof settings?.hero_title === 'string' ? settings.hero_title : "Crafting digital experiences with minimal intent.";
    const heroSubtitle = settings?.hero_subtitle || "Helping brands stand out through purposeful design and visual storytelling.";
    const services = Array.isArray(settings?.services) ? settings.services : [];

    return (
        <div>
            {/* Hero — editorial masthead */}
            <section className="relative overflow-hidden pt-32 md:pt-44 pb-14 md:pb-20">
                <div className="shell relative">
                <Reveal delay={0.08}>
                    <h1 className="display mt-7 max-w-5xl text-[2.9rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
                        {renderTitle(heroTitle)}
                    </h1>
                </Reveal>
                <Reveal delay={0.16}>
                    <p className="lede mt-7 max-w-2xl">{heroSubtitle}</p>
                </Reveal>
                <Reveal delay={0.22}>
                    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <MagneticButton>
                            <Link
                                href="/portfolio"
                                className="group inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                            >
                                View selected work
                                <ArrowUpRight size={17} aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </MagneticButton>
                        <AnimatedLink href="/about" withArrow>
                            More about me
                        </AnimatedLink>
                    </div>
                </Reveal>
                <Reveal delay={0.28}>
                    <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-6 text-sm sm:grid-cols-4">
                        {[
                            ["Selected works", totals.works > 0 ? `${totals.works} case ${totals.works === 1 ? "study" : "studies"}` : "Case studies"],
                            ["Journal", totals.posts > 0 ? `${totals.posts} ${totals.posts === 1 ? "entry" : "entries"}` : "Design notes"],
                            ["Base", "Malé, Maldives"],
                            ["Focus", "Brand & interface"],
                        ].map(([term, value]) => (
                            <div key={term}>
                                <dt className="eyebrow">{term}</dt>
                                <dd className="mt-1.5 font-light text-zinc-600 dark:text-zinc-300">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>
                </div>
            </section>

            {/* Selected works */}
            <section className="shell section-gap border-t border-zinc-200/80 dark:border-zinc-800/80">
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        eyebrow="Selected work"
                        title={<>Work with <em className="serif-accent">intent.</em></>}
                    />
                    <Reveal delay={0.1}>
                        <AnimatedLink href="/portfolio" withArrow className="text-[15px]">
                            All projects
                        </AnimatedLink>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-6">
                    {featuredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            category={project.category}
                            color={project.color}
                            slug={project.slug}
                            featured_image={project.featured_image}
                            span={index === 0 ? "md:col-span-6" : "md:col-span-3"}
                            aspect={index === 0 ? "video" : "portrait"}
                        />
                    ))}
                </div>
            </section>

            {/* Clients + testimonials */}
            {(clients.length > 0 || testimonials.length > 0) && (
                <section className="border-t border-zinc-200/80 dark:border-zinc-800/80">
                    <div className="shell section-gap">
                        {clients.length > 0 && (
                            <Reveal>
                                <p className="eyebrow mb-8 text-center">Teams I&apos;ve worked with</p>
                                <ClientMarquee clients={clients} />
                            </Reveal>
                        )}
                        {testimonials.length > 0 && (
                            <Reveal delay={0.08} className={clients.length > 0 ? "mt-14 md:mt-20" : ""}>
                                <Testimonials items={testimonials} />
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {/* Capabilities — numbered editorial index */}
            {services.length > 0 && (
                <section className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30">
                    <div className="shell section-gap grid gap-10 md:grid-cols-[1fr_1.6fr]">
                        <div className="md:sticky md:top-28 md:self-start">
                            <SectionHeading
                                eyebrow="Capabilities"
                                title={<>A practice built on <em className="serif-accent">clarity.</em></>}
                                lede="Fewer, sharper services — each one aimed at making brands coherent across every touchpoint."
                            />
                        </div>
                        <div>
                            {services.map((service: any, i: number) => (
                                <CapabilityCard
                                    key={i}
                                    index={i}
                                    icon={ICONS[service.icon] || <Palette size={20} />}
                                    title={service.title}
                                    description={service.description}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Journal teaser */}
            {latestPosts.length > 0 && (
                <section className="shell section-gap border-t border-zinc-200/80 dark:border-zinc-800/80">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            eyebrow="Journal"
                            title={<>Notes on <em className="serif-accent">process.</em></>}
                            lede="Short, practical entries on design decisions — what worked, what didn't, and why."
                        />
                        <Reveal delay={0.1}>
                            <AnimatedLink href="/blog" withArrow className="text-[15px]">
                                All entries
                            </AnimatedLink>
                        </Reveal>
                    </div>
                    <div>
                        {latestPosts.map((post, i) => (
                            <ArticleCard
                                key={post.id}
                                index={i}
                                slug={post.slug}
                                title={post.title}
                                description={post.description}
                                category={post.category}
                                createdAt={post.created_at}
                                readTime={post.read_time}
                                featuredImage={post.featured_image}
                            />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
