"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Github, Instagram, Linkedin, Twitter, Globe, Palette, Layout, PenTool } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SiteSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>({
        hero_title: "Crafting digital experiences with minimal intent.",
        hero_subtitle: "Helping brands stand out through purposeful design and visual storytelling.",
        about_text: "",
        contact_email: "nooor.yoosuf@gmail.com",
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
        const { data, error } = await supabase.from('site_settings').select('*').single();
        if (data) setSettings(data);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from('site_settings').upsert({ id: 'main', ...settings });
        if (error) alert(error.message);
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-200" size={48} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Site <span className="text-razzmatazz">Identity</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Edit global content and configuration.</p>
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
                    {/* Hero Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                            Hero Content
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Main Title</label>
                                <textarea
                                    rows={3}
                                    value={settings.hero_title}
                                    onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Subtitle</label>
                                <textarea
                                    rows={3}
                                    value={settings.hero_subtitle}
                                    onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                Capabilities Menu
                            </h2>
                            <button
                                onClick={() => setSettings({ ...settings, services: [...settings.services, { icon: "Palette", title: "", description: "" }] })}
                                className="text-xs font-bold text-razzmatazz flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Service
                            </button>
                        </div>

                        <div className="space-y-6">
                            {settings.services?.map((service: any, i: number) => (
                                <div key={i} className="p-6 bg-zinc-50 border border-zinc-100 rounded-xl space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="grid grid-cols-2 gap-4 flex-1">
                                            <input
                                                value={service.title}
                                                onChange={(e) => {
                                                    const newServices = [...settings.services];
                                                    newServices[i].title = e.target.value;
                                                    setSettings({ ...settings, services: newServices });
                                                }}
                                                className="bg-white border border-zinc-200 rounded-lg py-2 px-3 text-sm font-medium"
                                                placeholder="Service Title"
                                            />
                                            <select
                                                value={service.icon}
                                                onChange={(e) => {
                                                    const newServices = [...settings.services];
                                                    newServices[i].icon = e.target.value;
                                                    setSettings({ ...settings, services: newServices });
                                                }}
                                                className="bg-white border border-zinc-200 rounded-lg py-2 px-3 text-sm"
                                            >
                                                <option value="Palette">Palette (Branding)</option>
                                                <option value="Layout">Layout (UI/UX)</option>
                                                <option value="Globe">Globe (Digital)</option>
                                                <option value="PenTool">PenTool (Illustration)</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, services: settings.services.filter((_: any, idx: number) => idx !== i) })}
                                            className="ml-4 p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={service.description}
                                        onChange={(e) => {
                                            const newServices = [...settings.services];
                                            newServices[i].description = e.target.value;
                                            setSettings({ ...settings, services: newServices });
                                        }}
                                        className="w-full bg-white border border-zinc-200 rounded-lg py-2 px-3 text-sm text-zinc-600 resize-none"
                                        placeholder="Service Description"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Social & Contact Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            Connect & Social Handles
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Primary Contact Email</label>
                            <input
                                type="email"
                                value={settings.contact_email || "nooor.yoosuf@gmail.com"}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors font-mono"
                                placeholder="nooor.yoosuf@gmail.com"
                            />
                        </div>

                        <div className="space-y-6 pt-4 border-t border-zinc-100">
                            {["Instagram", "Facebook", "Twitter", "Github"].map((platform) => {
                                const existing = settings.social_links?.find((s: any) => s.platform?.toLowerCase() === platform.toLowerCase()) || { platform, handle: "", url: "" };
                                return (
                                    <div key={platform} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl space-y-3">
                                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">{platform}</span>
                                        <div className="space-y-2">
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
                                                className="w-full bg-white border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 focus:outline-none placeholder:text-zinc-300"
                                                placeholder={`Username / Handle (e.g. @${platform.toLowerCase()})`}
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
                                                className="w-full bg-white border border-zinc-200 rounded-lg py-2 px-3 text-xs text-zinc-900 focus:outline-none placeholder:text-zinc-300 font-mono"
                                                placeholder={`Full URL (https://${platform.toLowerCase()}.com/...)`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
