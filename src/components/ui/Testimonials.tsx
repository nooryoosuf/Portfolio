"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialsProps {
  items: Testimonial[];
}

/** Rotating testimonial card: serif quote, client, dots + arrows. */
export default function Testimonials({ items }: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length, paused, reduce]);

  if (items.length === 0) return null;
  const current = items[index % items.length];

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white px-8 py-12 text-center md:px-16 md:py-16 dark:border-zinc-800/80 dark:bg-zinc-900/60"
    >
      <Quote aria-hidden size={32} className="mx-auto text-razzmatazz/40" />
      <div className="mx-auto mt-6 min-h-[10rem] max-w-3xl md:min-h-[8rem]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={`${index % items.length}-${current.name}`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="font-serif text-2xl italic leading-snug text-zinc-900 md:text-[1.75rem] dark:text-zinc-100">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6">
              <p className="font-heading text-base font-medium tracking-tight text-zinc-950 dark:text-white">
                {current.name}
              </p>
              {current.role && (
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                  {current.role}
                </p>
              )}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden />
          </button>
          <div className="flex items-center gap-1.5" aria-hidden>
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index % items.length ? "w-5 bg-zinc-950 dark:bg-white" : "w-1.5 bg-zinc-300 dark:bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
          >
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
