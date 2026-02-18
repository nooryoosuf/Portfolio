"use client";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminProjects() {
    return (
        <div>
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Project <span className="text-razzmatazz">Archive</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Managing {4} total projects in the system.</p>
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
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                            <th className="px-8 py-5">Project</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5">Year</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 sr-only">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {[1, 2, 3, 4].map((_, i) => (
                            <tr key={i} className="group hover:bg-zinc-50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex-shrink-0" />
                                        <span className="text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">Project Title {i + 1}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-zinc-600">Visual Identity</td>
                                <td className="px-8 py-6 text-sm text-zinc-400 italic">2024</td>
                                <td className="px-8 py-6">
                                    <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] uppercase tracking-tighter font-bold rounded">Live</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
