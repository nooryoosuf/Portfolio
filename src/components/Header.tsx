"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Experiments", href: "/experiments" },
    { name: "About", href: "/about" },
    { name: "Journal", href: "/blog" },
];

function isActive(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme, mounted } = useTheme();
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "border-b border-zinc-200/80 bg-[var(--background)]/85 backdrop-blur-md dark:border-zinc-800/80"
                    : "border-b border-transparent bg-[var(--background)]/60 backdrop-blur-sm"
            }`}
        >
            <nav
                aria-label="Primary"
                className="shell flex h-16 items-center justify-between md:h-[72px]"
            >
                {/* Brand */}
                <div className="flex items-center gap-3.5">
                    <Link
                        href="/"
                        className="shrink-0 font-heading text-xl font-semibold tracking-tight text-zinc-950 dark:text-white"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Noor<span className="text-razzmatazz">.</span>
                        <span className="sr-only"> — home</span>
                    </Link>
                    <span
                        aria-hidden
                        className="hidden h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 lg:inline-block"
                    />
                    <span className="hidden text-xs font-normal tracking-wide text-zinc-400 dark:text-zinc-500 lg:inline-block">
                        UI/UX &amp; Brand Design
                    </span>
                </div>

                {/* Desktop Navigation — simple, clean horizontal links */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                aria-current={active ? "page" : undefined}
                                className={`relative py-1.5 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none ${
                                    active
                                        ? "text-zinc-950 dark:text-white"
                                        : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                                }`}
                            >
                                {link.name}
                                {active && (
                                    <motion.span
                                        layoutId="desktop-nav-underline"
                                        className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-razzmatazz"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Actions */}
                <div className="hidden shrink-0 items-center gap-2.5 md:flex">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle color theme"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                        {!mounted ? (
                            <span className="h-3.5 w-3.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        ) : theme === "dark" ? (
                            <Sun size={15} aria-hidden />
                        ) : (
                            <Moon size={15} aria-hidden />
                        )}
                    </button>
                    <Link
                        href="/contact"
                        className={`group inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors duration-200 ${
                            isActive(pathname, "/contact")
                                ? "bg-razzmatazz text-white"
                                : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                        }`}
                    >
                        Connect
                        <ArrowUpRight
                            size={14}
                            aria-hidden
                            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>
                </div>

                {/* Mobile controls */}
                <div className="flex shrink-0 items-center gap-1.5 md:hidden">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle color theme"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        {!mounted ? null : theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen((v) => !v)}
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    >
                        {isMenuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu — full-screen takeover */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-40 bg-[var(--background)] md:hidden"
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                            className="absolute right-6 top-24 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
                        >
                            <X size={19} aria-hidden />
                        </motion.button>
                        <motion.nav
                            aria-label="Mobile"
                            className="flex h-full flex-col justify-end px-8 pb-10 pt-28"
                        >
                            {[...navLinks, { name: "Connect", href: "/contact" }].map((link, i) => {
                                const active = isActive(pathname, link.href);
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 32 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                        transition={{ delay: 0.07 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="border-t border-zinc-200/80 last:border-b dark:border-zinc-800/80"
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            aria-current={active ? "page" : undefined}
                                            className={`group flex items-baseline gap-4 py-5 ${
                                                active ? "text-zinc-950 dark:text-white" : "text-zinc-400 dark:text-zinc-500"
                                            }`}
                                        >
                                            <span aria-hidden className="font-serif text-base italic text-razzmatazz">
                                                0{i + 1}
                                            </span>
                                            <span className="font-heading text-5xl font-medium tracking-tight transition-transform duration-300 ease-out group-active:scale-[0.98]">
                                                {link.name}
                                            </span>
                                            <ArrowUpRight
                                                size={26}
                                                aria-hidden
                                                className={`ml-auto shrink-0 self-center transition-all duration-300 ${
                                                    active ? "text-razzmatazz" : "text-zinc-300 dark:text-zinc-700"
                                                }`}
                                            />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45, duration: 0.4 }}
                                className="pt-8"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                                        Malé, Maldives — worldwide
                                    </p>
                                    <button
                                        onClick={toggleTheme}
                                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-[13px] font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                                    >
                                        {!mounted ? null : theme === "dark" ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
                                        {theme === "dark" ? "Light" : "Dark"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
