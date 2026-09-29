"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Clock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import BlockBuilder from "@/components/admin/BlockBuilder";
import { useAutosaveDraft, DraftStatus } from "@/components/admin/useAutosaveDraft";

export default function NewBlogPost() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        slug: "",
        read_time: "5 min read",
        description: "",
        featured_image: "",
        content_blocks: [] as any[],
    });
    const [restored, setRestored] = useState(false);
    const { savedAt, loadDraft, clearDraft } = useAutosaveDraft("draft:new-post", formData);

    useEffect(() => {
        const d: any = loadDraft();
        if (d && (d.title || d.description || (Array.isArray(d.content_blocks) && d.content_blocks.length > 0))) {
            setFormData((prev) => ({ ...prev, ...d }));
            setRestored(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('blog_posts')
                .insert([
                    {
                        ...formData,
                        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                    }
                ]);

            if (error) throw error;
            clearDraft();
            router.push("/admin/blog");
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
                    <Link href="/admin/blog" className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white">
                        <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to articles
                    </Link>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">New entry</h1>
                    {restored && <p className="mt-2 text-[13px] font-light text-zinc-500">Unsent draft restored — pick up where you left off.</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button onClick={handleSubmit} disabled={loading} className="btn-admin">
                        <Save size={17} aria-hidden />
                        {loading ? "Publishing…" : "Publish article"}
                    </button>
                    <DraftStatus savedAt={savedAt} />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <section className="admin-card">
                        <h2 className="admin-eyebrow mb-5">Summary / intro</h2>
                        <label htmlFor="post-summary" className="sr-only">Summary</label>
                        <textarea
                            id="post-summary"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="field resize-none text-lg font-light italic"
                            placeholder="A brief summary that sparks curiosity…"
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
                            ["Article title", "title", "text"],
                            ["Topic / category", "category", "text"],
                            ["Slug (auto if empty)", "slug", "text"],
                        ] as const).map(([label, key]) => (
                            <div key={key}>
                                <label htmlFor={`post-${key}`} className="field-label">{label}</label>
                                <input
                                    id={`post-${key}`}
                                    type="text"
                                    value={(formData as any)[key]}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    className="field-sm"
                                />
                            </div>
                        ))}
                        <div>
                            <label htmlFor="post-readtime" className="field-label">Read time</label>
                            <div className="relative">
                                <Clock aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                                <input
                                    id="post-readtime"
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
