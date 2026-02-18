"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X, Type, Quote, LayoutList, Image as ImageIcon, LayoutGrid, Clock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function NewBlogPost() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        slug: "",
        read_time: "5 min read",
        description: "",
        featured_image: "",
        content_blocks: [] as any[],
    });

    const addBlock = (type: string) => {
        let newBlock: any = { type };
        if (type === 'section') newBlock = { ...newBlock, title: "", content: "" };
        else if (type === 'quote') newBlock = { ...newBlock, content: "", author: "" };
        else if (type === 'image_grid') newBlock = { ...newBlock, columns: 1, images: [""] };
        else if (type === 'list') newBlock = { ...newBlock, title: "", items: [""] };

        setFormData({ ...formData, content_blocks: [...formData.content_blocks, newBlock] });
    };

    const updateBlock = (index: number, data: any) => {
        const newBlocks = [...formData.content_blocks];
        newBlocks[index] = { ...newBlocks[index], ...data };
        setFormData({ ...formData, content_blocks: newBlocks });
    };

    const removeBlock = (index: number) => {
        setFormData({ ...formData, content_blocks: formData.content_blocks.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('blog_posts')
                .insert([
                    {
                        ...formData,
                        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                    }
                ]);

            if (error) throw error;
            router.push("/admin/blog");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-40">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <Link href="/admin/blog" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} />
                        Back to Articles
                    </Link>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight">
                        New <span className="text-razzmatazz">Journal Entry</span>
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? "Publishing..." : "Publish Article"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    {/* Summary Section */}
                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                            Summary / Intro
                        </h2>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-zinc-900 focus:outline-none focus:border-zinc-300 transition-colors resize-none text-lg font-light italic"
                            placeholder="A brief summary that sparks curiosity..."
                        />
                    </section>

                    {/* Block Builder */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-center px-4">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Article Flow</h2>
                            <div className="flex gap-2">
                                <button onClick={() => addBlock('section')} className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-zinc-600 text-xs font-bold flex items-center gap-2 italic">
                                    <Type size={14} /> + Section
                                </button>
                                <button onClick={() => addBlock('image_grid')} className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-zinc-600 text-xs font-bold flex items-center gap-2 italic">
                                    <LayoutGrid size={14} /> + Visual
                                </button>
                                <button onClick={() => addBlock('quote')} className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-zinc-600 text-xs font-bold flex items-center gap-2 italic">
                                    <Quote size={14} /> + Quote
                                </button>
                                <button onClick={() => addBlock('list')} className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-zinc-600 text-xs font-bold flex items-center gap-2 italic">
                                    <LayoutList size={14} /> + List
                                </button>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {formData.content_blocks.map((block, index) => (
                                <div key={index} className="relative group bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
                                    <button
                                        onClick={() => removeBlock(index)}
                                        className="absolute top-6 right-6 text-zinc-300 hover:text-red-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em] mb-6">
                                        {block.type.replace(/_/g, ' ')}
                                    </div>

                                    {block.type === 'section' && (
                                        <div className="space-y-4">
                                            <input
                                                value={block.title}
                                                onChange={(e) => updateBlock(index, { title: e.target.value })}
                                                className="w-full bg-transparent text-2xl font-heading font-medium text-zinc-900 border-none focus:outline-none placeholder:text-zinc-200"
                                                placeholder="Sub-heading (Optional)"
                                            />
                                            <textarea
                                                value={block.content}
                                                onChange={(e) => updateBlock(index, { content: e.target.value })}
                                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-zinc-600 focus:outline-none min-h-[150px] resize-none"
                                                placeholder="Write your thoughts here..."
                                            />
                                        </div>
                                    )}

                                    {block.type === 'quote' && (
                                        <div className="space-y-4">
                                            <textarea
                                                value={block.content}
                                                onChange={(e) => updateBlock(index, { content: e.target.value })}
                                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-6 px-8 text-xl font-heading italic text-zinc-900 focus:outline-none"
                                                placeholder="Enter quote or highlight..."
                                                rows={2}
                                            />
                                            <input
                                                value={block.author}
                                                onChange={(e) => updateBlock(index, { author: e.target.value })}
                                                className="w-full bg-transparent text-[10px] font-bold uppercase tracking-widest text-zinc-400 focus:outline-none border-none"
                                                placeholder="— Citation (Optional)"
                                            />
                                        </div>
                                    )}

                                    {block.type === 'image_grid' && (
                                        <div className="space-y-6">
                                            <div className="flex gap-4 mb-4">
                                                {[1, 2, 3].map(n => (
                                                    <button
                                                        key={n}
                                                        onClick={() => updateBlock(index, { columns: n, images: Array(n).fill("") })}
                                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                                                            ${block.columns === n ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}
                                                        `}
                                                    >
                                                        {n} Image{n > 1 && 's'}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className={`grid grid-cols-1 md:grid-cols-${block.columns} gap-4`}>
                                                {block.images.map((img: string, i: number) => (
                                                    <ImageUpload
                                                        key={i}
                                                        value={img}
                                                        onChange={(url) => {
                                                            const newImgs = [...block.images];
                                                            newImgs[i] = url;
                                                            updateBlock(index, { images: newImgs });
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {block.type === 'list' && (
                                        <div className="space-y-6">
                                            <input
                                                value={block.title}
                                                onChange={(e) => updateBlock(index, { title: e.target.value })}
                                                className="w-full bg-transparent text-xl font-heading font-medium text-zinc-900 focus:outline-none border-none"
                                                placeholder="List Title (Optional)"
                                            />
                                            <div className="space-y-3">
                                                {block.items.map((item: string, i: number) => (
                                                    <div key={i} className="flex gap-2">
                                                        <input
                                                            value={item}
                                                            onChange={(e) => {
                                                                const newItems = [...block.items];
                                                                newItems[i] = e.target.value;
                                                                updateBlock(index, { items: newItems });
                                                            }}
                                                            className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl py-2 px-4 text-sm"
                                                            placeholder="Point..."
                                                        />
                                                        <button onClick={() => updateBlock(index, { items: block.items.filter((_: any, idx: number) => idx !== i) })} className="text-zinc-200">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button onClick={() => updateBlock(index, { items: [...block.items, ""] })} className="text-[10px] font-bold text-razzmatazz uppercase tracking-widest">+ Add Point</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Metadata</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Article Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Topic / Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Estimate Read Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
                                    <input type="text" value={formData.read_time} onChange={(e) => setFormData({ ...formData, read_time: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 pl-10 pr-4 text-sm" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Cover Visual</h2>
                        <ImageUpload
                            value={formData.featured_image}
                            onChange={(url) => setFormData({ ...formData, featured_image: url })}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
