"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    CheckCircle2,
    ExternalLink,
    ArrowUp,
    ArrowDown,
    Star,
    Eye,
    EyeOff,
    FlaskConical,
    Save,
    X,
} from "lucide-react";
import { StatusPill } from "@/components/ExperimentCard";
import {
    EXPERIMENT_CATEGORIES,
    EXPERIMENT_STATUSES,
    fetchExperiments,
    saveExperimentsList,
    deleteExperimentById,
    fetchTinkeringItems,
    saveTinkeringItems,
    type ExperimentProject,
    type TinkeringItem,
} from "@/lib/experiments";

export default function AdminExperimentsPage() {
    const router = useRouter();
    const [experiments, setExperiments] = useState<ExperimentProject[]>([]);
    const [tinkering, setTinkering] = useState<TinkeringItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingTinkering, setSavingTinkering] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState<"all" | "published" | "drafts" | "featured">("all");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [expList, tinkList] = await Promise.all([
                    fetchExperiments({ includeDrafts: true }),
                    fetchTinkeringItems(),
                ]);
                setExperiments(expList);
                setTinkering(tinkList);
            } catch (err) {
                console.error("Error loading admin experiments:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const persistList = async (next: ExperimentProject[], msg: string) => {
        setExperiments(next);
        try {
            setSaving(true);
            await saveExperimentsList(next);
            showToast(msg);
        } catch (err: any) {
            alert("Failed to save: " + (err?.message || "Unknown error"));
        } finally {
            setSaving(false);
        }
    };

    const moveExperiment = async (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === experiments.length - 1)
        ) {
            return;
        }
        const target = direction === "up" ? index - 1 : index + 1;
        const next = [...experiments];
        [next[index], next[target]] = [next[target], next[index]];
        await persistList(next, "Experiment sequence saved.");
    };

    const toggleFeatured = async (id: string) => {
        const next = experiments.map((item) =>
            item.id === id ? { ...item, featured: !item.featured } : item
        );
        await persistList(next, "Featured state updated.");
    };

    const togglePublished = async (id: string) => {
        const next = experiments.map((item) =>
            item.id === id ? { ...item, published: !item.published } : item
        );
        await persistList(next, "Visibility updated.");
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}" permanently?`)) return;
        try {
            setSaving(true);
            const next = await deleteExperimentById(id);
            setExperiments(next);
            showToast("Experiment deleted.");
        } catch (err: any) {
            alert("Failed to delete: " + (err?.message || "Unknown error"));
        } finally {
            setSaving(false);
        }
    };

    // Tinkering helpers
    const addTinkering = () => {
        const item: TinkeringItem = {
            id: `tink-${Date.now()}`,
            title: "",
            note: "",
            category: "Product Experiments",
            status: "In Progress",
            technologies: [],
            github_url: "",
            live_url: "",
        };
        setTinkering([item, ...tinkering]);
    };

    const updateTinkering = (idx: number, patch: Partial<TinkeringItem>) => {
        const next = [...tinkering];
        next[idx] = { ...next[idx], ...patch };
        setTinkering(next);
    };

    const removeTinkering = (idx: number) => {
        setTinkering(tinkering.filter((_, i) => i !== idx));
    };

    const handleSaveTinkering = async () => {
        try {
            setSavingTinkering(true);
            const cleaned = tinkering.filter((t) => t.title.trim());
            setTinkering(cleaned);
            await saveTinkeringItems(cleaned);
            showToast("Currently tinkering list saved.");
        } catch (err: any) {
            alert("Failed to save tinkering list: " + (err?.message || "Unknown error"));
        } finally {
            setSavingTinkering(false);
        }
    };

    const filteredExperiments = experiments.filter((item) => {
        if (filterMode === "published" && !item.published) return false;
        if (filterMode === "drafts" && item.published) return false;
        if (filterMode === "featured" && !item.featured) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(q) ||
            (item.category || "").toLowerCase().includes(q) ||
            (item.short_description || "").toLowerCase().includes(q) ||
            (item.technologies || []).some((t) => t.toLowerCase().includes(q))
        );
    });

    return (
        <div className="space-y-12 pb-16">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Studio
                    </p>
                    <h1 className="display mt-3 text-4xl md:text-5xl">Experiments &amp; builds</h1>
                    <p className="lede mt-3 !text-base">
                        {experiments.length} {experiments.length === 1 ? "experiment" : "experiments"} ·{" "}
                        {experiments.filter((x) => x.featured).length} featured ·{" "}
                        {experiments.filter((x) => !x.published).length} drafts
                    </p>
                </div>

                <Link
                    href="/admin/experiments/new"
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-zinc-950 px-7 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                    <Plus size={18} aria-hidden />
                    New experiment
                </Link>
            </header>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <Search
                        aria-hidden
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                        size={18}
                    />
                    <label htmlFor="experiment-search" className="sr-only">
                        Search experiments
                    </label>
                    <input
                        id="experiment-search"
                        type="text"
                        placeholder="Search by title, category, or stack…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="min-h-[50px] w-full rounded-full border border-zinc-200 bg-white py-3 pl-12 pr-6 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-100"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {(
                        [
                            ["all", "All"],
                            ["published", "Published"],
                            ["drafts", "Drafts"],
                            ["featured", "Featured"],
                        ] as const
                    ).map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFilterMode(key)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                                filterMode === key
                                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                    : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                    {saving && (
                        <span className="inline-flex items-center gap-1.5 px-3 text-xs text-zinc-400">
                            <Loader2 size={14} className="animate-spin" /> Saving
                        </span>
                    )}
                </div>
            </div>

            {/* Experiments Grid */}
            {loading ? (
                <p className="eyebrow animate-pulse py-24 text-center">Loading experiments</p>
            ) : filteredExperiments.length === 0 ? (
                <div className="border-y border-zinc-200/80 py-20 text-center dark:border-zinc-800/80">
                    <FlaskConical size={36} aria-hidden className="mx-auto text-zinc-200 dark:text-zinc-800" />
                    <p className="mt-4 font-serif text-2xl italic text-zinc-400">No experiments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredExperiments.map((exp, index) => (
                        <motion.article
                            key={exp.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`card-rest flex flex-col p-6 transition-shadow duration-300 hover:shadow-lg ${
                                exp.featured ? "!border-razzmatazz/50" : ""
                            }`}
                        >
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleFeatured(exp.id)}
                                        title={exp.featured ? "Unfeature" : "Mark as featured"}
                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                            exp.featured
                                                ? "bg-razzmatazz text-white"
                                                : "bg-zinc-100 text-zinc-500 hover:text-zinc-950 dark:bg-zinc-800 dark:text-zinc-400"
                                        }`}
                                    >
                                        <Star size={11} aria-hidden />
                                        {exp.featured ? "Featured" : "Standard"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => togglePublished(exp.id)}
                                        title={exp.published ? "Unpublish to draft" : "Publish"}
                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                            exp.published
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {exp.published ? <Eye size={11} /> : <EyeOff size={11} />}
                                        {exp.published ? "Published" : "Draft"}
                                    </button>
                                </div>

                                {!searchQuery && filterMode === "all" && (
                                    <div className="flex items-center gap-0.5 rounded-full border border-zinc-200 p-0.5 dark:border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => moveExperiment(index, "up")}
                                            disabled={index === 0}
                                            aria-label={`Move ${exp.title} up`}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-white"
                                        >
                                            <ArrowUp size={13} aria-hidden />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveExperiment(index, "down")}
                                            disabled={index === experiments.length - 1}
                                            aria-label={`Move ${exp.title} down`}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-white"
                                        >
                                            <ArrowDown size={13} aria-hidden />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4 flex items-start justify-between gap-3">
                                <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900">
                                    {exp.cover_image ? (
                                        <Image src={exp.cover_image} alt="" fill sizes="56px" className="object-cover" />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center font-heading text-lg font-semibold text-zinc-400">
                                            {exp.title.charAt(0)}
                                        </span>
                                    )}
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/admin/experiments/edit?id=${exp.id}`)}
                                        aria-label={`Edit ${exp.title}`}
                                        className="icon-btn"
                                    >
                                        <Edit size={16} aria-hidden />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(exp.id, exp.title)}
                                        aria-label={`Delete ${exp.title}`}
                                        className="icon-btn-danger"
                                    >
                                        <Trash2 size={16} aria-hidden />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz">
                                        {exp.category}
                                    </p>
                                    <StatusPill status={exp.status} />
                                </div>
                                <h2 className="mt-1.5 font-heading text-xl font-medium tracking-tight text-zinc-950 dark:text-white">
                                    {exp.title}
                                </h2>
                                <p className="mt-1.5 line-clamp-2 text-sm font-light text-zinc-500 dark:text-zinc-400">
                                    {exp.short_description}
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70">
                                <span className="text-[11px] font-mono text-zinc-400">
                                    {(exp.technologies || []).slice(0, 2).join(" · ") || exp.year || "2026"}
                                </span>
                                <Link
                                    href={`/experiments/${exp.slug}`}
                                    target="_blank"
                                    className="group/link inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white"
                                >
                                    View page
                                    <ExternalLink
                                        size={12}
                                        aria-hidden
                                        className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                    />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}

            {/* Currently Tinkering With Manager */}
            <section className="admin-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="admin-eyebrow">Workbench Section</p>
                        <h2 className="mt-1 font-heading text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                            Currently tinkering with
                        </h2>
                        <p className="mt-1 text-sm font-light text-zinc-500 dark:text-zinc-400">
                            Lightweight ideas and smaller builds shown at the bottom of /experiments.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button type="button" onClick={addTinkering} className="chip-btn">
                            <Plus size={14} aria-hidden /> Add tinkering note
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveTinkering}
                            disabled={savingTinkering}
                            className="btn-admin !min-h-[42px] !px-5 !text-xs"
                        >
                            <Save size={14} aria-hidden />
                            {savingTinkering ? "Saving…" : "Save workbench"}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {tinkering.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200/80 p-4 md:grid-cols-12 dark:border-zinc-800/80"
                        >
                            <div className="md:col-span-4 space-y-2">
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateTinkering(idx, { title: e.target.value })}
                                    className="field-sm font-medium"
                                    placeholder="Idea / prototype title"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={item.category}
                                        onChange={(e) => updateTinkering(idx, { category: e.target.value })}
                                        className="field-sm !text-xs"
                                    >
                                        {EXPERIMENT_CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={item.status}
                                        onChange={(e) => updateTinkering(idx, { status: e.target.value })}
                                        className="field-sm !text-xs"
                                    >
                                        {EXPERIMENT_STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-2">
                                <textarea
                                    rows={2}
                                    value={item.note}
                                    onChange={(e) => updateTinkering(idx, { note: e.target.value })}
                                    className="field-sm resize-none"
                                    placeholder="Short note on what you're exploring…"
                                />
                                <input
                                    type="text"
                                    value={(item.technologies || []).join(", ")}
                                    onChange={(e) =>
                                        updateTinkering(idx, {
                                            technologies: e.target.value
                                                .split(",")
                                                .map((x) => x.trim())
                                                .filter(Boolean),
                                        })
                                    }
                                    className="field-sm !text-xs"
                                    placeholder="Technologies (comma-separated, e.g. React, TypeScript)"
                                />
                            </div>

                            <div className="md:col-span-3 flex flex-col justify-between gap-2">
                                <input
                                    type="url"
                                    value={item.github_url || ""}
                                    onChange={(e) => updateTinkering(idx, { github_url: e.target.value })}
                                    className="field-sm font-mono !text-xs"
                                    placeholder="GitHub URL (optional)"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        value={item.live_url || ""}
                                        onChange={(e) => updateTinkering(idx, { live_url: e.target.value })}
                                        className="field-sm flex-1 font-mono !text-xs"
                                        placeholder="Live URL (optional)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTinkering(idx)}
                                        aria-label="Remove tinkering item"
                                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:border-red-300 hover:text-red-500 dark:border-zinc-800"
                                    >
                                        <X size={15} aria-hidden />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        role="status"
                        className="fixed bottom-8 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-zinc-950"
                    >
                        <CheckCircle2 aria-hidden className="text-razzmatazz" size={18} />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
