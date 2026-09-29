"use client";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import CountUp from "react-countup";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  href: string;
  sub?: string;
}

/** Dashboard stat with animated count-up and hover nudge. */
export default function StatCard({ label, value, icon, href, sub }: StatCardProps) {
  const reduce = useReducedMotion();
  return (
    <Link
      href={href}
      className="card-rest group block p-6 transition-shadow duration-300 hover:shadow-lg"
    >
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-colors duration-300 group-hover:border-razzmatazz group-hover:text-razzmatazz dark:border-zinc-800 dark:text-zinc-400"
      >
        {icon}
      </span>
      <span className="mt-5 block font-heading text-4xl font-medium tracking-tight text-zinc-950 tabular-nums dark:text-white">
        {reduce ? value : <CountUp end={value} duration={1.6} />}
      </span>
      <span className="eyebrow mt-1.5 block">{label}</span>
      {sub && (
        <span className="mt-1 block text-[13px] font-light text-zinc-400 dark:text-zinc-500">{sub}</span>
      )}
    </Link>
  );
}
