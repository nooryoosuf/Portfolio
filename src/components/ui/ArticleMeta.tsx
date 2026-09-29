import { Calendar, Clock } from "lucide-react";

interface ArticleMetaProps {
  date?: string;
  readTime?: string;
  className?: string;
}

export function formatDate(value?: string): string {
  if (!value) return "Recently";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

/** Single metadata row used across listing + article pages. */
export default function ArticleMeta({ date, readTime, className = "" }: ArticleMetaProps) {
  return (
    <p className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500 ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={13} aria-hidden /> {formatDate(date)}
      </span>
      <span aria-hidden className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <span className="inline-flex items-center gap-1.5">
        <Clock size={13} aria-hidden /> {readTime || "5 min read"}
      </span>
    </p>
  );
}
