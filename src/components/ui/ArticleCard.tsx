"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArticleMeta from "./ArticleMeta";
import CategoryBadge from "./CategoryBadge";
import Reveal from "./Reveal";

interface ArticleCardProps {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  createdAt?: string;
  readTime?: string;
  featuredImage?: string;
  index?: number;
}

/**
 * Editorial article row: index numeral, category + meta, display title,
 * image thumb with hover zoom, animated arrow. Tap-native on mobile.
 */
export default function ArticleCard({
  slug,
  title,
  description,
  category,
  createdAt,
  readTime,
  featuredImage,
  index = 0,
}: ArticleCardProps) {
  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)}>
      <Link
        href={`/blog/${slug}`}
        className="group grid grid-cols-[auto_1fr] sm:grid-cols-[3rem_1fr_auto] items-start gap-4 sm:gap-8 py-8 md:py-10 border-t border-zinc-200/80 dark:border-zinc-800/80 last:border-b"
      >
        <span aria-hidden className="pt-1 font-serif italic text-lg text-zinc-300 dark:text-zinc-700 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-3 mb-3">
            <CategoryBadge label={category || "Design"} />
            <ArticleMeta date={createdAt} readTime={readTime} />
          </span>
          <span className="block font-heading font-medium tracking-tight text-2xl md:text-[2rem] leading-[1.15] text-zinc-950 dark:text-white transition-colors duration-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
            {title}
          </span>
          {description && (
            <span className="mt-3 block max-w-2xl text-[15px] md:text-base font-light leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {description}
            </span>
          )}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
            Read entry
            <ArrowRight size={16} aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
          </span>
        </span>
        {featuredImage && (
          <span className="hidden sm:block relative w-40 md:w-56 shrink-0 aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
            <Image
              src={featuredImage}
              alt=""
              fill
              sizes="240px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          </span>
        )}
      </Link>
    </Reveal>
  );
}
