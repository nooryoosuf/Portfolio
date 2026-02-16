"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Palette, Layout, Globe, PenTool } from "lucide-react";
import Link from "next/link";
import CapabilityCard from "@/components/CapabilityCard";
import ProjectCard from "@/components/ProjectCard";


export default function Home() {
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
                        <h1 className="text-5xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 leading-[1.1] mb-8">
                            Crafting digital <br />
                            <span className="text-razzmatazz">experiences</span> with <br />
                            minimal intent.
                        </h1>
                        <p className="max-w-xl mx-auto text-zinc-500 text-lg md:text-xl font-light leading-relaxed mb-12">
                            Helping brands stand out through <span className="text-razzmatazz">purposeful design</span> and visual storytelling.
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

                {/* Visual Accent */}
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
                            I specialize in building <span className="text-razzmatazz">cohesive brand systems</span> and intuitive user interfaces that bridge the gap between aesthetics and functionality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CapabilityCard
                            icon={<Palette size={24} />}
                            title="Branding"
                            description="Visual systems that resonate and endure."
                        />
                        <CapabilityCard
                            icon={<Layout size={24} />}
                            title="UI/UX Design"
                            description="Clean, user-centric digital interfaces."
                        />
                        <CapabilityCard
                            icon={<Globe size={24} />}
                            title="Digital Strategy"
                            description="Data-driven design for online growth."
                        />
                        <CapabilityCard
                            icon={<PenTool size={24} />}
                            title="Illustration"
                            description="Unique artwork to set your brand apart."
                        />
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
                        {/* Size 3 Card */}
                        <ProjectCard
                            title="Rashu Cup 2024"
                            category="Branding"
                            color="#18181b"
                            slug="northend-united"
                            span="md:col-span-6"
                            aspect="video"
                        />
                        {/* Size 2 Cards */}
                        <ProjectCard
                            title="Feithoriya"
                            category="Brand Design"
                            color="#3f3f46"
                            slug="feithoriya"
                            span="md:col-span-3"
                            aspect="square"
                        />
                        <ProjectCard
                            title="Dunk n Dip"
                            category="Packaging"
                            color="#71717a"
                            slug="dunk-n-dip"
                            span="md:col-span-3"
                            aspect="square"
                        />
                    </div>
                </div>
            </section>


            {/* Call to Action */}
            <section className="pb-32 px-6">
                <div className="max-w-4xl mx-auto bg-zinc-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-8">
                            Have a project in mind? <br />
                            Let's <span className="text-zinc-400">build it</span> together.
                        </h2>
                        <Link
                            href="/contact"
                            className="inline-flex px-8 py-4 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-100 transition-all duration-300 shadow-sm"
                        >
                            Start a Conversation
                        </Link>
                    </div>
                    {/* Abstract Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
            </section>
        </div>
    );
}
