"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
];

export default function Header() {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    return (
        <header className="fixed top-6 left-0 w-full z-50 px-6 pointer-events-none">
            <nav className="max-w-4xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-md border border-zinc-200/50 rounded-full px-8 py-3 pointer-events-auto shadow-sm">
                <Link href="/" className="text-xl font-heading font-semibold text-zinc-900 tracking-tight">
                    Noor<span className="text-razzmatazz">.</span>
                </Link>



                <div className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors duration-300"
                            onMouseEnter={() => setHoveredLink(link.name)}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            {link.name}
                            {hoveredLink === link.name && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-zinc-900"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/contact"
                    className="bg-zinc-900 text-white px-5 py-2 rounded-full text-[13px] font-medium hover:bg-zinc-800 transition-all duration-300 shadow-sm"
                >
                    Connect
                </Link>
            </nav>
        </header>
    );
}

