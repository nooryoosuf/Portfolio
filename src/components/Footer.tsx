"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaGithub } from "react-icons/fa6";
import { supabase } from "@/lib/supabase";

export default function Footer() {
    const [contactEmail, setContactEmail] = useState("nooor.yoosuf@gmail.com");
    const [socials, setSocials] = useState([
        { name: "Instagram", href: "https://instagram.com", icon: <FaInstagram size={18} /> },
        { name: "Facebook", href: "https://facebook.com", icon: <FaFacebook size={18} /> },
        { name: "Twitter", href: "https://x.com", icon: <FaTwitter size={18} /> },
        { name: "Github", href: "https://github.com/nooryoosuf", icon: <FaGithub size={18} /> },
    ]);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase.from('site_settings').select('*').single();
                if (data) {
                    let aboutData: any = {};
                    if (data.about_text) {
                        try { aboutData = JSON.parse(data.about_text); } catch (e) {}
                    }
                    if (aboutData.contact_email || data.contact_email) {
                        setContactEmail(aboutData.contact_email || data.contact_email);
                    }
                    if (data.social_links && Array.isArray(data.social_links)) {
                        setSocials(prev => prev.map(s => {
                            const found = data.social_links.find((l: any) => l.platform?.toLowerCase().includes(s.name.toLowerCase()));
                            if (found && found.url) {
                                return { ...s, href: found.url };
                            }
                            return s;
                        }));
                    }
                }
            } catch (err) {
                console.error("Error loading footer social settings:", err);
            }
        }
        fetchSettings();
    }, []);

    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-20 px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
                    <div>
                        <Link href="/" className="text-2xl font-heading font-semibold text-zinc-900 dark:text-white tracking-tight mb-4 block">
                            Noor<span className="text-razzmatazz">.</span>
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-sm">
                            Designing digital experiences with precision and purpose. Based in Maldives, working worldwide.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-12">
                        <div>
                            <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Navigation</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Home", href: "/" },
                                    { name: "Portfolio", href: "/portfolio" },
                                    { name: "About", href: "/about" },
                                    { name: "Journal", href: "/blog" },
                                    { name: "Connect", href: "/contact" }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href={`mailto:${contactEmail}`} className="text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        {contactEmail}
                                    </a>
                                </li>
                                <li>
                                    <span className="text-[13px] text-zinc-500 dark:text-zinc-400">+960 9779872</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-100 dark:border-zinc-900 gap-6">
                    <p className="text-[13px] text-zinc-400 dark:text-zinc-500">
                        &copy; {new Date().getFullYear()} Noor Yoosuf. Crafted with care.
                    </p>
                    <div className="flex gap-6">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={social.name}
                                className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
