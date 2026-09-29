"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import BlockBuilder from "@/components/admin/BlockBuilder";
import { useAutosaveDraft, DraftStatus } from "@/components/admin/useAutosaveDraft";

export default function NewProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        slug: "",
        year: new Date().getFullYear().toString(),
        client: "",
        role: "Lead Designer",
        color: "#F7095E",
        description: "", // This will be the "Brief"
        services: [] as string[],
        featured_image: "",
        content_blocks: [] as any[],
    });

    const [serviceInput, setServiceInput] = useState("");
    const [restored, setRestored] = useState(false);
    const { savedAt, loadDraft, clearDraft } = useAutosaveDraft("draft:new-project", formData);

    useEffect(() => {
        const d: any = loadDraft();
        if (d && (d.title || d.description || (Array.isArray(d.content_blocks) && d.content_blocks.length > 0))) {
            setFormData((prev) => ({ ...prev, ...d }));
            setRestored(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addService = () => {
        if (serviceInput && !formData.services.includes(serviceInput)) {
            setFormData({ ...formData, services: [...formData.services, serviceInput] });
            setServiceInput("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const insertPayload = {
                title: formData.title,
                category: formData.category,
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                year: formData.year,
                client: formData.client,
                color: formData.color,
                description: formData.description,
                services: formData.services || [],
                featured_image: formData.featured_image || '',
                content_blocks: [
                    { type: 'meta', role: formData.role || 'Lead Designer' },
                    ...(formData.content_blocks || []).filter((b: any) => b.type !== 'meta')
                ]
            };

            const { error } = await supabase
                .from('projects')
                .insert([insertPayload]);

            if (error) throw error;
            clearDraft();
            router.push("/admin/projects");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <Link href="/admin/projects" className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white">
                        <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to archive
                    </Link>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">New project</h1>
                    {restored && <p className="mt-2 text-[13px] font-light text-zinc-500">Unsent draft restored — pick up where you left off.</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button onClick={handleSubmit} disabled={loading} className="btn-admin">
                        <Save size={17} aria-hidden />
                        {loading ? "Publishing…" : "Publish project"}
                    </button>
                    <DraftStatus savedAt={savedAt} />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <section className="admin-card">
                        <h2 className="admin-eyebrow mb-5">Project brief</h2>
                        <label htmlFor="proj-brief" className="sr-only">Project brief</label>
                        <textarea
                            id="proj-brief"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="field resize-none text-lg font-light"
                            placeholder="Describe the challenge and solution…"
                        />
                    </section>

                    <BlockBuilder
                        blocks={formData.content_blocks}
                        onChange={(content_blocks) => setFormData({ ...formData, content_blocks })}
                    />
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Identity</h2>
                        {([
                            ["Title", "title", "text"],
                            ["Category", "category", "text"],
                            ["Slug (auto if empty)", "slug", "text"],
                            ["Client", "client", "text"],
                            ["Role", "role", "text"],
                        ] as const).map(([label, key]) => (
                            <div key={key}>
                                <label htmlFor={`proj-${key}`} className="field-label">{label}</label>
                                <input
                                    id={`proj-${key}`}
                                    type="text"
                                    value={(formData as any)[key]}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    className="field-sm"
                                />
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="proj-year" className="field-label">Year</label>
                                <input id="proj-year" type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="field-sm" />
                            </div>
                            <div>
                                <label htmlFor="proj-color" className="field-label">Accent</label>
                                <input id="proj-color" type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-[46px] w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-1 py-1 dark:border-zinc-800 dark:bg-zinc-900" />
                            </div>
                        </div>
                        <div>
                            <span className="field-label">Services</span>
                            <div className="flex flex-wrap gap-2">
                                {formData.services.map((s) => (
                                    <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-[13px] font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                                        {s}
                                        <button type="button" aria-label={`Remove ${s}`} onClick={() => setFormData({ ...formData, services: formData.services.filter((x) => x !== s) })} className="text-zinc-400 hover:text-red-500">
                                            <X size={13} aria-hidden />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="mt-2.5 flex gap-2">
                                <label htmlFor="proj-service" className="sr-only">Add service</label>
                                <input
                                    id="proj-service"
                                    type="text"
                                    value={serviceInput}
                                    onChange={(e) => setServiceInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
                                    placeholder="Add a service…"
                                    className="field-sm flex-1"
                                />
                                <button type="button" onClick={addService} aria-label="Add service" className="icon-btn">
                                    <Plus size={16} aria-hidden />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="admin-card">
                        <h2 className="admin-eyebrow mb-5">Cover visual</h2>
                        <ImageUpload
                            value={formData.featured_image}
                            onChange={(url) => setFormData({ ...formData, featured_image: url })}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
