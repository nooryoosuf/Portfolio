"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
];

export default function Header() {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-6 left-0 w-full z-50 px-6 pointer-events-none">
            <nav className="max-w-4xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-md border border-zinc-200/50 rounded-full px-8 py-3 pointer-events-auto shadow-sm relative">
                <Link href="/" className="text-xl font-heading font-semibold text-zinc-900 tracking-tight">
                    Noor<span className="text-razzmatazz">.</span>
                </Link>

                {/* Desktop Nav */}
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

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-1 text-zinc-900 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-4 bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl md:hidden flex flex-col gap-4 overflow-hidden"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 hover:bg-zinc-50 rounded-xl transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
