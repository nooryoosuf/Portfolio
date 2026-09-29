"use client";
import { Type, Quote, LayoutList, LayoutGrid, Clapperboard, Columns2, X, ArrowUp, ArrowDown, Copy } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

interface BlockBuilderProps {
  blocks: any[];
  onChange: (blocks: any[]) => void;
  addLabels?: Partial<{ section: string; image_grid: string; quote: string; list: string; video: string; compare: string }>;
}

/** Shared CMS block editor (section / visuals / quote / list) for projects + journal. */
export default function BlockBuilder({ blocks, onChange, addLabels }: BlockBuilderProps) {
  const labels = { section: "Section", image_grid: "Visuals", quote: "Quote", list: "List", video: "Video", compare: "Before/after", ...addLabels };

  const addBlock = (type: string) => {
    let b: any = { type };
    if (type === "section") b = { ...b, title: "", content: "" };
    else if (type === "quote") b = { ...b, content: "", author: "" };
    else if (type === "image_grid") b = { ...b, columns: 1, images: [""] };
    else if (type === "list") b = { ...b, title: "", items: [""] };
    else if (type === "video") b = { ...b, url: "" };
    else if (type === "compare") b = { ...b, before: "", after: "", beforeLabel: "Before", afterLabel: "After" };
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

      <div className="space-y-4">
        {blocks.map((block, index) => (
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

            <p className="admin-eyebrow mb-5 pr-40">{String(block.type).replace(/_/g, " ")}</p>

            {block.type === "section" && (
              <div className="space-y-4">
                <input
                  value={block.title || ""}
                  onChange={(e) => updateBlock(index, { title: e.target.value })}
                  className="field-plain font-heading text-2xl font-medium"
                  placeholder="Section title (optional)"
                />
                <textarea
                  value={block.content || ""}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  className="field min-h-[150px] resize-y"
                  placeholder="Write your content here… Tip: [[term|short definition]] adds a reader tooltip."
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
                  placeholder="— Author name"
                />
              </div>
            )}

            {block.type === "image_grid" && (
              <div className="space-y-5">
                <div className="flex gap-2" role="group" aria-label="Columns">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateBlock(index, { columns: n, images: (block.images || []).slice(0, n).concat(Array(Math.max(0, n - (block.images?.length || 0))).fill("")) })}
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
                <div className={`grid grid-cols-1 ${GRID_COLS[block.columns] || "md:grid-cols-1"} gap-4`}>
                  {(block.images || []).map((img: string, i: number) => (
                    <ImageUpload
                      key={i}
                      value={img}
                      onChange={(url) => {
                        const imgs = [...(block.images || [])];
                        imgs[i] = url;
                        updateBlock(index, { images: imgs });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {block.type === "video" && (
              <div className="space-y-2.5">
                <label htmlFor={`block-video-${index}`} className="field-label">Video URL — YouTube link or direct .mp4</label>
                <input
                  id={`block-video-${index}`}
                  value={block.url || ""}
                  onChange={(e) => updateBlock(index, { url: e.target.value })}
                  className="field-sm font-mono"
                  placeholder="https://youtube.com/watch?v=… or https://…/clip.mp4"
                  inputMode="url"
                />
                <p className="text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                  YouTube links embed the player; direct .mp4 files play natively.
                </p>
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
                    <label htmlFor={`block-beforelabel-${index}`} className="sr-only">Before label</label>
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
                    <label htmlFor={`block-afterlabel-${index}`} className="sr-only">After label</label>
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
                  Readers drag the handle to compare — ideal for rebrands and redesigns.
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
                        onClick={() => updateBlock(index, { items: (block.items || []).filter((_: any, idx: number) => idx !== i) })}
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
        ))}

        {blocks.length === 0 && (
          <p className="rounded-2xl border border-dashed border-zinc-200 py-10 text-center text-sm font-light text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
            No blocks yet — add a section, visual, quote, or list above.
          </p>
        )}
      </div>
    </section>
  );
}
