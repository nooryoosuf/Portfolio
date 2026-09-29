"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
}

/** Editorial link with animated underline + optional arrow nudge. */
export default function AnimatedLink({ href, children, className = "", withArrow = false }: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-1 font-medium text-zinc-900 dark:text-white ${className}`}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      {withArrow && (
        <ArrowUpRight size={16} aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </Link>
  );
}
