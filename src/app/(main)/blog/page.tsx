"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { articles } from "@/data/blog";

export default function Blog() {
    return (
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                <header className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-4 block">Insights</span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 mb-8 leading-[1.1]">
                            The <span className="text-razzmatazz underline decoration-zinc-100 decoration-4 underline-offset-8">Journal.</span>
                        </h1>

                        <p className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                            Thoughtful explorations into the world of design, technology, and user experience.
                        </p>
                    </motion.div>
                </header>

                <div className="space-y-0 divide-y divide-zinc-100 border-y border-zinc-100 mb-32">
                    {articles.map((article, i) => (
                        <motion.article
                            key={article.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group py-16 transition-all duration-300 hover:px-8 hover:bg-zinc-50 rounded-2xl"
                        >
                            <Link href={`/blog/${article.slug}`} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="max-w-3xl">
                                    <div className="flex gap-4 items-center mb-6">
                                        <span className="text-zinc-900 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 bg-zinc-100 rounded-full">
                                            {article.category}
                                        </span>
                                        <span className="text-zinc-400 text-xs uppercase tracking-widest">
                                            {article.date}
                                        </span>
                                        <span className="text-zinc-300">•</span>
                                        <span className="text-zinc-400 text-xs uppercase tracking-widest">
                                            {article.readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-heading font-medium text-zinc-900 mb-6 group-hover:text-zinc-600 transition-colors leading-tight">
                                        {article.title}
                                    </h2>
                                    <p className="text-zinc-500 text-lg font-light leading-relaxed">
                                        {article.description}
                                    </p>
                                </div>
                                <div className="w-16 h-16 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-500">
                                    <ArrowUpRight size={24} />
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Newsletter */}
                <section className="bg-zinc-50 rounded-[3rem] p-12 md:p-24 border border-zinc-100">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-4xl font-heading font-medium text-zinc-900 mb-6">Stay in the loop.</h2>
                        <p className="text-zinc-500 font-light mb-10">Get the latest design insights delivered directly to your inbox. No spam, just pure inspiration.</p>
                        <form className="flex flex-col md:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white border border-zinc-200 rounded-full px-8 py-4 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 transition-colors"
                            />
                            <button className="bg-zinc-900 text-white px-10 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all duration-300">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

