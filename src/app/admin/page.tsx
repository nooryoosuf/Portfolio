"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Users, Eye, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: "Total Projects", value: "0", icon: <Activity size={20} />, change: "Database Syncing..." },
        { label: "Active Clients", value: "0", icon: <Users size={20} />, change: "Stable" },
        { label: "Site Views", value: "0", icon: <Eye size={20} />, change: "Live" },
    ]);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const { data: projects, count } = await supabase
                    .from('projects')
                    .select('*', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (projects) {
                    setRecentProjects(projects);

                    // Get unique clients
                    const uniqueClients = new Set(projects.map(p => p.client).filter(Boolean)).size;

                    setStats([
                        { label: "Total Projects", value: count?.toString() || "0", icon: <Activity size={20} />, change: "Active" },
                        { label: "Unique Clients", value: uniqueClients.toString(), icon: <Users size={20} />, change: "Stable" },
                        { label: "System Status", value: "Online", icon: <Eye size={20} />, change: "Healthy" },
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

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

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-zinc-100" size={32} />
                    </div>
                ) : recentProjects.length > 0 ? (
                    <div className="space-y-4">
                        {recentProjects.map((project) => (
                            <div key={project.id} className="group p-6 bg-white border border-zinc-100 rounded-xl hover:border-zinc-200 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div
                                        className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-100 transition-all opacity-20"
                                        style={{ backgroundColor: project.color || '#f4f4f5' }}
                                    />
                                    <div>
                                        <h3 className="text-zinc-900 font-medium transition-colors">{project.title}</h3>
                                        <p className="text-zinc-500 text-sm italic">{project.category} • {project.year}</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/admin/projects`}
                                    className="text-xs uppercase tracking-widest font-bold text-zinc-300 hover:text-zinc-900 transition-colors"
                                >
                                    Configure _
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border border-dashed border-zinc-100 rounded-xl">
                        <p className="text-zinc-400 text-sm italic">No projects found in the system.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
