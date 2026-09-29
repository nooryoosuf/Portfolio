"use client";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, AlertTriangle } from "lucide-react";

interface HealthItem {
  id: string;
  title: string;
  editHref: string;
}

interface HealthCheck {
  label: string;
  archiveHref: string;
  items: HealthItem[];
}

/** Operational checklist: what's missing covers, summaries, clients. */
export default function ContentHealth({ checks }: { checks: HealthCheck[] }) {
  const open = checks.reduce((s, c) => s + c.items.length, 0);
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm font-light text-zinc-500 dark:text-zinc-400">
        {open === 0 ? (
          <>
            <CheckCircle2 size={16} aria-hidden className="text-emerald-500" />
            Everything ships complete. Nothing missing.
          </>
        ) : (
          <>
            <AlertTriangle size={16} aria-hidden className="text-amber-500" />
            {open} {open === 1 ? "gap" : "gaps"} to close before the site looks its best.
          </>
        )}
      </p>
      <ul className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70 border-y border-zinc-200/70 dark:border-zinc-800/70">
        {checks.map((c) => (
          <li key={c.label} className="py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {c.label}
                <span
                  className={`ml-2 inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                    c.items.length === 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {c.items.length}
                </span>
              </p>
              <Link
                href={c.archiveHref}
                className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white"
              >
                Open
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
            {c.items.length > 0 && (
              <ul className="mt-2.5 space-y-1.5">
                {c.items.slice(0, 3).map((it) => (
                  <li key={it.id}>
                    <Link
                      href={it.editHref}
                      className="link-underline text-[13px] font-light text-zinc-500 dark:text-zinc-400"
                    >
                      {it.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
