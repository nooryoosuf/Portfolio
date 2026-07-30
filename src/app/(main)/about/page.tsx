"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SoftwareIcon from "@/components/SoftwareIcon";

const DEFAULT_SOFTWARES = [
    { name: "MS Office", category: "Productivity Suite" },
    { name: "Adobe Photoshop", category: "Photo & Raster Design" },
    { name: "Adobe Illustrator", category: "Vector & Branding" },
    { name: "Adobe Premiere Pro", category: "Video Editing & Motion" },
    { name: "Adobe XD", category: "UI/UX Prototyping" },
    { name: "Figma", category: "Interface & Design Systems" },
];

export default function About() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase.from('site_settings').select('*').single();
                if (data) {
                    let aboutData: any = {};
                    if (data.about_text) {
                        try {
                            aboutData = JSON.parse(data.about_text);
                        } catch (e) {
                            aboutData = { about_bio_1: data.about_text };
                        }
                    }
                    setSettings({
                        ...data,
                        ...aboutData
                    });
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
        return <div className="min-h-screen flex justify-center items-center bg-white dark:bg-zinc-950"><Loader2 className="animate-spin text-zinc-300 dark:text-zinc-700" size={48} /></div>;
    }

    const heading = settings?.about_heading || "Creativity meets purpose.";
    const bio1 = settings?.about_bio_1 || "Based in the Maldives, I am a multi-disciplinary designer focused on building digital products that are as functional as they are beautiful.";
    const bio2 = settings?.about_bio_2 || "I believe in the power of minimalism—not just as an aesthetic choice, but as a commitment to clarity, accessibility, and user-centricity.";
    const bio3 = settings?.about_bio_3 || "From brand identities to complex user interfaces, my goal is to strip away the noise and focus on what truly matters.";
    const beyondTitle = settings?.about_beyond_title || "Beyond the Screen.";
    const beyondText = settings?.about_beyond_text || "When I'm not designing, you'll find me on the football pitch, deep in a tactical anime series, or traveling to find fresh perspectives.";
    const interests = Array.isArray(settings?.about_interests) && settings.about_interests.length > 0 
        ? settings.about_interests 
        : ["Football", "Anime", "Travel"];
    const softwareList = Array.isArray(settings?.software_stack) && settings.software_stack.length > 0
        ? settings.software_stack
        : DEFAULT_SOFTWARES;

    const stats = [
        { label: "Years Experience", value: "8+" },
        { label: "Completed Projects", value: "150+" },
        { label: "Coffee Consumed", value: "∞" },
    ];

    return (
        <div className="pt-40 pb-32 px-6 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-widest uppercase mb-4 block">The Narrative</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tight text-zinc-900 dark:text-white mb-12 leading-tight">
                            {heading.split(" ").map((word: string, i: number) => (
                                <span key={i} className={i % 2 === 1 ? "text-razzmatazz" : ""}>{word} </span>
                            ))}
                        </h1>
                        <div className="space-y-8 text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                            {bio1 && <p>{bio1}</p>}
                            {bio2 && <p>{bio2}</p>}
                            {bio3 && <p>{bio3}</p>}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative group shadow-sm">
                            {settings?.about_image ? (
                                <img
                                    src={settings.about_image}
                                    alt="About Me"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 opacity-50" />
                                    <User size={120} className="text-zinc-200 dark:text-zinc-800 group-hover:scale-110 transition-transform duration-1000" />
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 py-12 border-y border-zinc-100 dark:border-zinc-800">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <span className="block text-4xl md:text-5xl font-heading font-medium text-zinc-900 dark:text-white mb-2">{stat.value}</span>
                            <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Software Stack & Tools Section */}
                <section className="mb-32">
                    <header className="mb-16">
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-widest uppercase mb-4 block">Software & Tools</span>
                        <h2 className="text-4xl font-heading font-medium tracking-tight text-zinc-900 dark:text-white">
                            Applications I <span className="text-razzmatazz">master</span>.
                        </h2>
                    </header>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {softwareList.map((sw: any, i: number) => (
                            <motion.div
                                key={sw.name || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-300 flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <SoftwareIcon name={sw.name} size={28} />
                                </div>
                                <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">{sw.name}</h3>
                                <p className="text-zinc-400 dark:text-zinc-500 text-[11px] font-light italic">{sw.category || "Tool"}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Beyond the Screen Section */}
                <section className="p-12 md:p-24 bg-zinc-900 dark:bg-zinc-900/90 rounded-[4rem] text-white relative overflow-hidden shadow-2xl border border-transparent dark:border-zinc-800">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-razzmatazz/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="max-w-3xl relative z-10">
                        <header className="mb-12">
                            <h2 className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-8 underline decoration-zinc-700 underline-offset-8">
                                {beyondTitle}
                            </h2>
                            <p className="text-zinc-400 text-xl font-light leading-relaxed">
                                {beyondText}
                            </p>
                        </header>
                        <div className="flex flex-wrap gap-4">
                            {interests.map((item: string) => (
                                <span key={item} className="px-6 py-2 bg-white/5 rounded-full text-xs uppercase tracking-widest border border-white/10 text-zinc-300">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
