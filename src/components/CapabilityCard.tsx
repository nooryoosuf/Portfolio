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
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group p-8 rounded-3xl bg-white border border-zinc-100 hover:border-zinc-200 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50"
        >
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 mb-6">
                {icon}
            </div>

            <h3 className="text-xl font-heading font-medium text-zinc-900 mb-3 tracking-tight">
                {title}
            </h3>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}

