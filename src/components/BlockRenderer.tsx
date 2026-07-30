"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface BlockProps {
    blocks: any[];
}

export default function BlockRenderer({ blocks }: BlockProps) {
    if (!blocks || !Array.isArray(blocks)) return null;
    const renderableBlocks = blocks.filter((b: any) => b && b.type !== 'meta');

    return (
        <div className="space-y-32 w-full">
            {renderableBlocks.map((block, index) => {
                switch (block.type) {
                    case 'section':
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8 w-full"
                            >
                                {block.title && (
                                    <h3 className="text-3xl md:text-5xl font-heading font-medium text-zinc-900 dark:text-white tracking-tight mb-6">
                                        {block.title}
                                    </h3>
                                )}
                                {block.content && (
                                    <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-light leading-relaxed whitespace-pre-line">
                                        {block.content}
                                    </p>
                                )}
                            </motion.div>
                        );

                    case 'image_grid':
                        const gridCols: Record<number, string> = {
                            1: 'md:grid-cols-1',
                            2: 'md:grid-cols-2',
                            3: 'md:grid-cols-3',
                        };
                        return (
                            <div key={index} className={`grid grid-cols-1 ${gridCols[block.columns] || 'md:grid-cols-1'} gap-8 w-full`}>
                                {block.images?.map((url: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="aspect-video md:aspect-auto rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                                    >
                                        <img src={url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                            </div>
                        );

                    case 'quote':
                        return (
                            <motion.blockquote
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative p-12 bg-zinc-50 dark:bg-zinc-900/80 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 w-full"
                            >
                                <Quote className="text-razzmatazz mb-6 opacity-20" size={48} />
                                <p className="text-2xl md:text-4xl font-heading font-medium text-zinc-900 dark:text-white italic leading-tight mb-8">
                                    "{block.content}"
                                </p>
                                {block.author && (
                                    <cite className="text-zinc-400 dark:text-zinc-500 font-medium tracking-widest uppercase text-[10px] not-italic">
                                        — {block.author}
                                    </cite>
                                )}
                            </motion.blockquote>
                        );

                    case 'list':
                        return (
                            <div key={index} className="space-y-8 w-full">
                                {block.title && <h4 className="text-xl font-heading font-medium text-zinc-900 dark:text-white">{block.title}</h4>}
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {block.items?.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 bg-razzmatazz rounded-full mt-2.5 flex-shrink-0" />
                                            <span className="text-zinc-600 dark:text-zinc-400 text-lg font-light">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
