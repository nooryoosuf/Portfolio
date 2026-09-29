"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa6";
import { supabase } from "@/lib/supabase";
import AnimatedLink from "@/components/ui/AnimatedLink";

const NAV = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Journal", href: "/blog" },
    { name: "Connect", href: "/contact" },
];

export default function Footer() {
    const [contactEmail, setContactEmail] = useState("nooor.yoosuf@gmail.com");
    const [socials, setSocials] = useState([
        { name: "Instagram", href: "https://instagram.com", icon: <FaInstagram size={16} /> },
        { name: "Facebook", href: "https://facebook.com", icon: <FaFacebook size={16} /> },
        { name: "X", href: "https://x.com", icon: null },
        { name: "Github", href: "https://github.com/nooryoosuf", icon: <FaGithub size={16} /> },
    ]);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase.from("site_settings").select("*").single();
                if (data) {
                    let aboutData: any = {};
                    if (data.about_text) {
                        try { aboutData = JSON.parse(data.about_text); } catch (e) {}
                    }
                    if (aboutData.contact_email || data.contact_email) {
                        setContactEmail(aboutData.contact_email || data.contact_email);
                    }
                    if (data.social_links && Array.isArray(data.social_links)) {
                        setSocials((prev) =>
                            prev.map((s) => {
                                const found = data.social_links.find((l: any) =>
                                    l.platform?.toLowerCase().includes(s.name.toLowerCase())
                                );
                                if (found?.url) return { ...s, href: found.url };
                                return s;
                            })
                        );
                    }
                }
            } catch (err) {
                console.error("Error loading footer social settings:", err);
            }
        }
        fetchSettings();
    }, []);

    return (
        <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80">
            <div className="shell py-14 md:py-20">
                <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="font-heading text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                            Noor<span className="text-razzmatazz">.</span>
                        </Link>
                        <p className="mt-4 max-w-sm font-serif italic text-xl leading-snug text-zinc-500 dark:text-zinc-400">
                            Designing digital experiences with precision and purpose.
                        </p>
                        <p className="mt-3 text-sm font-light text-zinc-500 dark:text-zinc-400">
                            Based in the Maldives, working worldwide.
                        </p>
                        <div className="mt-6">
                            <AnimatedLink href={`mailto:${contactEmail}`} className="text-[15px]">
                                {contactEmail}
                            </AnimatedLink>
                        </div>
                    </div>

                    <nav aria-label="Footer">
                        <p className="eyebrow mb-5">Index</p>
                        <ul className="space-y-3">
                            {NAV.map((item) => (
                                <li key={item.name}>
                                    <AnimatedLink href={item.href} className="text-[15px] font-normal">
                                        {item.name}
                                    </AnimatedLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <p className="eyebrow mb-5">Elsewhere</p>
                        <ul className="space-y-3">
                            {socials.map((social) => (
                                <li key={social.name}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 text-[15px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                                    >
                                        {social.icon}
                                        {social.name}
                                        <ArrowUpRight
                                            size={14}
                                            aria-hidden
                                            className="text-zinc-300 dark:text-zinc-700 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-razzmatazz"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-6">
                    <p className="text-[13px] text-zinc-400 dark:text-zinc-500">
                        &copy; {new Date().getFullYear()} Noor Yoosuf. All rights reserved.
                    </p>
                    <p className="text-[13px] text-zinc-400 dark:text-zinc-500">
                        Mal&eacute; <span aria-hidden className="mx-1 text-zinc-300 dark:text-zinc-700">/</span> Available worldwide
                    </p>
                </div>
            </div>
        </footer>
    );
}
