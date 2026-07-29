"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, User, Cpu, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";
import SoftwareIcon from "@/components/SoftwareIcon";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_SOFTWARES = [
    { name: "MS Office", category: "Productivity Suite" },
    { name: "Adobe Photoshop", category: "Photo & Raster Design" },
    { name: "Adobe Illustrator", category: "Vector & Branding" },
    { name: "Adobe Premiere Pro", category: "Video Editing & Motion" },
    { name: "Adobe XD", category: "UI/UX Prototyping" },
    { name: "Figma", category: "Interface & Design Systems" },
];

export default function SiteSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [settings, setSettings] = useState<any>({
        hero_title: "Crafting digital experiences with minimal intent.",
        hero_subtitle: "Helping brands stand out through purposeful design and visual storytelling.",
        contact_email: "nooor.yoosuf@gmail.com",
        about_heading: "Creativity meets purpose.",
        about_bio_1: "Based in the Maldives, I am a multi-disciplinary designer focused on building digital products that are as functional as they are beautiful.",
        about_bio_2: "I believe in the power of minimalism—not just as an aesthetic choice, but as a commitment to clarity, accessibility, and user-centricity.",
        about_bio_3: "From brand identities to complex user interfaces, my goal is to strip away the noise and focus on what truly matters.",
        about_image: "",
        about_beyond_title: "Beyond the Screen.",
        about_beyond_text: "When I'm not designing, you'll find me on the football pitch, deep in a tactical anime series, or traveling to find fresh perspectives.",
        about_interests: ["Football", "Anime", "Travel"],
        software_stack: DEFAULT_SOFTWARES,
        project_order: [] as string[],
        services: [
            { icon: "Palette", title: "Branding", description: "Visual systems that resonate and endure." },
            { icon: "Layout", title: "UI/UX Design", description: "Clean, user-centric digital interfaces." },
            { icon: "Globe", title: "Digital Strategy", description: "Data-driven design for online growth." },
            { icon: "PenTool", title: "Illustration", description: "Unique artwork to set your brand apart." }
        ],
        social_links: [
            { platform: "Instagram", handle: "@nooryoosuf", url: "https://instagram.com" },
            { platform: "Facebook", handle: "Noor Yoosuf", url: "https://facebook.com" },
            { platform: "Twitter", handle: "@nooryoosuf", url: "https://x.com" },
            { platform: "Github", handle: "nooryoosuf", url: "https://github.com/nooryoosuf" }
        ]
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
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

            setSettings((prev: any) => ({
                ...prev,
                hero_title: data.hero_title || prev.hero_title,
                hero_subtitle: data.hero_subtitle || prev.hero_subtitle,
                contact_email: data.contact_email || prev.contact_email,
                services: data.services || prev.services,
                social_links: data.social_links || prev.social_links,
                about_heading: aboutData.about_heading || prev.about_heading,
                about_bio_1: aboutData.about_bio_1 || prev.about_bio_1,
                about_bio_2: aboutData.about_bio_2 || prev.about_bio_2,
                about_bio_3: aboutData.about_bio_3 || prev.about_bio_3,
                about_image: aboutData.about_image || prev.about_image,
                about_beyond_title: aboutData.about_beyond_title || prev.about_beyond_title,
                about_beyond_text: aboutData.about_beyond_text || prev.about_beyond_text,
                about_interests: aboutData.about_interests || prev.about_interests,
                software_stack: aboutData.software_stack && Array.isArray(aboutData.software_stack) && aboutData.software_stack.length > 0 ? aboutData.software_stack : DEFAULT_SOFTWARES,
                project_order: aboutData.project_order || []
            }));
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const aboutPayload = {
                about_heading: settings.about_heading,
                about_bio_1: settings.about_bio_1,
                about_bio_2: settings.about_bio_2,
                about_bio_3: settings.about_bio_3,
                about_image: settings.about_image,
                about_beyond_title: settings.about_beyond_title,
                about_beyond_text: settings.about_beyond_text,
                about_interests: settings.about_interests,
                software_stack: settings.software_stack,
                project_order: settings.project_order
            };

            const payload = {
                id: 'main',
                hero_title: settings.hero_title,
                hero_subtitle: settings.hero_subtitle,
                contact_email: settings.contact_email,
                services: settings.services,
                social_links: settings.social_links,
                about_text: JSON.stringify(aboutPayload)
            };

            const { error } = await supabase.from('site_settings').upsert(payload);
            if (error) throw error;

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);
        } catch (err: any) {
            alert("Error saving settings: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-200" size={48} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Site <span className="text-razzmatazz">Identity & About</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Edit global content, About Me narrative, and software stack.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? "Deploying..." : "Update Live Site"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* About Me Narrative Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <User size={16} className="text-razzmatazz" /> About Me Page Content
                        </h2>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Main Heading</label>
                            <input
                                type="text"
                                value={settings.about_heading || ""}
                                onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-heading text-lg focus:outline-none"
                                placeholder="Creativity meets purpose."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bio Paragraph 1</label>
                            <textarea
                                rows={2}
                                value={settings.about_bio_1 || ""}
                                onChange={(e) => setSettings({ ...settings, about_bio_1: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 text-sm focus:outline-none resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bio Paragraph 2</label>
                            <textarea
                                rows={2}
                                value={settings.about_bio_2 || ""}
                                onChange={(e) => setSettings({ ...settings, about_bio_2: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 text-sm focus:outline-none resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bio Paragraph 3</label>
                            <textarea
                                rows={2}
                                value={settings.about_bio_3 || ""}
                                onChange={(e) => setSettings({ ...settings, about_bio_3: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 text-sm focus:outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Beyond Screen Heading</label>
                                <input
                                    type="text"
                                    value={settings.about_beyond_title || ""}
                                    onChange={(e) => setSettings({ ...settings, about_beyond_title: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interests (Comma Separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(settings.about_interests) ? settings.about_interests.join(", ") : (settings.about_interests || "")}
                                    onChange={(e) => setSettings({ ...settings, about_interests: e.target.value.split(",").map((s: string) => s.trim()) })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-sm"
                                    placeholder="Football, Anime, Travel"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Beyond Screen Bio</label>
                            <textarea
                                rows={3}
                                value={settings.about_beyond_text || ""}
                                onChange={(e) => setSettings({ ...settings, about_beyond_text: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 text-sm focus:outline-none resize-none"
                            />
                        </div>
                    </section>

                    {/* Software Stack & Tools */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <Cpu size={16} className="text-razzmatazz" /> Software & Tools Stack
                            </h2>
                            <button
                                onClick={() => setSettings({ ...settings, software_stack: [...(settings.software_stack || []), { name: "", category: "Tool" }] })}
                                className="text-xs font-bold text-razzmatazz flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Software Tool
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {settings.software_stack?.map((sw: any, i: number) => (
                                <div key={i} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-zinc-100 shrink-0">
                                            <SoftwareIcon name={sw.name} size={20} />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <input
                                                type="text"
                                                value={sw.name}
                                                onChange={(e) => {
                                                    const stack = [...settings.software_stack];
                                                    stack[i].name = e.target.value;
                                                    setSettings({ ...settings, software_stack: stack });
                                                }}
                                                placeholder="Software Name"
                                                className="w-full bg-white border border-zinc-200 rounded-lg py-1 px-2 text-xs font-bold text-zinc-900 focus:outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={sw.category}
                                                onChange={(e) => {
                                                    const stack = [...settings.software_stack];
                                                    stack[i].category = e.target.value;
                                                    setSettings({ ...settings, software_stack: stack });
                                                }}
                                                placeholder="Category (e.g. UI/UX)"
                                                className="w-full bg-white border border-zinc-200 rounded-lg py-1 px-2 text-[10px] text-zinc-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, software_stack: settings.software_stack.filter((_: any, idx: number) => idx !== i) })}
                                        className="text-zinc-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Profile Picture Upload */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">About Me Portrait Photo</h2>
                        <ImageUpload
                            value={settings.about_image}
                            onChange={(url) => setSettings({ ...settings, about_image: url })}
                        />
                    </section>

                    {/* Social & Contact Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm space-y-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Connect & Social Handles</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Primary Contact Email</label>
                            <input
                                type="email"
                                value={settings.contact_email || "nooor.yoosuf@gmail.com"}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-sm text-zinc-900 focus:outline-none font-mono"
                                placeholder="nooor.yoosuf@gmail.com"
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            {["Instagram", "Facebook", "Twitter", "Github"].map((platform) => {
                                const existing = settings.social_links?.find((s: any) => s.platform?.toLowerCase() === platform.toLowerCase()) || { platform, handle: "", url: "" };
                                return (
                                    <div key={platform} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl space-y-2">
                                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">{platform}</span>
                                        <input
                                            type="text"
                                            value={existing.handle || ""}
                                            onChange={(e) => {
                                                const links = settings.social_links || [];
                                                const idx = links.findIndex((s: any) => s.platform?.toLowerCase() === platform.toLowerCase());
                                                const updated = { platform, handle: e.target.value, url: existing.url || "" };
                                                const newLinks = idx >= 0 ? links.map((s: any, i: number) => i === idx ? updated : s) : [...links, updated];
                                                setSettings({ ...settings, social_links: newLinks });
                                            }}
                                            className="w-full bg-white border border-zinc-200 rounded-lg py-1.5 px-3 text-xs text-zinc-900 focus:outline-none"
                                            placeholder="Username / Handle"
                                        />
                                        <input
                                            type="text"
                                            value={existing.url || ""}
                                            onChange={(e) => {
                                                const links = settings.social_links || [];
                                                const idx = links.findIndex((s: any) => s.platform?.toLowerCase() === platform.toLowerCase());
                                                const updated = { platform, handle: existing.handle || "", url: e.target.value };
                                                const newLinks = idx >= 0 ? links.map((s: any, i: number) => i === idx ? updated : s) : [...links, updated];
                                                setSettings({ ...settings, social_links: newLinks });
                                            }}
                                            className="w-full bg-white border border-zinc-200 rounded-lg py-1.5 px-3 text-xs text-zinc-900 focus:outline-none font-mono"
                                            placeholder="Full URL"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 z-[100]"
                    >
                        <CheckCircle2 className="text-razzmatazz" size={20} />
                        <span className="text-sm font-medium italic">Live site identity & about settings successfully deployed!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
