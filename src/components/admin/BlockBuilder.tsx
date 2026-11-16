"use client";
import { Type, Quote, LayoutList, LayoutGrid, Clapperboard, Columns2, MonitorPlay, Sparkles, X, ArrowUp, ArrowDown, Copy } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { STORY_SECTION_PRESETS } from "@/lib/experiments";

const GRID_COLS: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
};

interface BlockBuilderProps {
    blocks: any[];
    onChange: (blocks: any[]) => void;
    addLabels?: Partial<{ section: string; image_grid: string; quote: string; list: string; video: string; compare: string; embed: string }>;
    enableExperimentPresets?: boolean;
}

/** Shared CMS block editor (section / visuals / quote / list / video / compare / embed) for projects, journal, and experiments. */
export default function BlockBuilder({ blocks, onChange, addLabels, enableExperimentPresets = false }: BlockBuilderProps) {
    const labels = {
        section: "Section",
        image_grid: "Visuals",
        quote: "Quote",
        list: "List",
        video: "Video / GIF",
        compare: "Before/after",
        embed: "Live preview",
        ...addLabels,
    };

    const addBlock = (type: string, extra?: Record<string, any>) => {
        let b: any = { type };
        if (type === "section") b = { ...b, title: "", content: "", ...extra };
        else if (type === "quote") b = { ...b, content: "", author: "", ...extra };
        else if (type === "image_grid") b = { ...b, columns: 1, images: [""], captions: [""], caption: "", frame: "raw", ...extra };
        else if (type === "list") b = { ...b, title: "", items: [""], ...extra };
        else if (type === "video") b = { ...b, url: "", caption: "", ...extra };
        else if (type === "embed") b = { ...b, url: "", title: "", caption: "", ...extra };
        else if (type === "compare") b = { ...b, before: "", after: "", beforeLabel: "Before", afterLabel: "After", ...extra };
        onChange([...blocks, b]);
    };

    const updateBlock = (index: number, data: any) => {
        const next = [...blocks];
        next[index] = { ...next[index], ...data };
        onChange(next);
    };

    const removeBlock = (index: number) => {
        onChange(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, dir: -1 | 1) => {
        const target = index + dir;
        if (target < 0 || target >= blocks.length) return;
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const duplicateBlock = (index: number) => {
        const next = [...blocks];
        next.splice(index + 1, 0, JSON.parse(JSON.stringify(blocks[index])));
        onChange(next);
    };

    const addButtons = [
        { type: "section", label: labels.section, icon: <Type size={14} aria-hidden /> },
        { type: "image_grid", label: labels.image_grid, icon: <LayoutGrid size={14} aria-hidden /> },
        { type: "quote", label: labels.quote, icon: <Quote size={14} aria-hidden /> },
        { type: "list", label: labels.list, icon: <LayoutList size={14} aria-hidden /> },
        { type: "video", label: labels.video, icon: <Clapperboard size={14} aria-hidden /> },
        { type: "compare", label: labels.compare, icon: <Columns2 size={14} aria-hidden /> },
        ...(enableExperimentPresets
            ? [{ type: "embed", label: labels.embed, icon: <MonitorPlay size={14} aria-hidden /> }]
            : []),
    ];

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="admin-eyebrow">Content flow</h2>
                <div className="flex flex-wrap gap-2">
                    {addButtons.map((b) => (
                        <button key={b.type} type="button" onClick={() => addBlock(b.type)} className="chip-btn">
                            {b.icon} {b.label}
                        </button>
                    ))}
                </div>
            </div>

            {enableExperimentPresets && (
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/40">
                    <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                        <Sparkles size={13} aria-hidden className="text-razzmatazz" />
                        Quick-add build journal chapters
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {STORY_SECTION_PRESETS.map((preset) => (
                            <button
                                key={preset.key}
                                type="button"
                                onClick={() =>
                                    addBlock("section", {
                                        section_key: preset.key,
                                        title: preset.title,
                                        content: "",
                                        _prompt: preset.prompt,
                                    })
                                }
                                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-razzmatazz hover:text-razzmatazz dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-razzmatazz"
                            >
                                + {preset.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {blocks.map((block, index) => {
                    const matchedPreset = STORY_SECTION_PRESETS.find(
                        (p) => p.key === block.section_key || p.title.toLowerCase() === String(block.title || "").toLowerCase()
                    );
                    return (
                        <div key={index} className="admin-card relative">
                            <div className="absolute right-5 top-5 flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveBlock(index, -1)}
                                    disabled={index === 0}
                                    aria-label="Move block up"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-white"
                                >
                                    <ArrowUp size={16} aria-hidden />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveBlock(index, 1)}
                                    disabled={index === blocks.length - 1}
                                    aria-label="Move block down"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-white"
                                >
                                    <ArrowDown size={16} aria-hidden />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => duplicateBlock(index)}
                                    aria-label="Duplicate block"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
                                >
                                    <Copy size={16} aria-hidden />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeBlock(index)}
                                    aria-label={`Remove ${block.type} block`}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                >
                                    <X size={18} aria-hidden />
                                </button>
                            </div>

                            <p className="admin-eyebrow mb-5 pr-40">
                                {String(block.type).replace(/_/g, " ")} #{index + 1}
                            </p>

                            {block.type === "section" && (
                                <div className="space-y-4">
                                    <input
                                        value={block.title || ""}
                                        onChange={(e) => updateBlock(index, { title: e.target.value })}
                                        className="field-plain font-heading text-2xl font-medium"
                                        placeholder="Section title (e.g. The Idea, The Process, Things I Learned)"
                                    />
                                    {matchedPreset && (
                                        <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                                            Prompt: {matchedPreset.prompt}
                                        </p>
                                    )}
                                    <textarea
                                        value={block.content || ""}
                                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                                        className="field min-h-[150px] resize-y"
                                        placeholder={
                                            matchedPreset?.prompt ||
                                            "Write your content here… Tip: [[term|short definition]] adds a reader tooltip."
                                        }
                                    />
                                </div>
                            )}

                            {block.type === "quote" && (
                                <div className="space-y-4">
                                    <textarea
                                        value={block.content || ""}
                                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                                        className="field font-serif text-xl italic"
                                        placeholder="Enter quote…"
                                        rows={2}
                                    />
                                    <input
                                        value={block.author || ""}
                                        onChange={(e) => updateBlock(index, { author: e.target.value })}
                                        className="field-plain text-[11px] font-semibold uppercase tracking-[0.16em]"
                                        placeholder="— Author or note"
                                    />
                                </div>
                            )}

                            {block.type === "image_grid" && (
                                <div className="space-y-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex gap-2" role="group" aria-label="Columns">
                                            {[1, 2, 3].map((n) => (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() =>
                                                        updateBlock(index, {
                                                            columns: n,
                                                            images: (block.images || [])
                                                                .slice(0, n)
                                                                .concat(Array(Math.max(0, n - (block.images?.length || 0))).fill("")),
                                                        })
                                                    }
                                                    aria-pressed={block.columns === n}
                                                    className={`min-h-[40px] rounded-lg px-4 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                                                        block.columns === n
                                                            ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                                            : "border border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
                                                    }`}
                                                >
                                                    {n} col{n > 1 ? "s" : ""}
                                                </button>
                                            ))}
                                        </div>

                                        {enableExperimentPresets && (
                                            <div className="flex gap-1.5" role="group" aria-label="Aspect / device framing">
                                                {(["raw", "desktop", "mobile"] as const).map((frameMode) => (
                                                    <button
                                                        key={frameMode}
                                                        type="button"
                                                        onClick={() => updateBlock(index, { frame: frameMode })}
                                                        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                                                            (block.frame || "raw") === frameMode
                                                                ? "bg-razzmatazz text-white"
                                                                : "border border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                                                        }`}
                                                    >
                                                        {frameMode}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`grid grid-cols-1 ${GRID_COLS[block.columns] || "md:grid-cols-1"} gap-4`}>
                                        {(block.images || []).map((img: string, i: number) => (
                                            <div key={i} className="space-y-2">
                                                <ImageUpload
                                                    value={img}
                                                    onChange={(url) => {
                                                        const imgs = [...(block.images || [])];
                                                        imgs[i] = url;
                                                        updateBlock(index, { images: imgs });
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={Array.isArray(block.captions) ? block.captions[i] || "" : ""}
                                                    onChange={(e) => {
                                                        const caps = [...(block.captions || [])];
                                                        caps[i] = e.target.value;
                                                        updateBlock(index, { captions: caps });
                                                    }}
                                                    className="field-sm"
                                                    placeholder={`Caption for image #${i + 1} (optional)`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        type="text"
                                        value={block.caption || ""}
                                        onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                        className="field-sm"
                                        placeholder="Overall figure caption (optional)"
                                    />
                                </div>
                            )}

                            {block.type === "video" && (
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor={`block-video-${index}`} className="field-label">
                                            Video or GIF URL — YouTube, .mp4, or .gif
                                        </label>
                                        <input
                                            id={`block-video-${index}`}
                                            value={block.url || ""}
                                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                                            className="field-sm font-mono"
                                            placeholder="https://youtube.com/watch?v=… or https://…/demo.mp4 or .gif"
                                            inputMode="url"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={block.caption || ""}
                                        onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                        className="field-sm"
                                        placeholder="Video / GIF caption (optional)"
                                    />
                                </div>
                            )}

                            {block.type === "embed" && (
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor={`block-embed-${index}`} className="field-label">
                                            Live preview URL
                                        </label>
                                        <input
                                            id={`block-embed-${index}`}
                                            value={block.url || ""}
                                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                                            className="field-sm font-mono"
                                            placeholder="https://pebble.nooryoosuf.com"
                                            inputMode="url"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <input
                                            type="text"
                                            value={block.title || ""}
                                            onChange={(e) => updateBlock(index, { title: e.target.value })}
                                            className="field-sm"
                                            placeholder="Preview bar title (optional)"
                                        />
                                        <input
                                            type="text"
                                            value={block.caption || ""}
                                            onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                            className="field-sm"
                                            placeholder="Caption below embed (optional)"
                                        />
                                    </div>
                                </div>
                            )}

                            {block.type === "compare" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <span className="field-label">Before image</span>
                                            <ImageUpload
                                                value={block.before || ""}
                                                onChange={(url) => updateBlock(index, { before: url })}
                                            />
                                            <label htmlFor={`block-beforelabel-${index}`} className="sr-only">
                                                Before label
                                            </label>
                                            <input
                                                id={`block-beforelabel-${index}`}
                                                value={block.beforeLabel || ""}
                                                onChange={(e) => updateBlock(index, { beforeLabel: e.target.value })}
                                                className="field-sm"
                                                placeholder="Before"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="field-label">After image</span>
                                            <ImageUpload
                                                value={block.after || ""}
                                                onChange={(url) => updateBlock(index, { after: url })}
                                            />
                                            <label htmlFor={`block-afterlabel-${index}`} className="sr-only">
                                                After label
                                            </label>
                                            <input
                                                id={`block-afterlabel-${index}`}
                                                value={block.afterLabel || ""}
                                                onChange={(e) => updateBlock(index, { afterLabel: e.target.value })}
                                                className="field-sm"
                                                placeholder="After"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                                        Readers drag the handle to compare — ideal for iterations and redesigns.
                                    </p>
                                </div>
                            )}

                            {block.type === "list" && (
                                <div className="space-y-4">
                                    <input
                                        value={block.title || ""}
                                        onChange={(e) => updateBlock(index, { title: e.target.value })}
                                        className="field-plain font-heading text-xl font-medium"
                                        placeholder="List title (optional)"
                                    />
                                    <div className="space-y-2.5">
                                        {(block.items || []).map((item: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const items = [...(block.items || [])];
                                                        items[i] = e.target.value;
                                                        updateBlock(index, { items });
                                                    }}
                                                    className="field-sm flex-1"
                                                    placeholder="List item…"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateBlock(index, {
                                                            items: (block.items || []).filter((_: any, idx: number) => idx !== i),
                                                        })
                                                    }
                                                    aria-label="Remove item"
                                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-red-500"
                                                >
                                                    <X size={15} aria-hidden />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => updateBlock(index, { items: [...(block.items || []), ""] })}
                                            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-razzmatazz"
                                        >
                                            + Add item
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {blocks.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-zinc-200 py-10 text-center text-sm font-light text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                        No blocks yet — add a story chapter, visual, quote, video, or list above.
                    </p>
                )}
            </div>
        </section>
    );
}
