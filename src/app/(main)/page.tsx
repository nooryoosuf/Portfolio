"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Palette, Layout, Globe, PenTool, Loader2 } from "lucide-react";
import Link from "next/link";
import CapabilityCard from "@/components/CapabilityCard";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/lib/supabase";

const ICONS: Record<string, any> = {
    Palette: <Palette size={24} />,
    Layout: <Layout size={24} />,
    Globe: <Globe size={24} />,
    PenTool: <PenTool size={24} />,
};

export default function Home() {
    const [settings, setSettings] = useState<any>(null);
    const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, projectsRes] = await Promise.all([
                    supabase.from('site_settings').select('*').single(),
                    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3)
                ]);

                if (settingsRes.data) setSettings(settingsRes.data);
                if (projectsRes.data) setFeaturedProjects(projectsRes.data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-zinc-100" size={48} /></div>;

    const heroTitle = settings?.hero_title || "Crafting digital experiences with minimal intent.";
    const heroSubtitle = settings?.hero_subtitle || "Helping brands stand out through purposeful design and visual storytelling.";
    const services = settings?.services || [];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-zinc-400 text-sm font-medium tracking-[0.2em] uppercase mb-6 block">
                            UI/UX & Graphic Designer
                        </span>
                        <h1 className="text-5xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 leading-[1.1] mb-8 whitespace-pre-line">
                            {heroTitle.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 3 === 0 ? "text-razzmatazz" : ""}>{word} </span>
                            ))}
                        </h1>
                        <p className="max-w-xl mx-auto text-zinc-500 text-lg md:text-xl font-light leading-relaxed mb-12">
                            {heroSubtitle}
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <Link
                                href="/portfolio"
                                className="px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-all duration-300 flex items-center gap-2 group shadow-sm"
                            >
                                View Projects
                                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/about"
                                className="text-zinc-600 font-medium hover:text-zinc-900 transition-colors"
                            >
                                Learn more about me
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                    className="mt-24 w-px h-24 bg-gradient-to-b from-zinc-200 to-transparent"
                />
            </section>

            {/* Capabilities Section */}
            <section className="section-padding bg-zinc-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                        <div>
                            <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">Services</span>
                            <h2 className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-zinc-900">
                                My approach to <span className="text-razzmatazz">design.</span>
                            </h2>
                        </div>
                        <p className="max-w-md text-zinc-500 font-light">
                            I specialize in building <span className="text-razzmatazz">cohesive brand systems</span> and intuitive style guides.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service: any, i: number) => (
                            <CapabilityCard
                                key={i}
                                icon={ICONS[service.icon] || <Palette size={24} />}
                                title={service.title}
                                description={service.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="section-padding">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <h2 className="text-3xl font-heading font-medium tracking-tight text-zinc-900">
                            Selected Works
                        </h2>
                        <Link href="/portfolio" className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-4 decoration-zinc-200 hover:decoration-zinc-900">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                        {featuredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                title={project.title}
                                category={project.category}
                                color={project.color}
                                slug={project.slug}
                                span={index === 0 ? "md:col-span-6" : "md:col-span-3"}
                                aspect={index === 0 ? "video" : "square"}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
