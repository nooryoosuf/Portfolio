"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";
import BlockBuilder from "@/components/admin/BlockBuilder";
import { useAutosaveDraft, DraftStatus } from "@/components/admin/useAutosaveDraft";

function EditProjectContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [serviceInput, setServiceInput] = useState("");
    const [showDraftBanner, setShowDraftBanner] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        slug: "",
        year: "",
        client: "",
        role: "",
        color: "#F7095E",
        description: "",
        services: [] as string[],
        featured_image: "",
        content_blocks: [] as any[],
    });
    const draftKey = id ? `draft:edit-project:${id}` : null;
    const { savedAt, draftTime, loadDraft, clearDraft } = useAutosaveDraft(draftKey, formData);

    useEffect(() => {
        if (!id) return;
        async function fetchProject() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) {
                    const metaBlock = data.content_blocks?.find((b: any) => b.type === 'meta');
                    const roleVal = metaBlock?.role || data.role || "";
                    const cleanBlocks = (data.content_blocks || []).filter((b: any) => b.type !== 'meta');
                    const fresh = {
                        ...data,
                        role: roleVal,
                        content_blocks: cleanBlocks
                    };
                    setFormData(fresh);
                    try {
                        const raw = id ? window.localStorage.getItem(`draft:edit-project:${id}`) : null;
                        if (raw) {
                            const dd = JSON.parse(raw).data;
                            if (dd && JSON.stringify(dd) !== JSON.stringify(fresh)) {
                                setShowDraftBanner(true);
                            }
                        }
                    } catch {
                        /* ignore */
                    }
                }
            } catch (err: any) {
                alert("Error fetching project: " + err.message);
                router.push("/admin/projects");
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [id, router]);

    const addService = () => {
        if (serviceInput && !formData.services.includes(serviceInput)) {
            setFormData({ ...formData, services: [...formData.services, serviceInput] });
            setServiceInput("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const updatePayload = {
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
                .update(updatePayload)
                .eq('id', id);

            if (error) throw error;
            clearDraft();
            router.push("/admin/projects");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="eyebrow animate-pulse py-24 text-center">Loading project</p>;

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
                    <h1 className="display mt-3 text-4xl md:text-5xl">Edit project</h1>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button onClick={handleSubmit} disabled={saving} className="btn-admin">
                        <Save size={17} aria-hidden />
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                    <DraftStatus savedAt={savedAt} />
                </div>
            </header>

            {showDraftBanner && (
                <div role="status" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-6 py-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                    <p className="text-sm font-light text-amber-800 dark:text-amber-200">
                        Unsaved changes{draftTime ? ` from ${draftTime}` : ""} found on this device.
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                const d: any = loadDraft();
                                if (d) setFormData((prev) => ({ ...prev, ...d }));
                                setShowDraftBanner(false);
                            }}
                            className="min-h-[40px] rounded-full bg-zinc-950 px-5 text-[13px] font-medium text-white dark:bg-white dark:text-zinc-950"
                        >
                            Restore draft
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                clearDraft();
                                setShowDraftBanner(false);
                            }}
                            className="min-h-[40px] rounded-full border border-zinc-300 px-5 text-[13px] font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <section className="admin-card">
                        <h2 className="admin-eyebrow mb-5">Project brief</h2>
                        <label htmlFor="edit-brief" className="sr-only">Project brief</label>
                        <textarea
                            id="edit-brief"
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
                            ["Title", "title"],
                            ["Category", "category"],
                            ["Slug", "slug"],
                            ["Client", "client"],
                            ["Role", "role"],
                        ] as const).map(([label, key]) => (
                            <div key={key}>
                                <label htmlFor={`edit-${key}`} className="field-label">{label}</label>
                                <input
                                    id={`edit-${key}`}
                                    type="text"
                                    value={(formData as any)[key] || ""}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    className="field-sm"
                                />
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="edit-year" className="field-label">Year</label>
                                <input id="edit-year" type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="field-sm" />
                            </div>
                            <div>
                                <label htmlFor="edit-color" className="field-label">Accent</label>
                                <input id="edit-color" type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-[46px] w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-1 py-1 dark:border-zinc-800 dark:bg-zinc-900" />
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
                                <label htmlFor="edit-service" className="sr-only">Add service</label>
                                <input
                                    id="edit-service"
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
                        <ImageUpload value={formData.featured_image} onChange={(url) => setFormData({ ...formData, featured_image: url })} />
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function EditProjectClient() {
    return (
        <Suspense fallback={<p className="eyebrow animate-pulse py-24 text-center">Loading editor</p>}>
            <EditProjectContent />
        </Suspense>
    );
}
