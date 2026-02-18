"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error: any) {
            console.error("Error fetching projects:", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProject(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .match({ id });

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <div>
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Project <span className="text-razzmatazz">Archive</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Managing {projects.length} total projects in the system.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    Create New
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
                    />
                </div>
                <button className="px-5 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm">
                    <Filter size={18} className="text-zinc-400" />
                    Filter
                </button>
            </div>

            {/* Projects Table */}
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <Loader2 className="animate-spin" size={32} />
                        <p className="text-sm font-medium">Fetching from database...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <p className="text-sm font-medium">No projects found. Add your first one!</p>
                        <Link href="/admin/projects/new" className="text-razzmatazz hover:underline text-sm font-bold uppercase tracking-widest">Create New _</Link>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-8 py-5">Project</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Year</th>
                                <th className="px-8 py-5 sr-only">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {projects.map((project) => (
                                <tr key={project.id} className="group hover:bg-zinc-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-10 h-10 rounded-lg flex-shrink-0 opacity-20"
                                                style={{ backgroundColor: project.color || '#f4f4f5' }}
                                            />
                                            <span className="text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">{project.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-zinc-600">{project.category}</td>
                                    <td className="px-8 py-6 text-sm text-zinc-400 italic">{project.year}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/projects/edit/${project.id}`} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
