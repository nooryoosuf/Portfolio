import Link from "next/link";
import { Instagram, Twitter, Linkedin, Github } from "lucide-react";

const socialLinks = [
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Github", href: "#", icon: Github },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-zinc-100 py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
                    <div>
                        <Link href="/" className="text-2xl font-heading font-semibold text-zinc-900 tracking-tight mb-4 block">
                            Noor<span className="text-razzmatazz">.</span>
                        </Link>


                        <p className="text-zinc-500 font-light max-w-sm">
                            Designing digital experiences with precision and purpose. Based in Maldives, working worldwide.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-8">
                        <div>
                            <h4 className="text-[13px] font-semibold text-zinc-900 uppercase tracking-widest mb-4">Navigation</h4>
                            <ul className="space-y-2">
                                {["Home", "Portfolio", "About", "Blog"].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-zinc-900 uppercase tracking-widest mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="mailto:nooooryoooosuf@gmail.com" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">
                                        Email
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-[13px] text-zinc-500">+960 9779872</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-100 gap-6">
                    <p className="text-[13px] text-zinc-400">
                        &copy; {new Date().getFullYear()} Noor Yoosuf. Crafted with care.
                    </p>
                    <div className="flex gap-6">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <social.icon size={18} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

