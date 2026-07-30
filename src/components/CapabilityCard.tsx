"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CapabilityCardProps {
    title: string;
    description: string;
    icon: ReactNode;
}

export default function CapabilityCard({ title, description, icon }: CapabilityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group p-8 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40 transform-gpu"
        >
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-300 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-500 mb-6">
                {icon}
            </div>

            <h3 className="text-xl font-heading font-medium text-zinc-900 dark:text-white mb-3 tracking-tight">
                {title}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
