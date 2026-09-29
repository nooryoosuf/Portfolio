"use client";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

interface DatedItem {
  created_at?: string;
}

interface ActivityChartProps {
  projects: DatedItem[];
  posts: DatedItem[];
}

function monthBuckets(): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

/** Grouped SVG bars: projects vs journal entries over the last 6 months. */
export default function ActivityChart({ projects, posts }: ActivityChartProps) {
  const reduce = useReducedMotion();
  const months = useMemo(monthBuckets, []);
  const rows = useMemo(() => {
    const pCount = new Map<string, number>();
    const bCount = new Map<string, number>();
    const bump = (m: Map<string, number>, iso?: string) => {
      if (!iso) return;
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return;
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      m.set(k, (m.get(k) || 0) + 1);
    };
    projects.forEach((p) => bump(pCount, p.created_at));
    posts.forEach((p) => bump(bCount, p.created_at));
    return months.map((m) => ({ ...m, projects: pCount.get(m.key) || 0, posts: bCount.get(m.key) || 0 }));
  }, [months, projects, posts]);

  const max = Math.max(1, ...rows.flatMap((r) => [r.projects, r.posts]));
  const W = 560;
  const H = 190;
  const PAD_L = 8;
  const PAD_B = 28;
  const plotH = H - PAD_B - 12;
  const groupW = (W - PAD_L * 2) / rows.length;
  const barW = Math.min(22, (groupW - 18) / 2);

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Publishing activity over the last 6 months"
        className="w-full"
      >
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD_L}
            x2={W - PAD_L}
            y1={12 + plotH * (1 - f)}
            y2={12 + plotH * (1 - f)}
            className="stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        ))}
        {rows.map((r, i) => {
          const cx = PAD_L + groupW * i + groupW / 2;
          const ph = (r.projects / max) * plotH;
          const bh = (r.posts / max) * plotH;
          return (
            <g key={r.key}>
              <rect
                x={cx - barW - 3}
                y={12 + plotH - ph}
                width={barW}
                height={Math.max(ph, 2)}
                rx={4}
                className="fill-zinc-950 dark:fill-white"
                style={reduce ? undefined : { transition: "height 0.8s cubic-bezier(0.22,1,0.36,1), y 0.8s cubic-bezier(0.22,1,0.36,1)" }}
              >
                <title>{`${r.projects} projects in ${r.label}`}</title>
              </rect>
              <rect
                x={cx + 3}
                y={12 + plotH - bh}
                width={barW}
                height={Math.max(bh, 2)}
                rx={4}
                className="fill-razzmatazz"
                style={reduce ? undefined : { transition: "height 0.8s cubic-bezier(0.22,1,0.36,1), y 0.8s cubic-bezier(0.22,1,0.36,1)" }}
              >
                <title>{`${r.posts} journal entries in ${r.label}`}</title>
              </rect>
              <text
                x={cx}
                y={H - 8}
                textAnchor="middle"
                className="fill-zinc-400 text-[11px] font-medium dark:fill-zinc-500"
              >
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 flex items-center gap-5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-full bg-zinc-950 dark:bg-white" /> Projects
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-full bg-razzmatazz" /> Journal
        </span>
      </figcaption>
    </figure>
  );
}
