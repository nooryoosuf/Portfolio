"use client";
import { motion } from "framer-motion";
import { User, Rocket, Coffee, Heart, Code, Palette, Laptop } from "lucide-react";

const softwares = [
    { name: "Design", icon: Palette, desc: "Aesthetic vision" },
    { name: "Development", icon: Code, desc: "Technical implementation" },
    { name: "Strategy", icon: Rocket, desc: "Purposeful planning" },
    { name: "Research", icon: Laptop, desc: "User insight" },
];

const stats = [
    { label: "Years Experience", value: "8+" },
    { label: "Completed Projects", value: "150+" },
    { label: "Coffee Consumed", value: "∞" },
];

export default function About() {
    return (
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">The Narrative</span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 mb-12">
                            Creativity <br />
                            meets <br />
                            <span className="text-razzmatazz">purpose.</span>
                        </h1>
                        <div className="space-y-8 text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                            <p>
                                Based in the Maldives, I am a multi-disciplinary designer focused on building digital products that are as <span className="text-razzmatazz">functional</span> as they are <span className="text-razzmatazz">beautiful</span>.
                            </p>
                            <p>
                                I believe in the power of <span className="text-razzmatazz underline decoration-zinc-100 decoration-4 underline-offset-4">minimalism</span>—not just as an aesthetic choice, but as a commitment to clarity, accessibility, and user-centricity.
                            </p>
                            <p>
                                From brand identities to complex user interfaces, my goal is to strip away the noise and focus on what <span className="text-razzmatazz">truly matters</span> to the user and the business.
                            </p>

                        </div>

                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] bg-zinc-50 rounded-[3rem] overflow-hidden border border-zinc-100 flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-200 opacity-50" />
                            <User size={120} className="text-zinc-200 group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                    </motion.div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 py-12 border-y border-zinc-100">
                    {stats.map((stat, i) => (
                        <div key={stat.label} className="text-center">
                            <span className="block text-4xl md:text-5xl font-heading font-medium text-zinc-900 mb-2">{stat.value}</span>
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Approach Section */}
                <section className="mb-32">
                    <header className="mb-20">
                        <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">Expertise</span>
                        <h2 className="text-4xl font-heading font-medium tracking-tight text-zinc-900">How I work.</h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {softwares.map((sw, i) => (
                            <motion.div
                                key={sw.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-900 shadow-sm mb-6">
                                    <sw.icon size={20} />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 mb-2">{sw.name}</h3>
                                <p className="text-zinc-500 text-sm font-light">{sw.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Personal Section */}
                <section className="p-12 md:p-24 bg-zinc-900 rounded-[4rem] text-white">
                    <div className="max-w-3xl">
                        <header className="mb-12">
                            <h2 className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-8 underline decoration-zinc-700 underline-offset-8">
                                Beyond the <br /> Screen.
                            </h2>
                            <p className="text-zinc-400 text-xl font-light leading-relaxed">
                                When I'm not designing, you'll find me on the football pitch, deep in a tactical anime series, or traveling to find fresh perspectives. I'm a firm believer that life outside of work fuels the creativity inside it.
                            </p>
                        </header>
                        <div className="flex gap-4">
                            <span className="px-6 py-2 bg-white/5 rounded-full text-xs uppercase tracking-widest border border-white/10">Football</span>
                            <span className="px-6 py-2 bg-white/5 rounded-full text-xs uppercase tracking-widest border border-white/10">Anime</span>
                            <span className="px-6 py-2 bg-white/5 rounded-full text-xs uppercase tracking-widest border border-white/10">Travel</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

