"use client";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Slice {
  label: string;
  value: number;
}

const PALETTE = ["#F7095E", "#18181b", "#71717a", "#d4d4d8", "#a1a1aa", "#3f3f46"];
const R = 56;
const CIRC = 2 * Math.PI * R;

/** Animated SVG donut with legend. */
export default function CategoryDonut({ data }: { data: Slice[] }) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const segs = useMemo(() => {
    let acc = 0;
    return data.map((d) => {
      const frac = total > 0 ? d.value / total : 0;
      const s = { ...d, dash: frac * CIRC, offset: acc };
      acc += frac * CIRC;
      return s;
    });
  }, [data, total]);

  if (total === 0) {
    return <p className="py-8 text-center font-serif text-xl italic text-zinc-400">No projects yet.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <svg viewBox="0 0 140 140" role="img" aria-label="Projects by category" className="h-36 w-36 shrink-0 -rotate-90">
        <circle cx={70} cy={70} r={R} fill="none" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth={18} />
        {segs.map((s, i) => (
          <circle
            key={s.label}
            cx={70}
            cy={70}
            r={R}
            fill="none"
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={18}
            strokeDasharray={`${on || reduce ? s.dash : 0} ${CIRC}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            style={reduce ? undefined : { transition: "stroke-dasharray 1s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <title>{`${s.label}: ${s.value}`}</title>
          </circle>
        ))}
        <text x={70} y={66} textAnchor="middle" className="rotate-90 fill-zinc-950 font-heading text-2xl font-medium dark:fill-white" transform="rotate(90 70 70)">
          {total}
        </text>
        <text x={70} y={84} textAnchor="middle" className="fill-zinc-400 text-[9px] font-semibold uppercase" transform="rotate(90 70 70)">
          works
        </text>
      </svg>
      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {segs.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2.5 text-sm">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="min-w-0 flex-1 truncate font-medium text-zinc-700 dark:text-zinc-200">{s.label}</span>
            <span className="font-heading font-medium tabular-nums text-zinc-950 dark:text-white">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
