"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Image as ImageIcon, Plus, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        slug: "",
        year: new Date().getFullYear().toString(),
        client: "",
        color: "#ff0059",
        description: "",
        services: [] as string[],
    });

    const [serviceInput, setServiceInput] = useState("");

    const addService = () => {
        if (serviceInput && !formData.services.includes(serviceInput)) {
            setFormData({ ...formData, services: [...formData.services, serviceInput] });
            setServiceInput("");
        }
    };

    const removeService = (service: string) => {
        setFormData({ ...formData, services: formData.services.filter(s => s !== service) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('projects')
                .insert([
                    {
                        ...formData,
                        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                    }
                ]);

            if (error) throw error;
            router.push("/admin/projects");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <Link href="/admin/projects" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} />
                        Back to Archive
                    </Link>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight">
                        New <span className="text-razzmatazz">Project</span>
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? "Saving..." : "Publish Project"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                            <div className="w-1 h-1 bg-razzmatazz rounded-full" />
                            Core Details
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
                                        placeholder="e.g. Rashu Cup 2024"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
                                        placeholder="e.g. Visual Identity"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Description / Brief</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors resize-none"
                                    placeholder="Write about the project intent, challenges and results..."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                            <div className="w-1 h-1 bg-razzmatazz rounded-full" />
                            Project Scope
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Services Provided</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addService()}
                                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
                                        placeholder="Add a service (e.g. Logo Design)"
                                    />
                                    <button
                                        onClick={addService}
                                        type="button"
                                        className="px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors font-bold"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {formData.services.map(service => (
                                        <span key={service} className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs rounded-full flex items-center gap-2 border border-zinc-200">
                                            {service}
                                            <button onClick={() => removeService(service)} className="hover:text-razzmatazz transition-colors">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                            <div className="w-1 h-1 bg-razzmatazz rounded-full" />
                            Context
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Client</label>
                                <input
                                    type="text"
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
                                    placeholder="e.g. Northend United"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Year</label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Accent Color</label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-2 py-1 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm text-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                            <ImageIcon size={24} className="text-zinc-300" />
                        </div>
                        <h3 className="text-sm font-medium text-zinc-900 mb-2">Assets Manager</h3>
                        <p className="text-xs text-zinc-400 italic mb-6">Uploading images will be available once the entry is saved.</p>
                        <button disabled className="w-full py-3 bg-zinc-50 text-zinc-300 rounded-xl text-xs font-bold uppercase tracking-widest cursor-not-allowed border border-zinc-100">
                            Upload Media _
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
