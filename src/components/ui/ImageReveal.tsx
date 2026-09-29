"use client";
import { motion, useReducedMotion } from "framer-motion";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspect?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Image with curtain reveal + slow settle zoom; plain frame under reduced motion. */
export default function ImageReveal({ src, alt, className = "", imgClassName = "", aspect = "aspect-video" }: ImageRevealProps) {
  const reduce = useReducedMotion();
  return (
    <div className={`img-frame ${aspect} relative ${className}`}>
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 z-10 origin-top bg-zinc-950 dark:bg-white"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      )}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={reduce ? false : { scale: 1.06 }}
        whileInView={reduce ? undefined : { scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
