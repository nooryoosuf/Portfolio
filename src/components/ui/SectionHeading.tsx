import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
}

/** Consistent editorial section header: eyebrow rule + display title + lede. */
export default function SectionHeading({ eyebrow, title, lede, align = "left" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <p className={`eyebrow flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
        {eyebrow}
      </p>
      <h2 className="display text-4xl md:text-5xl mt-4">{title}</h2>
      {lede && <p className="lede mt-5">{lede}</p>}
    </Reveal>
  );
}
