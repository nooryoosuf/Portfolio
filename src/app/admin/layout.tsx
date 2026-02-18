"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, FileText, Settings, LogOut, ExternalLink } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
        { label: "Projects", href: "/admin/projects", icon: <FolderKanban size={18} /> },
        { label: "Blog Posts", href: "/admin/blog", icon: <FileText size={18} /> },
        { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-600 font-inter selection:bg-black selection:text-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-200 bg-white z-50">
                <div className="p-8">
                    <div className="text-zinc-900 font-heading font-bold text-xl tracking-tighter mb-12 flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-900 rounded-sm rotate-45 flex items-center justify-center">
                            <span className="-rotate-45 text-white text-xs">P</span>
                        </div>
                        ADMIN<span className="text-razzmatazz">.</span>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                            ? "bg-zinc-100 text-zinc-900 border border-zinc-200"
                                            : "hover:bg-zinc-50 hover:text-zinc-900"
                                        }`}
                                >
                                    <span className={`${isActive ? "text-razzmatazz" : "text-zinc-400 group-hover:text-razzmatazz transition-colors"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-medium"
                    >
                        <ExternalLink size={18} />
                        View Live Site
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-500 transition-colors text-sm font-medium mt-2">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-12">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
    );
}
