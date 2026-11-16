"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Plus,
    X,
    GitBranch,
    RefreshCw,
    Star,
    Eye,
    EyeOff,
    CheckCircle2,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import BlockBuilder from "@/components/admin/BlockBuilder";
import { useAutosaveDraft, DraftStatus } from "@/components/admin/useAutosaveDraft";
import {
    EXPERIMENT_CATEGORIES,
    EXPERIMENT_STATUSES,
    GRADIENT_PRESETS,
    fetchExperimentById,
    upsertExperiment,
    type ExperimentProject,
    type ExperimentGalleryItem,
} from "@/lib/experiments";
import { GrainyGradientBackdrop, resolveGradientPalette } from "@/components/ExperimentCard";
import { fetchGitHubRepoMetadata } from "@/lib/github";

interface ExperimentFormProps {
    experimentId?: string | null;
}

const DEFAULT_FORM: ExperimentProject = {
    id: "",
    title: "",
    slug: "",
    short_description: "",
    full_story: "",
    cover_image: "",
    gallery: [],
    category: "Product Experiments",
    status: "In Progress",
    technologies: [],
    year: new Date().getFullYear().toString(),
    color: "#F7095E",
    featured: false,
    published: true,
    live_url: "",
    github_url: "",
    github_metadata: null,
    content_blocks: [
        {
            type: "section",
            section_key: "the_idea",
            title: "The Idea",
            content: "",
        },
        {
            type: "section",
            section_key: "the_experiment",
            title: "The Experiment",
            content: "",
        },
    ],
    created_at: "",
    updated_at: "",
};

export default function ExperimentForm({ experimentId }: ExperimentFormProps) {
    const router = useRouter();
    const isEdit = Boolean(experimentId);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [syncingGithub, setSyncingGithub] = useState(false);
    const [techInput, setTechInput] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [formData, setFormData] = useState<ExperimentProject>(DEFAULT_FORM);

    const draftKey = isEdit ? `draft:edit-experiment:${experimentId}` : "draft:new-experiment";
    const { savedAt, loadDraft, clearDraft } = useAutosaveDraft(draftKey, formData);

    useEffect(() => {
        if (!isEdit) {
            const d: any = loadDraft();
            if (d && (d.title || d.short_description)) {
                setFormData((prev) => ({ ...prev, ...d }));
            }
            return;
        }

        async function loadExisting() {
            try {
                setLoading(true);
                const found = await fetchExperimentById(experimentId!);
                if (!found) {
                    setErrorMsg("Experiment not found.");
                } else {
                    setFormData({
                        ...DEFAULT_FORM,
                        ...found,
                        gallery: Array.isArray(found.gallery) ? found.gallery : [],
                        technologies: Array.isArray(found.technologies) ? found.technologies : [],
                        content_blocks: Array.isArray(found.content_blocks) ? found.content_blocks : [],
                    });
                }
            } catch (err: any) {
                setErrorMsg(err?.message || "Failed to load experiment.");
            } finally {
                setLoading(false);
            }
        }
        loadExisting();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [experimentId, isEdit]);

    const addTechnology = () => {
        const cleaned = techInput.trim();
        if (cleaned && !formData.technologies.includes(cleaned)) {
            setFormData({ ...formData, technologies: [...formData.technologies, cleaned] });
            setTechInput("");
        }
    };

    const syncFromGitHub = async () => {
        if (!formData.github_url?.trim()) {
            setErrorMsg("Enter a GitHub repository URL first.");
            return;
        }
        setErrorMsg(null);
        setSyncingGithub(true);
        try {
            const meta = await fetchGitHubRepoMetadata(formData.github_url);
            if (!meta) {
                setErrorMsg("Could not parse or fetch public GitHub repository.");
            } else {
                const nextTech = [...formData.technologies];
                if (meta.language && !nextTech.includes(meta.language)) {
                    nextTech.push(meta.language);
                }
                (meta.topics || []).forEach((t) => {
                    if (t && !nextTech.includes(t)) nextTech.push(t);
                });

                setFormData((prev) => ({
                    ...prev,
                    title: prev.title || meta.name,
                    short_description: prev.short_description || meta.description || "",
                    live_url: prev.live_url || meta.homepage || "",
                    technologies: nextTech,
                    github_metadata: meta,
                }));
                setToastMsg(`Synced metadata from ${meta.full_name}`);
                setTimeout(() => setToastMsg(null), 3000);
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Failed to fetch GitHub repository metadata.");
        } finally {
            setSyncingGithub(false);
        }
    };

    const addGalleryItem = () => {
        const nextGallery: ExperimentGalleryItem[] = [
            ...(formData.gallery || []),
            { url: "", caption: "", layout: "split" },
        ];
        setFormData({ ...formData, gallery: nextGallery });
    };

    const updateGalleryItem = (idx: number, patch: Partial<ExperimentGalleryItem>) => {
        const nextGallery = [...(formData.gallery || [])];
        nextGallery[idx] = { ...nextGallery[idx], ...patch };
        setFormData({ ...formData, gallery: nextGallery });
    };

    const removeGalleryItem = (idx: number) => {
        const nextGallery = (formData.gallery || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, gallery: nextGallery });
    };

    const handleSave = async (publishOverride?: boolean) => {
        setErrorMsg(null);
        if (!formData.title.trim()) {
            setErrorMsg("Project title is required.");
            return;
        }
        if (!formData.short_description.trim()) {
            setErrorMsg("Short description is required.");
            return;
        }

        setSaving(true);
        try {
            const payload: ExperimentProject = {
                ...formData,
                published: typeof publishOverride === "boolean" ? publishOverride : formData.published,
                slug:
                    formData.slug.trim() ||
                    formData.title
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]+/g, ""),
            };

            await upsertExperiment(payload);
            clearDraft();
            router.push("/admin/experiments");
        } catch (err: any) {
            setErrorMsg(err?.message || "Failed to save experiment.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="eyebrow animate-pulse py-24 text-center">Loading experiment editor</p>;
    }

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <Link
                        href="/admin/experiments"
                        className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white"
                    >
                        <ArrowLeft
                            size={16}
                            aria-hidden
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        Back to experiments
                    </Link>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio · Experiments
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">
                        {isEdit ? "Edit experiment" : "New experiment"}
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 text-[14px] font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-950 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-white dark:hover:text-white"
                        >
                            <EyeOff size={16} aria-hidden />
                            Save draft
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="btn-admin"
                        >
                            <Save size={17} aria-hidden />
                            {saving ? "Saving…" : formData.published ? "Save & publish" : "Publish experiment"}
                        </button>
                    </div>
                    <DraftStatus savedAt={savedAt} />
                </div>
            </header>

            {errorMsg && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-300/70 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                >
                    {errorMsg}
                </div>
            )}

            {toastMsg && (
                <div
                    role="status"
                    className="flex items-center gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-50 px-6 py-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                >
                    <CheckCircle2 size={16} aria-hidden />
                    {toastMsg}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Main Story Column */}
                <div className="space-y-6 lg:col-span-8">
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Editorial Summary</h2>
                        <div>
                            <label htmlFor="exp-short-desc" className="field-label">
                                Short description (shown on cards &amp; header)
                            </label>
                            <textarea
                                id="exp-short-desc"
                                rows={2}
                                value={formData.short_description}
                                onChange={(e) =>
                                    setFormData({ ...formData, short_description: e.target.value })
                                }
                                className="field resize-none text-base font-light"
                                placeholder="One or two crisp sentences explaining what this experiment explores…"
                            />
                        </div>
                        <div>
                            <label htmlFor="exp-full-story" className="field-label">
                                Lead overview / context (optional)
                            </label>
                            <textarea
                                id="exp-full-story"
                                rows={3}
                                value={formData.full_story || ""}
                                onChange={(e) => setFormData({ ...formData, full_story: e.target.value })}
                                className="field resize-y text-sm font-light"
                                placeholder="Optional opening paragraph before the build log chapters begin…"
                            />
                        </div>
                    </section>

                    <BlockBuilder
                        blocks={formData.content_blocks}
                        onChange={(content_blocks) => setFormData({ ...formData, content_blocks })}
                        enableExperimentPresets
                    />

                    {/* Gallery Manager */}
                    <section className="admin-card space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="admin-eyebrow">Project Gallery</h2>
                                <p className="mt-1 text-xs font-light text-zinc-400 dark:text-zinc-500">
                                    Real screenshots, mobile/desktop captures, and visual artifacts with captions.
                                </p>
                            </div>
                            <button type="button" onClick={addGalleryItem} className="chip-btn">
                                <Plus size={14} aria-hidden /> Add screenshot
                            </button>
                        </div>

                        {(formData.gallery || []).length === 0 ? (
                            <p className="rounded-xl border border-dashed border-zinc-200 py-8 text-center text-xs font-light text-zinc-400 dark:border-zinc-800">
                                No gallery screenshots added yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {(formData.gallery || []).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="relative space-y-3 rounded-xl border border-zinc-200/80 p-4 dark:border-zinc-800/80"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                                Screen #{idx + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryItem(idx)}
                                                aria-label="Remove gallery item"
                                                className="text-zinc-400 hover:text-red-500"
                                            >
                                                <X size={15} aria-hidden />
                                            </button>
                                        </div>
                                        <ImageUpload
                                            value={item.url}
                                            onChange={(url) => updateGalleryItem(idx, { url })}
                                        />
                                        <input
                                            type="text"
                                            value={item.caption || ""}
                                            onChange={(e) => updateGalleryItem(idx, { caption: e.target.value })}
                                            className="field-sm"
                                            placeholder="Caption (optional)"
                                        />
                                        <select
                                            value={item.layout || "split"}
                                            onChange={(e) =>
                                                updateGalleryItem(idx, {
                                                    layout: e.target.value as ExperimentGalleryItem["layout"],
                                                })
                                            }
                                            className="field-sm"
                                        >
                                            <option value="split">Side-by-side (half width)</option>
                                            <option value="full">Full width</option>
                                            <option value="desktop">Desktop frame</option>
                                            <option value="mobile">Mobile portrait frame</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Metadata Column */}
                <div className="space-y-6 lg:col-span-4">
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Identity &amp; Status</h2>

                        <div>
                            <label htmlFor="exp-title" className="field-label">
                                Title
                            </label>
                            <input
                                id="exp-title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="field-sm"
                                placeholder="e.g. Pebble"
                            />
                        </div>

                        <div>
                            <label htmlFor="exp-slug" className="field-label">
                                Slug (auto if empty)
                            </label>
                            <input
                                id="exp-slug"
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="field-sm font-mono"
                                placeholder="pebble"
                            />
                        </div>

                        <div>
                            <label htmlFor="exp-category" className="field-label">
                                Category
                            </label>
                            <select
                                id="exp-category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="field-sm"
                            >
                                {EXPERIMENT_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="exp-status" className="field-label">
                                    Status
                                </label>
                                <select
                                    id="exp-status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="field-sm"
                                >
                                    {EXPERIMENT_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="exp-year" className="field-label">
                                    Year
                                </label>
                                <input
                                    id="exp-year"
                                    type="text"
                                    value={formData.year || ""}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="field-sm"
                                    placeholder="2026"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="exp-color" className="field-label">
                                Accent color
                            </label>
                            <input
                                id="exp-color"
                                type="color"
                                value={formData.color || "#F7095E"}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="h-[42px] w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-1 py-1 dark:border-zinc-800 dark:bg-zinc-900"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                                    formData.featured
                                        ? "border-razzmatazz bg-razzmatazz/10 text-razzmatazz"
                                        : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                                }`}
                            >
                                <Star size={14} aria-hidden />
                                {formData.featured ? "Featured" : "Standard"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, published: !formData.published })}
                                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                                    formData.published
                                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                                }`}
                            >
                                {formData.published ? <Eye size={14} aria-hidden /> : <EyeOff size={14} aria-hidden />}
                                {formData.published ? "Published" : "Draft"}
                            </button>
                        </div>
                    </section>

                    {/* Links & GitHub Integration */}
                    <section className="admin-card space-y-5">
                        <h2 className="admin-eyebrow">Links &amp; GitHub Sync</h2>

                        <div>
                            <label htmlFor="exp-live-url" className="field-label">
                                Live demo URL (optional)
                            </label>
                            <input
                                id="exp-live-url"
                                type="url"
                                value={formData.live_url || ""}
                                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                className="field-sm font-mono"
                                placeholder="https://pebble.nooryoosuf.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="exp-github-url" className="field-label">
                                Public GitHub Repository URL (optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="exp-github-url"
                                    type="url"
                                    value={formData.github_url || ""}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                    className="field-sm flex-1 font-mono"
                                    placeholder="https://github.com/nooryoosuf/pebble"
                                />
                                <button
                                    type="button"
                                    onClick={syncFromGitHub}
                                    disabled={syncingGithub}
                                    title="Fetch repository metadata from GitHub"
                                    aria-label="Fetch repository metadata from GitHub"
                                    className="icon-btn"
                                >
                                    <RefreshCw
                                        size={15}
                                        aria-hidden
                                        className={syncingGithub ? "animate-spin" : ""}
                                    />
                                </button>
                            </div>
                        </div>

                        {formData.github_metadata?.full_name && (
                            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center justify-between font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                                    <span className="inline-flex items-center gap-1.5">
                                        <GitBranch size={13} className="text-razzmatazz" />
                                        {formData.github_metadata.full_name}
                                    </span>
                                    {formData.github_metadata.language && (
                                        <span className="text-zinc-500">{formData.github_metadata.language}</span>
                                    )}
                                </div>
                                {formData.github_metadata.description && (
                                    <p className="mt-1.5 font-light text-zinc-500 dark:text-zinc-400">
                                        {formData.github_metadata.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Technology Tags */}
                    <section className="admin-card space-y-4">
                        <h2 className="admin-eyebrow">Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        aria-label={`Remove ${tech}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                technologies: formData.technologies.filter((t) => t !== tech),
                                            })
                                        }
                                        className="text-zinc-400 hover:text-red-500"
                                    >
                                        <X size={12} aria-hidden />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTechnology();
                                    }
                                }}
                                placeholder="Add technology (e.g. Next.js)…"
                                className="field-sm flex-1"
                            />
                            <button
                                type="button"
                                onClick={addTechnology}
                                aria-label="Add technology"
                                className="icon-btn"
                            >
                                <Plus size={16} aria-hidden />
                            </button>
                        </div>
                    </section>

                    {/* Cover Image, Grainy Gradient, or ASCII Animation */}
                    <section className="admin-card space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="admin-eyebrow">Card Backdrop</h2>
                            <div
                                className="inline-flex rounded-full border border-zinc-200 p-0.5 dark:border-zinc-800"
                                role="group"
                                aria-label="Card backdrop mode"
                            >
                                {(["ascii", "gradient", "image"] as const).map((mode) => {
                                    const currentMode =
                                        formData.cover_mode || (formData.cover_image ? "image" : "ascii");
                                    const label =
                                        mode === "ascii"
                                            ? "ASCII"
                                            : mode === "gradient"
                                            ? "Gradient"
                                            : "Picture";
                                    return (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, cover_mode: mode })}
                                            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                                                currentMode === mode
                                                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                                    : "text-zinc-500 dark:text-zinc-400"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {(formData.cover_mode || (formData.cover_image ? "image" : "ascii")) !== "image" ? (
                            <div className="space-y-4">
                                {(() => {
                                    const previewPalette = resolveGradientPalette(formData, 0);
                                    const isAscii =
                                        (formData.cover_mode || (formData.cover_image ? "image" : "ascii")) ===
                                        "ascii";
                                    return (
                                        <div className="img-frame relative flex min-h-[160px] flex-col justify-between p-5">
                                            <GrainyGradientBackdrop
                                                primary={previewPalette.primary}
                                                secondary={previewPalette.secondary}
                                                tertiary={previewPalette.tertiary}
                                                seed={7}
                                                showAscii={isAscii}
                                                asciiPattern={formData.ascii_pattern}
                                            />
                                            <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700 dark:text-zinc-300">
                                                {isAscii ? "Live ASCII + Gradient Preview" : "Grainy Gradient Preview"}
                                            </span>
                                            <span className="relative z-10 font-heading text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                                {formData.title || "Experiment"}
                                                <span style={{ color: previewPalette.primary }}>.</span>
                                            </span>
                                        </div>
                                    );
                                })()}

                                {(formData.cover_mode || "ascii") === "ascii" && (
                                    <div>
                                        <span className="field-label">ASCII motion pattern</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(["wave", "vortex", "topography", "matrix", "pulse"] as const).map(
                                                (pat) => (
                                                    <button
                                                        key={pat}
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                cover_mode: "ascii",
                                                                ascii_pattern: pat,
                                                            })
                                                        }
                                                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold capitalize transition-colors ${
                                                            (formData.ascii_pattern || "wave") === pat
                                                                ? "border-razzmatazz bg-razzmatazz/10 text-razzmatazz"
                                                                : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
                                                        }`}
                                                    >
                                                        {pat}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="field-label">Color palette preset</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {GRADIENT_PRESETS.map((preset) => {
                                            const selected = formData.gradient_preset === preset.id;
                                            return (
                                                <button
                                                    key={preset.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData({
                                                            ...formData,
                                                            gradient_preset: preset.id,
                                                            color: preset.primary,
                                                        })
                                                    }
                                                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                                                        selected
                                                            ? "border-zinc-950 bg-zinc-50 text-zinc-950 dark:border-white dark:bg-zinc-900 dark:text-white"
                                                            : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
                                                    }`}
                                                >
                                                    <span
                                                        aria-hidden
                                                        className="h-4 w-4 shrink-0 rounded-full"
                                                        style={{
                                                            backgroundImage: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                                                        }}
                                                    />
                                                    <span className="truncate">{preset.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <ImageUpload
                                    value={formData.cover_image || ""}
                                    onChange={(url) =>
                                        setFormData({
                                            ...formData,
                                            cover_image: url,
                                            cover_mode: url ? "image" : "ascii",
                                        })
                                    }
                                />
                                <p className="text-xs font-light text-zinc-400 dark:text-zinc-500">
                                    If no picture is uploaded, the card automatically falls back to its live ASCII gradient.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
