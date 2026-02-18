"use client";
import { motion } from "framer-motion";
import { Activity, Users, Eye, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const stats = [
        { label: "Total Projects", value: "12", icon: <Activity size={20} />, change: "+2 this month" },
        { label: "Active Clients", value: "5", icon: <Users size={20} />, change: "Stable" },
        { label: "Site Views", value: "1.2k", icon: <Eye size={20} />, change: "+15%" },
    ];

    return (
        <div>
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        System <span className="text-razzmatazz">Overview</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">Welcome back, Noor. Database is synced and active.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    Add Project
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-white border border-zinc-200 rounded-2xl relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 text-zinc-100 group-hover:text-zinc-200 transition-colors">
                            {stat.icon}
                        </div>
                        <span className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4 block">
                            {stat.label}
                        </span>
                        <div className="text-4xl font-heading text-zinc-900 font-medium mb-2">
                            {stat.value}
                        </div>
                        <div className="text-[10px] text-razzmatazz font-medium tracking-wider uppercase">
                            {stat.change}
                        </div>
                        {/* Accent line */}
                        <div className="absolute bottom-0 left-0 h-1 bg-razzmatazz w-0 group-hover:w-full transition-all duration-500" />
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <section>
                <h2 className="text-xl font-heading font-medium text-zinc-900 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-razzmatazz rounded-full" />
                    Recent Projects
                </h2>

                <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="group p-6 bg-white border border-zinc-100 rounded-xl hover:border-zinc-200 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 grayscale-0 group-hover:scale-105 transition-all">
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200" />
                                </div>
                                <div>
                                    <h3 className="text-zinc-900 font-medium transition-colors">Rashu Cup 2024</h3>
                                    <p className="text-zinc-500 text-sm italic">Visual Identity • Updated 2 days ago</p>
                                </div>
                            </div>
                            <Link
                                href={`/admin/projects/edit/${i}`}
                                className="text-xs uppercase tracking-widest font-bold text-zinc-300 hover:text-zinc-900 transition-colors"
                            >
                                Configure _
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
