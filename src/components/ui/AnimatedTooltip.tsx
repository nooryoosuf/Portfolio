"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

void 0;

/**
 * Vengeance-UI-inspired contextual tooltip.
 * Dotted-underline trigger; spring card on hover/focus, tap-to-toggle on touch.
 */
export default function AnimatedTooltip({ children, content, className = "" }: AnimatedTooltipProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const tooltipId = useId();

  return (
    <span className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="underline decoration-dotted decoration-razzmatazz/70 underline-offset-4 decoration-1 font-medium text-inherit cursor-help"
      >
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            key="tip"
            id={tooltipId}
            role="tooltip"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 420, damping: 30 }}
            className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-left shadow-xl shadow-zinc-900/10 dark:shadow-black/40"
          >
            <span className="block text-[13px] leading-relaxed font-normal text-zinc-600 dark:text-zinc-300 normal-case tracking-normal">
              {content}
            </span>
            <span
              aria-hidden
              className="absolute top-full left-1/2 -translate-x-1/2 -mt-px h-2.5 w-2.5 rotate-45 border-b border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
