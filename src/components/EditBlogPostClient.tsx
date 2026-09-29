"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Clock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";
import BlockBuilder from "@/components/admin/BlockBuilder";
import { useAutosaveDraft, DraftStatus } from "@/components/admin/useAutosaveDraft";

function EditBlogPostContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDraftBanner, setShowDraftBanner] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        slug: "",
        read_time: "5 min read",
        description: "",
        featured_image: "",
        content_blocks: [] as any[],
    });
    const draftKey = id ? `draft:edit-post:${id}` : null;
    const { savedAt, draftTime, loadDraft, clearDraft } = useAutosaveDraft(draftKey, formData);

    useEffect(() => {
        if (!id) return;
        async function fetchPost() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) {
                    setFormData(data);
                    try {
                        const raw = id ? window.localStorage.getItem(`draft:edit-post:${id}`) : null;
                        if (raw) {
                            const dd = JSON.parse(raw).data;
                            if (dd && JSON.stringify(dd) !== JSON.stringify(data)) {
                                setShowDraftBanner(true);
                            }
                        }
                    } catch {
                        /* ignore */
                    }
                }
            } catch (err: any) {
                alert("Error fetching post: " + err.message);
                router.push("/admin/blog");
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('blog_posts')
                .update({
                    ...formData,
                    slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                })
                .eq('id', id);

            if (error) throw error;
            clearDraft();
            router.push("/admin/blog");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="eyebrow animate-pulse py-24 text-center">Loading entry</p>;

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <Link href="/admin/blog" className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white">
                        <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to articles
                    </Link>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">Edit entry</h1>
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
                        <h2 className="admin-eyebrow mb-5">Summary / intro</h2>
                        <label htmlFor="edit-summary" className="sr-only">Summary</label>
                        <textarea
                            id="edit-summary"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="field resize-none text-lg font-light italic"
                        />
                    </section>

                    <BlockBuilder
                        blocks={formData.content_blocks}
                        onChange={(content_blocks) => setFormData({ ...formData, content_blocks })}
                        addLabels={{ section: "Section", image_grid: "Visual", quote: "Quote", list: "List" }}
                    />
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Metadata</h2>
                        {([
                            ["Article title", "title"],
                            ["Topic / category", "category"],
                            ["Slug", "slug"],
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
                        <div>
                            <label htmlFor="edit-readtime" className="field-label">Read time</label>
                            <div className="relative">
                                <Clock aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                                <input
                                    id="edit-readtime"
                                    type="text"
                                    value={formData.read_time}
                                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                    className="field-sm pl-10"
                                />
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

export default function EditBlogPostClient() {
    return (
        <Suspense fallback={<p className="eyebrow animate-pulse py-24 text-center">Loading editor</p>}>
            <EditBlogPostContent />
        </Suspense>
    );
}
