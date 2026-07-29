"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutGrid,
    FileText,
    Settings,
    ArrowUpRight,
    Activity,
    Plus,
    Clock,
    User,
    Zap,
    Loader2,
    Edit,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        articles: 0,
        services: 0,
        clients: 0
    });
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, blogRes, settingsRes] = await Promise.all([
                    supabase.from('projects').select('id, title, category, created_at, client').order('created_at', { ascending: false }),
                    supabase.from('blog_posts').select('id'),
                    supabase.from('site_settings').select('services').single()
                ]);

                const uniqueClients = new Set(projectsRes.data?.map(p => p.client).filter(Boolean));

                setStats({
                    projects: projectsRes.data?.length || 0,
                    articles: blogRes.data?.length || 0,
                    services: settingsRes.data?.services?.length || 0,
                    clients: uniqueClients.size
                });

                setRecentProjects(projectsRes.data?.slice(0, 3) || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        { title: "Active Works", value: stats.projects, icon: <LayoutGrid size={24} />, color: "text-razzmatazz", link: "/admin/projects" },
        { title: "Journal Entries", value: stats.articles, icon: <FileText size={24} />, color: "text-zinc-600", link: "/admin/blog" },
        { title: "Client Network", value: stats.clients, icon: <User size={24} />, color: "text-zinc-600", link: "/admin/projects" },
        { title: "Defined Capabilities", value: stats.services, icon: <Zap size={24} />, color: "text-razzmatazz", link: "/admin/settings" },
    ];

    return (
        <div className="space-y-12 pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading font-medium text-zinc-900 tracking-tight mb-2">
                        Command <span className="text-razzmatazz">Center</span>
                    </h1>
                    <p className="text-zinc-500 font-light italic">System operational. Everything is running smoothly.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/" target="_blank" className="px-6 py-3 bg-white border border-zinc-100 rounded-xl text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all flex items-center gap-2 shadow-sm italic">
                        View Live Site
                        <ExternalLink size={14} />
                    </Link>
                </div>
            </header>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group"
                    >
                        <div className={`p-4 rounded-2xl bg-zinc-50 w-fit mb-8 group-hover:scale-110 transition-transform ${card.color}`}>
                            {card.icon}
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic block">{card.title}</span>
                            <span className="text-4xl font-heading font-medium text-zinc-900 block">{loading ? "—" : card.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Recent Activity */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 italic flex items-center gap-2">
                            <Activity size={16} className="text-razzmatazz" />
                            Recent Constructions
                        </h2>
                        <Link href="/admin/projects" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">View All Archive _</Link>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-zinc-100" size={32} /></div>
                        ) : (
                            <div className="divide-y divide-zinc-50">
                                {recentProjects.map((project) => (
                                    <div key={project.id} className="p-8 hover:bg-zinc-50 transition-colors group flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-200 font-heading text-xl">
                                                {project.title.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-razzmatazz block italic mb-1">{project.category}</span>
                                                <h3 className="text-lg font-medium text-zinc-900">{project.title}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-xs text-zinc-300 italic font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                                            <Link href={`/admin/projects/edit?id=${project.id}`} className="p-2 text-zinc-200 hover:text-zinc-900 transition-colors">
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 italic px-4">Fast Access</h2>
                    <div className="space-y-4">
                        <Link href="/admin/projects/new" className="block p-6 bg-zinc-900 text-white rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                            <Plus size={24} className="mb-4 text-razzmatazz" />
                            <span className="block text-xl font-heading font-medium tracking-tight mb-1">New Build</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Commission a case study</span>
                        </Link>
                        <Link href="/admin/blog/new" className="block p-6 bg-white border border-zinc-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <FileText size={20} className="mb-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            <span className="block text-xl font-heading font-medium tracking-tight mb-1">Write Journal</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Draft a new article</span>
                        </Link>
                        <Link href="/admin/settings" className="block p-6 bg-white border border-zinc-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <Settings size={20} className="mb-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            <span className="block text-xl font-heading font-medium tracking-tight mb-1">Global Site</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Update hero and services</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
