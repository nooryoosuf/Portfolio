"use client";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin editorial progress rule pinned to the top of article pages. */
export default function ReadingProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-razzmatazz"
    />
  );
}
