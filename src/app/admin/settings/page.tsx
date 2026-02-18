"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Github, Instagram, Linkedin, Twitter, Globe, Palette, Layout, PenTool } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SiteSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        hero_title: "Crafting digital experiences with minimal intent.",
        hero_subtitle: "Helping brands stand out through purposeful design and visual storytelling.",
        about_text: "",
        services: [
            { icon: "Palette", title: "Branding", description: "Visual systems that resonate and endure." },
            { icon: "Layout", title: "UI/UX Design", description: "Clean, user-centric digital interfaces." },
            { icon: "Globe", title: "Digital Strategy", description: "Data-driven design for online growth." },
            { icon: "PenTool", title: "Illustration", description: "Unique artwork to set your brand apart." }
        ],
        social_links: [
            { platform: "Instagram", url: "" },
            { platform: "Github", url: "" },
            { platform: "Linkedin", url: "" }
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
                            {settings.services.map((service, i) => (
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
                                            onClick={() => setSettings({ ...settings, services: settings.services.filter((_, idx) => idx !== i) })}
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
                    {/* Social Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                            Connect Hub
                        </h2>
                        <div className="space-y-6">
                            {settings.social_links.map((social, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{social.platform}</label>
                                    <input
                                        type="text"
                                        value={social.url}
                                        onChange={(e) => {
                                            const newLinks = [...settings.social_links];
                                            newLinks[i].url = e.target.value;
                                            setSettings({ ...settings, social_links: newLinks });
                                        }}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
                                        placeholder={`Link to ${social.platform}...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
