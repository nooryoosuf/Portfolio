"use client";
import { use } from "react";
import { motion } from "framer-motion";
import { articles } from "@/data/blog";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <article className="max-w-4xl mx-auto">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group text-sm font-medium"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Journal
                </Link>

                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex gap-4 items-center mb-8">
                            <span className="text-zinc-900 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 bg-zinc-100 rounded-full">
                                {article.category}
                            </span>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest">
                                <Calendar size={12} />
                                {article.date}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest">
                                <Clock size={12} />
                                {article.readTime}
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tight text-zinc-900 mb-8 leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-zinc-500 text-xl md:text-2xl font-light leading-relaxed">
                            {article.description}
                        </p>
                    </motion.div>
                </header>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-zinc prose-lg max-w-none text-zinc-600 font-light leading-loose space-y-8"
                >
                    <div className="h-px bg-zinc-100 w-full mb-12" />
                    <p className="whitespace-pre-line">
                        {article.content}
                    </p>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                    <div className="aspect-video bg-zinc-50 rounded-[2rem] border border-zinc-100 flex items-center justify-center text-zinc-200 font-heading text-4xl">
                        Illustration / Graphic
                    </div>
                    <p>
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                    </p>
                </motion.div>
            </article>
        </div>
    );
}
