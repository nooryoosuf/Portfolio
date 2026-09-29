"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, CheckCircle2 } from "lucide-react";
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
        about_bio_1: "I'm a UI/UX and visual designer from the Maldives, interested in the space where design, technology, and creativity meet.",
        about_bio_2: "I design digital experiences that aim to be clear, useful, and visually considered. My work spans websites, web applications, digital products, design systems, branding, and visual communication. I enjoy taking something that might feel complicated and turning it into something that feels simple and intuitive.",
        about_bio_3: "Over the years, I've had the opportunity to work on a wide range of digital projects, from government and institutional platforms to commercial websites, portals, and emerging digital products. Working closely with developers has also shaped the way I design — I care not only about how something looks in Figma, but about how it actually works once it leaves the design file.",
        about_image: "",
        about_beyond_title: "Design isn't the only thing.",
        about_beyond_text: "I enjoy illustration and traditional drawing, experimenting with new creative tools, following technology and digital products, and working on personal ideas that don't always have a client or brief behind them. I like building things simply because I think they would be interesting to exist.",
        about_outside_p2: "This blog is part of that — a place to document what I'm working on, share ideas, and explore things that don't fit neatly into a portfolio case study.",
        about_interests: ["Football", "Anime", "Travel"],
        about_stats: [
            { value: 8, suffix: "+", label: "Years designing" },
            { value: 120, suffix: "+", label: "Projects shipped" },
            { value: 30, suffix: "+", label: "Happy clients" },
        ],
        about_disciplines: [
            { title: "UI/UX Design", text: "Designing interfaces and experiences for websites, applications, portals, and digital products." },
            { title: "Web Design", text: "Creating responsive, modern websites with a strong focus on hierarchy, usability, and visual consistency." },
            { title: "Visual & Graphic Design", text: "From branding and illustrations to marketing materials, social content, and other visual communication." },
            { title: "Design Systems", text: "Creating reusable components, patterns, and visual rules that help products stay consistent as they grow." },
        ],
        about_philosophy_quote: "I don't think good design is necessarily about adding more.",
        about_philosophy_p1: "I'm usually drawn to work that feels simple, intentional, and easy to understand. Typography, spacing, hierarchy, interaction, and small details can make a bigger difference than adding another visual element.",
        about_philosophy_p2: "At the same time, I don't want everything to feel the same. I enjoy experimenting with interaction, motion, illustration, and visual ideas when they have a reason to exist.",
        about_philosophy_p3: "For me, the goal is somewhere between functional and expressive — something that works well, but still feels like someone cared about making it.",
        about_journey: [
            { title: "Started in IT", text: "My background started in IT — working close to how software gets built, long before I thought of myself as a designer." },
            { title: "Pulled toward the human side", text: "Over time I became more interested in the visual and human side of technology — how people interact with software, how information is presented, and how an idea becomes a real digital experience." },
            { title: "Across the full range", text: "That grew into UI/UX design and eventually into working across a much broader range of creative projects — from government and institutional platforms to commercial websites, portals, and emerging digital products." },
            { title: "Today", text: "I work primarily in UI/UX and digital design, while continuing to explore illustration, branding, visual design, and the technologies that make digital products possible. Still learning, still experimenting." },
        ],
        testimonials: [] as { quote: string; name: string; role?: string }[],
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
                contact_email: aboutData.contact_email || prev.contact_email,
                services: data.services || prev.services,
                social_links: data.social_links || prev.social_links,
                about_heading: aboutData.about_heading || prev.about_heading,
                about_bio_1: aboutData.about_bio_1 || prev.about_bio_1,
                about_bio_2: aboutData.about_bio_2 || prev.about_bio_2,
                about_bio_3: aboutData.about_bio_3 || prev.about_bio_3,
                about_image: aboutData.about_image || prev.about_image,
                about_beyond_title: aboutData.about_beyond_title || prev.about_beyond_title,
                about_beyond_text: aboutData.about_beyond_text || prev.about_beyond_text,
                about_outside_p2: aboutData.about_outside_p2 || prev.about_outside_p2,
                about_interests: aboutData.about_interests || prev.about_interests,
                about_stats: Array.isArray(aboutData.about_stats) && aboutData.about_stats.length > 0 ? aboutData.about_stats : prev.about_stats,
                about_disciplines: Array.isArray(aboutData.about_disciplines) && aboutData.about_disciplines.length > 0 ? aboutData.about_disciplines : prev.about_disciplines,
                about_philosophy_quote: aboutData.about_philosophy_quote || prev.about_philosophy_quote,
                about_philosophy_p1: aboutData.about_philosophy_p1 || prev.about_philosophy_p1,
                about_philosophy_p2: aboutData.about_philosophy_p2 || prev.about_philosophy_p2,
                about_philosophy_p3: aboutData.about_philosophy_p3 || prev.about_philosophy_p3,
                about_journey: Array.isArray(aboutData.about_journey) && aboutData.about_journey.length > 0 ? aboutData.about_journey : prev.about_journey,
                testimonials: Array.isArray(aboutData.testimonials) ? aboutData.testimonials : prev.testimonials,
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
                about_outside_p2: settings.about_outside_p2,
                about_interests: settings.about_interests,
                about_stats: settings.about_stats,
                about_disciplines: settings.about_disciplines,
                about_philosophy_quote: settings.about_philosophy_quote,
                about_philosophy_p1: settings.about_philosophy_p1,
                about_philosophy_p2: settings.about_philosophy_p2,
                about_philosophy_p3: settings.about_philosophy_p3,
                about_journey: settings.about_journey,
                testimonials: settings.testimonials || [],
                software_stack: settings.software_stack,
                project_order: settings.project_order,
                contact_email: settings.contact_email
            };

            const payload = {
                id: 'main',
                hero_title: settings.hero_title,
                hero_subtitle: settings.hero_subtitle,
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

    if (loading) return <p className="eyebrow animate-pulse py-24 text-center">Loading settings</p>;

    const setList = (key: string, arr: any[]) => setSettings({ ...settings, [key]: arr });

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">Site settings</h1>
                    <p className="lede mt-3 !text-base">Global content, about narrative, homepage and toolbox.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-admin">
                    <Save size={17} aria-hidden />
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    {/* Homepage hero */}
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Homepage hero</h2>
                        <div>
                            <label htmlFor="set-hero-title" className="field-label">Hero title</label>
                            <textarea id="set-hero-title" rows={2} value={settings.hero_title || ""} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} className="field resize-none font-heading text-lg" />
                        </div>
                        <div>
                            <label htmlFor="set-hero-sub" className="field-label">Hero subtitle</label>
                            <textarea id="set-hero-sub" rows={2} value={settings.hero_subtitle || ""} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} className="field resize-none" />
                        </div>
                    </section>

                    {/* Homepage services */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="admin-eyebrow">Homepage services</h2>
                            <button type="button" onClick={() => setList("services", [...(settings.services || []), { icon: "Palette", title: "", description: "" }])} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">
                                + Add service
                            </button>
                        </div>
                        <div className="space-y-3">
                            {settings.services?.map((svc: any, i: number) => (
                                <div key={i} className="space-y-2.5 rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/70">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`svc-icon-${i}`} className="sr-only">Icon</label>
                                        <select id={`svc-icon-${i}`} value={svc.icon || "Palette"} onChange={(e) => { const a = [...settings.services]; a[i] = { ...a[i], icon: e.target.value }; setList("services", a); }} className="field-sm w-32">
                                            {["Palette", "Layout", "Globe", "PenTool"].map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                                        </select>
                                        <input type="text" aria-label="Service title" value={svc.title || ""} onChange={(e) => { const a = [...settings.services]; a[i] = { ...a[i], title: e.target.value }; setList("services", a); }} placeholder="Service title" className="field-sm flex-1 font-medium" />
                                        <button type="button" aria-label="Remove service" onClick={() => setList("services", settings.services.filter((_: any, idx: number) => idx !== i))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-red-500">
                                            <Trash2 size={16} aria-hidden />
                                        </button>
                                    </div>
                                    <label htmlFor={`svc-desc-${i}`} className="sr-only">Service description</label>
                                    <textarea id={`svc-desc-${i}`} rows={2} value={svc.description || ""} onChange={(e) => { const a = [...settings.services]; a[i] = { ...a[i], description: e.target.value }; setList("services", a); }} placeholder="Service description" className="field-sm resize-none" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* About narrative */}
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">About page — intro</h2>
                        <div>
                            <label htmlFor="set-heading" className="field-label">Heading (legacy)</label>
                            <input id="set-heading" type="text" value={settings.about_heading || ""} onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })} className="field-sm font-heading text-lg" />
                        </div>
                        {[1, 2, 3].map((n) => (
                            <div key={n}>
                                <label htmlFor={`set-bio-${n}`} className="field-label">Intro paragraph {n}</label>
                                <textarea id={`set-bio-${n}`} rows={3} value={settings[`about_bio_${n}`] || ""} onChange={(e) => setSettings({ ...settings, [`about_bio_${n}`]: e.target.value })} className="field resize-none" />
                            </div>
                        ))}
                    </section>

                    {/* Stats */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="admin-eyebrow">About stats</h2>
                            <button type="button" onClick={() => setList("about_stats", [...(settings.about_stats || []), { value: 0, suffix: "+", label: "" }])} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">+ Add stat</button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {settings.about_stats?.map((st: any, i: number) => (
                                <div key={i} className="space-y-2 rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/70">
                                    <div className="flex gap-2">
                                        <label htmlFor={`stat-v-${i}`} className="sr-only">Value</label>
                                        <input id={`stat-v-${i}`} type="number" value={st.value} onChange={(e) => { const a = [...settings.about_stats]; a[i] = { ...a[i], value: Number(e.target.value) }; setList("about_stats", a); }} className="field-sm font-medium" />
                                        <label htmlFor={`stat-s-${i}`} className="sr-only">Suffix</label>
                                        <input id={`stat-s-${i}`} type="text" value={st.suffix || ""} onChange={(e) => { const a = [...settings.about_stats]; a[i] = { ...a[i], suffix: e.target.value }; setList("about_stats", a); }} placeholder="+" className="field-sm w-14 text-center" />
                                    </div>
                                    <label htmlFor={`stat-l-${i}`} className="sr-only">Label</label>
                                    <input id={`stat-l-${i}`} type="text" value={st.label || ""} onChange={(e) => { const a = [...settings.about_stats]; a[i] = { ...a[i], label: e.target.value }; setList("about_stats", a); }} placeholder="Label" className="field-sm" />
                                    <button type="button" onClick={() => setList("about_stats", settings.about_stats.filter((_: any, idx: number) => idx !== i))} className="text-xs font-semibold text-zinc-400 hover:text-red-500">Remove</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Disciplines */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="admin-eyebrow">What I do</h2>
                            <button type="button" onClick={() => setList("about_disciplines", [...(settings.about_disciplines || []), { title: "", text: "" }])} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">+ Add discipline</button>
                        </div>
                        <div className="space-y-3">
                            {settings.about_disciplines?.map((d: any, i: number) => (
                                <div key={i} className="space-y-2.5 rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/70">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`disc-t-${i}`} className="sr-only">Title</label>
                                        <input id={`disc-t-${i}`} type="text" value={d.title || ""} onChange={(e) => { const a = [...settings.about_disciplines]; a[i] = { ...a[i], title: e.target.value }; setList("about_disciplines", a); }} placeholder="Discipline title" className="field-sm flex-1 font-medium" />
                                        <button type="button" aria-label="Remove discipline" onClick={() => setList("about_disciplines", settings.about_disciplines.filter((_: any, idx: number) => idx !== i))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-red-500">
                                            <Trash2 size={16} aria-hidden />
                                        </button>
                                    </div>
                                    <label htmlFor={`disc-x-${i}`} className="sr-only">Description</label>
                                    <textarea id={`disc-x-${i}`} rows={2} value={d.text || ""} onChange={(e) => { const a = [...settings.about_disciplines]; a[i] = { ...a[i], text: e.target.value }; setList("about_disciplines", a); }} placeholder="Description" className="field-sm resize-none" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Philosophy */}
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Design philosophy</h2>
                        <div>
                            <label htmlFor="set-quote" className="field-label">Pull quote</label>
                            <textarea id="set-quote" rows={2} value={settings.about_philosophy_quote || ""} onChange={(e) => setSettings({ ...settings, about_philosophy_quote: e.target.value })} className="field resize-none font-serif text-lg italic" />
                        </div>
                        {[1, 2, 3].map((n) => (
                            <div key={n}>
                                <label htmlFor={`set-phil-${n}`} className="field-label">Paragraph {n}</label>
                                <textarea id={`set-phil-${n}`} rows={2} value={settings[`about_philosophy_p${n}`] || ""} onChange={(e) => setSettings({ ...settings, [`about_philosophy_p${n}`]: e.target.value })} className="field resize-none" />
                            </div>
                        ))}
                    </section>

                    {/* Journey */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="admin-eyebrow">Journey timeline</h2>
                            <button type="button" onClick={() => setList("about_journey", [...(settings.about_journey || []), { title: "", text: "" }])} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">+ Add phase</button>
                        </div>
                        <div className="space-y-3">
                            {settings.about_journey?.map((j: any, i: number) => (
                                <div key={i} className="space-y-2.5 rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/70">
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden className="w-8 shrink-0 font-serif text-sm italic text-razzmatazz">0{i + 1}</span>
                                        <label htmlFor={`jrn-t-${i}`} className="sr-only">Phase title</label>
                                        <input id={`jrn-t-${i}`} type="text" value={j.title || ""} onChange={(e) => { const a = [...settings.about_journey]; a[i] = { ...a[i], title: e.target.value }; setList("about_journey", a); }} placeholder="Phase title" className="field-sm flex-1 font-medium" />
                                        <button type="button" aria-label="Remove phase" onClick={() => setList("about_journey", settings.about_journey.filter((_: any, idx: number) => idx !== i))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-red-500">
                                            <Trash2 size={16} aria-hidden />
                                        </button>
                                    </div>
                                    <label htmlFor={`jrn-x-${i}`} className="sr-only">Phase description</label>
                                    <textarea id={`jrn-x-${i}`} rows={2} value={j.text || ""} onChange={(e) => { const a = [...settings.about_journey]; a[i] = { ...a[i], text: e.target.value }; setList("about_journey", a); }} placeholder="Phase description" className="field-sm resize-none" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="admin-eyebrow">Testimonials</h2>
                            <button type="button" onClick={() => setList("testimonials", [...(settings.testimonials || []), { quote: "", name: "", role: "" }])} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">+ Add testimonial</button>
                        </div>
                        {(settings.testimonials || []).length === 0 && (
                            <p className="text-sm font-light text-zinc-400 dark:text-zinc-500">
                                None yet — the homepage section stays hidden until you add your first real client quote.
                            </p>
                        )}
                        <div className="space-y-3">
                            {settings.testimonials?.map((t: any, i: number) => (
                                <div key={i} className="space-y-2.5 rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/70">
                                    <div className="flex items-start gap-2">
                                        <label htmlFor={`tst-q-${i}`} className="sr-only">Quote</label>
                                        <textarea id={`tst-q-${i}`} rows={2} value={t.quote || ""} onChange={(e) => { const a = [...settings.testimonials]; a[i] = { ...a[i], quote: e.target.value }; setList("testimonials", a); }} placeholder="What the client said, in their words" className="field-sm flex-1 resize-none font-serif italic" />
                                        <button type="button" aria-label="Remove testimonial" onClick={() => setList("testimonials", settings.testimonials.filter((_: any, idx: number) => idx !== i))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-red-500">
                                            <Trash2 size={16} aria-hidden />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor={`tst-n-${i}`} className="field-label">Name</label>
                                            <input id={`tst-n-${i}`} type="text" value={t.name || ""} onChange={(e) => { const a = [...settings.testimonials]; a[i] = { ...a[i], name: e.target.value }; setList("testimonials", a); }} placeholder="Client name" className="field-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor={`tst-r-${i}`} className="field-label">Role / company</label>
                                            <input id={`tst-r-${i}`} type="text" value={t.role || ""} onChange={(e) => { const a = [...settings.testimonials]; a[i] = { ...a[i], role: e.target.value }; setList("testimonials", a); }} placeholder="e.g. Founder, Unani Medicals" className="field-sm" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Software */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="admin-eyebrow">Software & tools</h2>
                            <button type="button" onClick={() => setList("software_stack", [...(settings.software_stack || []), { name: "", category: "Tool" }])} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">+ Add tool</button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {settings.software_stack?.map((sw: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-200/70 p-3.5 dark:border-zinc-800/70">
                                    <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                                        <SoftwareIcon name={sw.name} size={20} />
                                    </span>
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <label htmlFor={`sw-n-${i}`} className="sr-only">Tool name</label>
                                        <input id={`sw-n-${i}`} type="text" value={sw.name} onChange={(e) => { const s = [...settings.software_stack]; s[i] = { ...s[i], name: e.target.value }; setList("software_stack", s); }} placeholder="Tool name" className="field-sm font-medium" />
                                        <label htmlFor={`sw-c-${i}`} className="sr-only">Category</label>
                                        <input id={`sw-c-${i}`} type="text" value={sw.category} onChange={(e) => { const s = [...settings.software_stack]; s[i] = { ...s[i], category: e.target.value }; setList("software_stack", s); }} placeholder="Category" className="field-sm !text-xs" />
                                    </div>
                                    <button type="button" aria-label="Remove tool" onClick={() => setList("software_stack", settings.software_stack.filter((_: any, idx: number) => idx !== i))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-red-500">
                                        <Trash2 size={16} aria-hidden />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <section className="admin-card">
                        <h2 className="admin-eyebrow mb-5">Portrait</h2>
                        <ImageUpload value={settings.about_image} onChange={(url) => setSettings({ ...settings, about_image: url })} />
                    </section>

                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Contact & socials</h2>
                        <div>
                            <label htmlFor="set-email" className="field-label">Contact email</label>
                            <input id="set-email" type="email" value={settings.contact_email || ""} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} className="field-sm font-mono" />
                        </div>
                        <div className="space-y-3 border-t border-zinc-200/70 pt-5 dark:border-zinc-800/70">
                            {["Instagram", "Facebook", "Twitter", "Github"].map((platform) => {
                                const existing = settings.social_links?.find((s: any) => s.platform?.toLowerCase() === platform.toLowerCase()) || { platform, handle: "", url: "" };
                                const upsert = (patch: any) => {
                                    const links = settings.social_links || [];
                                    const idx = links.findIndex((s: any) => s.platform?.toLowerCase() === platform.toLowerCase());
                                    const updated = { platform, handle: existing.handle || "", url: existing.url || "", ...patch };
                                    setList("social_links", idx >= 0 ? links.map((s: any, i: number) => (i === idx ? updated : s)) : [...links, updated]);
                                };
                                return (
                                    <div key={platform} className="space-y-2 rounded-xl border border-zinc-200/70 p-3.5 dark:border-zinc-800/70">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">{platform}</p>
                                        <label htmlFor={`soc-h-${platform}`} className="sr-only">{platform} handle</label>
                                        <input id={`soc-h-${platform}`} type="text" value={existing.handle || ""} onChange={(e) => upsert({ handle: e.target.value })} placeholder="Handle" className="field-sm" />
                                        <label htmlFor={`soc-u-${platform}`} className="sr-only">{platform} URL</label>
                                        <input id={`soc-u-${platform}`} type="text" value={existing.url || ""} onChange={(e) => upsert({ url: e.target.value })} placeholder="Full URL" className="field-sm font-mono" />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Outside the screen</h2>
                        <div>
                            <label htmlFor="set-beyond-t" className="field-label">Heading</label>
                            <input id="set-beyond-t" type="text" value={settings.about_beyond_title || ""} onChange={(e) => setSettings({ ...settings, about_beyond_title: e.target.value })} className="field-sm" />
                        </div>
                        <div>
                            <label htmlFor="set-beyond-x" className="field-label">Paragraph 1</label>
                            <textarea id="set-beyond-x" rows={3} value={settings.about_beyond_text || ""} onChange={(e) => setSettings({ ...settings, about_beyond_text: e.target.value })} className="field resize-none" />
                        </div>
                        <div>
                            <label htmlFor="set-outside-p2" className="field-label">Paragraph 2</label>
                            <textarea id="set-outside-p2" rows={2} value={settings.about_outside_p2 || ""} onChange={(e) => setSettings({ ...settings, about_outside_p2: e.target.value })} className="field resize-none" />
                        </div>
                        <div>
                            <label htmlFor="set-interests" className="field-label">Interests (comma separated)</label>
                            <input
                                id="set-interests"
                                type="text"
                                value={Array.isArray(settings.about_interests) ? settings.about_interests.join(", ") : (settings.about_interests || "")}
                                onChange={(e) => setSettings({ ...settings, about_interests: e.target.value.split(",").map((s: string) => s.trim()) })}
                                className="field-sm"
                            />
                        </div>
                    </section>
                </div>
            </div>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        role="status"
                        className="fixed bottom-8 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-zinc-950"
                    >
                        <CheckCircle2 aria-hidden className="text-razzmatazz" size={18} />
                        Settings saved.
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
