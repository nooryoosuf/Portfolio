interface CategoryBadgeProps {
  label: string;
  tone?: "default" | "brand";
}

/** Small pill for categories/tags — single radius language site-wide. */
export default function CategoryBadge({ label, tone = "default" }: CategoryBadgeProps) {
  if (tone === "brand") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-razzmatazz">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-razzmatazz" />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold text-zinc-600 dark:text-zinc-300">
      {label}
    </span>
  );
}
