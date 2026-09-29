"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, FileText, Settings, LogOut, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);
    const [slow, setSlow] = useState(false);

    const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const isLogin = cleanPath === "/admin/login";

    useEffect(() => {
        if (isLogin) {
            setChecking(false);
            return;
        }
        let cancelled = false;
        console.log("[admin] guard running, path =", pathname);
        const timer = setTimeout(() => {
            if (!cancelled) {
                console.error("[admin] session check timed out, redirecting to login");
                router.replace("/admin/login");
            }
        }, 6000);
        supabase.auth
            .getSession()
            .then(({ data }) => {
                console.log("[admin] getSession resolved, has session =", !!data.session);
                if (cancelled) return;
                clearTimeout(timer);
                setChecking(false);
                if (!data.session) {
                    router.replace("/admin/login");
                } else {
                    setAuthorized(true);
                }
            })
            .catch((err) => {
                console.error("[admin] session check failed", err);
                clearTimeout(timer);
                if (!cancelled) router.replace("/admin/login");
            });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) router.replace("/admin/login");
        });
        return () => {
            cancelled = true;
            clearTimeout(timer);
            listener.subscription.unsubscribe();
        };
    }, [isLogin, router]);

    async function logout() {
        await supabase.auth.signOut();
        router.replace("/admin/login");
    }

    if (isLogin) {
        return (
            <div className="min-h-screen bg-[var(--background)] font-body text-zinc-600 dark:text-zinc-300">
                <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
            </div>
        );
    }

    useEffect(() => {
        if (!checking) return;
        const t = setTimeout(() => setSlow(true), 10000);
        return () => clearTimeout(t);
    }, [checking]);

    if (checking || !authorized) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-6 text-center" aria-label="Checking access">
                <p className="eyebrow animate-pulse">Checking access</p>
                {slow && (
                    <p className="max-w-sm text-sm font-light text-zinc-500 dark:text-zinc-400">
                        Taking too long? Your browser is likely running cached files — hard-refresh
                        with <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:border-zinc-800">Ctrl+Shift+R</kbd>
                    </p>
                )}
            </div>
        );
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={17} /> },
        { label: "Projects", href: "/admin/projects", icon: <FolderKanban size={17} /> },
        { label: "Journal", href: "/admin/blog", icon: <FileText size={17} /> },
        { label: "Settings", href: "/admin/settings", icon: <Settings size={17} /> },
    ];

    const isActive = (href: string) =>
        href === "/admin" ? cleanPath === "/admin" : cleanPath === href || cleanPath.startsWith(`${href}/`);

    return (
        <div className="min-h-screen bg-[var(--background)] font-body text-zinc-600 dark:text-zinc-300">
            {/* Sidebar — desktop */}
            <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-64 flex-col border-r border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 md:flex">
                <div className="px-7 pb-6 pt-8">
                    <p className="font-heading text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                        Noor<span className="text-razzmatazz">.</span>
                        <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                            Studio
                        </span>
                    </p>
                </div>

                <nav className="flex-1 space-y-1 px-4" aria-label="Admin">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                    active
                                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                                {active && <span aria-hidden className="ml-auto h-1.5 w-1.5 rounded-full bg-razzmatazz" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-1 border-t border-zinc-200/80 p-4 dark:border-zinc-800/80">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        <ExternalLink size={17} />
                        View live site
                    </Link>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                    >
                        <LogOut size={17} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Top bar — mobile */}
            <div className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[var(--background)]/90 backdrop-blur-md dark:border-zinc-800/80 md:hidden">
                <div className="flex items-center justify-between px-5 py-3.5">
                    <p className="font-heading text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                        Noor<span className="text-razzmatazz">.</span>
                        <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                            Studio
                        </span>
                    </p>
                    <button
                        onClick={logout}
                        aria-label="Log out"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
                <nav className="flex gap-1 overflow-x-auto px-4 pb-3" aria-label="Admin">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                                    active
                                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                        : "text-zinc-500 dark:text-zinc-400"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main content */}
            <main className="px-5 py-8 md:ml-64 md:px-10 md:py-10">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    );
}
