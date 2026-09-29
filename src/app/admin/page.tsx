"use client";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, FileText, Settings, ArrowUpRight, Activity, Plus, User, Zap, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Reveal from "@/components/ui/Reveal";
import StatCard from "@/components/admin/StatCard";
import ActivityChart from "@/components/admin/ActivityChart";
import CategoryDonut from "@/components/admin/CategoryDonut";
import ContentHealth from "@/components/admin/ContentHealth";

export default function AdminDashboard() {
    const [projects, setProjects] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [serviceCount, setServiceCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, blogRes, settingsRes] = await Promise.all([
                    supabase.from('projects').select('id, title, slug, category, created_at, client, featured_image, year').order('created_at', { ascending: false }),
                    supabase.from('blog_posts').select('id, title, slug, category, created_at, featured_image, description').order('created_at', { ascending: false }),
                    supabase.from('site_settings').select('services').single()
                ]);

                setProjects(projectsRes.data || []);
                setPosts(blogRes.data || []);
                setServiceCount(settingsRes.data?.services?.length || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const clients = useMemo(
        () => new Set(projects.map((p) => p.client).filter(Boolean)).size,
        [projects]
    );

    const categoryData = useMemo(() => {
        const m = new Map<string, number>();
        projects.forEach((p) => m.set(p.category || "Unsorted", (m.get(p.category || "Unsorted") || 0) + 1));
        return Array.from(m.entries())
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [projects]);

    const activity = useMemo(() => {
        const rows = [
            ...projects.slice(0, 4).map((p) => ({ kind: "Project" as const, ...p })),
            ...posts.slice(0, 3).map((p) => ({ kind: "Journal" as const, ...p })),
        ];
        return rows
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [projects, posts]);

    const health = useMemo(
        () => [
            {
                label: "Projects missing cover",
                archiveHref: "/admin/projects",
                items: projects
                    .filter((p) => !p.featured_image)
                    .map((p) => ({ id: p.id, title: p.title, editHref: `/admin/projects/edit?id=${p.id}` })),
            },
            {
                label: "Journal posts missing cover",
                archiveHref: "/admin/blog",
                items: posts
                    .filter((p) => !p.featured_image)
                    .map((p) => ({ id: p.id, title: p.title, editHref: `/admin/blog/edit?id=${p.id}` })),
            },
            {
                label: "Posts missing summary",
                archiveHref: "/admin/blog",
                items: posts
                    .filter((p) => !p.description)
                    .map((p) => ({ id: p.id, title: p.title, editHref: `/admin/blog/edit?id=${p.id}` })),
            },
            {
                label: "Projects missing client",
                archiveHref: "/admin/projects",
                items: projects
                    .filter((p) => !p.client)
                    .map((p) => ({ id: p.id, title: p.title, editHref: `/admin/projects/edit?id=${p.id}` })),
            },
        ],
        [projects, posts]
    );

    return (
        <div className="space-y-10 pb-16">
            <Reveal>
                <header className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="eyebrow flex items-center gap-3">
                            <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                            Studio
                        </p>
                        <h1 className="display mt-3 text-4xl md:text-5xl">Command center</h1>
                        <p className="lede mt-3 !text-base">
                            {loading ? "Gathering studio numbers…" : `${projects.length} works · ${posts.length} entries · ${clients} clients`}
                        </p>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="group inline-flex min-h-[48px] items-center gap-2 rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
                    >
                        View live site
                        <ExternalLink size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </header>
            </Reveal>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Reveal delay={0}>
                    <StatCard label="Active works" value={projects.length} icon={<LayoutGrid size={20} />} href="/admin/projects" sub={`${clients} clients`} />
                </Reveal>
                <Reveal delay={0.06}>
                    <StatCard label="Journal entries" value={posts.length} icon={<FileText size={20} />} href="/admin/blog" />
                </Reveal>
                <Reveal delay={0.12}>
                    <StatCard label="Client network" value={clients} icon={<User size={20} />} href="/admin/projects" />
                </Reveal>
                <Reveal delay={0.18}>
                    <StatCard label="Capabilities" value={serviceCount} icon={<Zap size={20} />} href="/admin/settings" />
                </Reveal>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <Reveal className="lg:col-span-7" delay={0.05}>
                    <section className="card-rest h-full p-6 md:p-8" aria-label="Publishing activity">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-950 dark:text-white">
                                <Activity size={15} aria-hidden className="text-razzmatazz" />
                                Publishing rhythm
                            </h2>
                            <span className="text-[12px] font-light text-zinc-400">Last 6 months</span>
                        </div>
                        {loading ? (
                            <p className="eyebrow animate-pulse py-16 text-center">Loading chart</p>
                        ) : (
                            <ActivityChart projects={projects} posts={posts} />
                        )}
                    </section>
                </Reveal>
                <Reveal className="lg:col-span-5" delay={0.1}>
                    <section className="card-rest h-full p-6 md:p-8" aria-label="Work by category">
                        <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-950 dark:text-white">
                            Work by category
                        </h2>
                        {loading ? (
                            <p className="eyebrow animate-pulse py-16 text-center">Loading chart</p>
                        ) : (
                            <CategoryDonut data={categoryData} />
                        )}
                    </section>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Recent activity */}
                <Reveal className="lg:col-span-7">
                    <div className="mb-4 flex items-center justify-between px-1">
                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-950 dark:text-white">
                            Latest activity
                        </h2>
                        <Link href="/admin/projects" className="link-underline text-[13px] text-zinc-500 dark:text-zinc-400">
                            View archive
                        </Link>
                    </div>
                    <div className="card-rest divide-y divide-zinc-200/70 overflow-hidden !rounded-2xl dark:divide-zinc-800/70">
                        {loading ? (
                            <p className="eyebrow animate-pulse px-6 py-12 text-center">Loading</p>
                        ) : activity.length > 0 ? (
                            activity.map((item) => (
                                <div key={`${item.kind}-${item.id}`} className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <span
                                            className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                                                item.kind === "Project"
                                                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                                    : "bg-razzmatazz/10 text-razzmatazz"
                                            }`}
                                        >
                                            {item.kind}
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="truncate font-heading text-[17px] font-medium tracking-tight text-zinc-950 dark:text-white">
                                                {item.title}
                                            </h3>
                                            <p className="text-[12px] font-light text-zinc-400 dark:text-zinc-500">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={item.kind === "Project" ? `/admin/projects/edit?id=${item.id}` : `/admin/blog/edit?id=${item.id}`}
                                        aria-label={`Edit ${item.title}`}
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:text-white"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="px-6 py-12 text-center font-serif text-xl italic text-zinc-400">Nothing published yet.</p>
                        )}
                    </div>
                </Reveal>

                {/* Health + actions */}
                <div className="space-y-8 lg:col-span-5">
                    <Reveal>
                        <h2 className="mb-4 px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-950 dark:text-white">
                            Content health
                        </h2>
                        {loading ? (
                            <p className="eyebrow animate-pulse py-8 text-center">Checking</p>
                        ) : (
                            <ContentHealth checks={health} />
                        )}
                    </Reveal>
                    <Reveal delay={0.05}>
                        <h2 className="mb-4 px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-950 dark:text-white">
                            Fast access
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <Link
                                href="/admin/projects/new"
                                className="group rounded-2xl bg-zinc-950 p-5 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                            >
                                <Plus size={20} aria-hidden className="mb-3 text-razzmatazz" />
                                <span className="block font-heading text-[17px] font-medium tracking-tight">New project</span>
                            </Link>
                            <Link href="/admin/blog/new" className="card-rest group block p-5">
                                <FileText size={20} aria-hidden className="mb-3 text-zinc-400 transition-colors group-hover:text-razzmatazz" />
                                <span className="block font-heading text-[17px] font-medium tracking-tight text-zinc-950 dark:text-white">Write journal</span>
                            </Link>
                            <Link href="/admin/settings" className="card-rest group block p-5">
                                <Settings size={20} aria-hidden className="mb-3 text-zinc-400 transition-colors group-hover:text-razzmatazz" />
                                <span className="block font-heading text-[17px] font-medium tracking-tight text-zinc-950 dark:text-white">Settings</span>
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
