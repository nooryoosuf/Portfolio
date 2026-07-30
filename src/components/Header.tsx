"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Journal", href: "/blog" },
    { name: "Connect", href: "/contact" },
];

export default function Header() {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-6 left-0 w-full z-50 px-6 pointer-events-none transform-gpu">
            <nav className="max-w-4xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-md border border-zinc-200/50 rounded-full px-8 py-3 pointer-events-auto shadow-sm relative transform-gpu">
                <Link href="/" className="text-xl font-heading font-semibold text-zinc-900 tracking-tight">
                    Noor<span className="text-razzmatazz">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-8 items-center">
                    {navLinks.slice(0, 4).map((link) => (
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

                {/* Desktop Connect Button */}
                <Link 
                    href="/contact" 
                    className="hidden md:block bg-zinc-900 text-white px-5 py-2 rounded-full text-[13px] font-medium hover:bg-zinc-800 transition-all duration-300 shadow-sm pointer-events-auto"
                >
                    Connect
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-zinc-900 focus:outline-none bg-zinc-50 rounded-full border border-zinc-100"
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Mobile Navigation Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -15, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-3xl p-6 shadow-2xl md:hidden flex flex-col gap-2 overflow-hidden z-50"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between text-base font-medium px-5 py-3.5 rounded-2xl transition-all ${
                                        link.name === 'Connect'
                                            ? 'bg-zinc-900 text-white mt-2 font-semibold'
                                            : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/70'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {link.name === 'Connect' && <ArrowUpRight size={18} className="text-razzmatazz" />}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
