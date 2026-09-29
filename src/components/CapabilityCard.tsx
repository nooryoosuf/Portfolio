"use client";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

interface CapabilityCardProps {
    title: string;
    description: string;
    icon?: ReactNode;
    index?: number;
}

/** Editorial capability row: index, title, description, hover arrow. */
export default function CapabilityCard({ title, description, icon, index = 0 }: CapabilityCardProps) {
    return (
        <Reveal delay={Math.min(index * 0.06, 0.24)}>
            <div className="group border-t border-zinc-200/80 dark:border-zinc-800/80 py-7 last:border-b">
                <div className="flex items-start gap-5">
                    <span aria-hidden className="pt-1 font-serif italic text-base text-zinc-300 dark:text-zinc-700 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                        <h3 className="flex items-center gap-3 font-heading text-xl md:text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                            {icon && (
                                <span aria-hidden className="text-zinc-300 dark:text-zinc-700 transition-colors duration-300 group-hover:text-razzmatazz">
                                    {icon}
                                </span>
                            )}
                            {title}
                            <ArrowUpRight
                                size={18}
                                aria-hidden
                                className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-razzmatazz"
                            />
                        </h3>
                        <p className="mt-2 max-w-xl text-[15px] font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
