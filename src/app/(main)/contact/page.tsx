"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaGithub } from "react-icons/fa6";
import { supabase } from "@/lib/supabase";

export default function Contact() {
    const [contactEmail, setContactEmail] = useState("nooor.yoosuf@gmail.com");
    const [socials, setSocials] = useState([
        { name: "Instagram", handle: "@nooryoosuf", href: "https://instagram.com", icon: <FaInstagram size={20} /> },
        { name: "Facebook", handle: "Noor Yoosuf", href: "https://facebook.com", icon: <FaFacebook size={20} /> },
        { name: "Twitter", handle: "@nooryoosuf", href: "https://x.com", icon: <FaTwitter size={20} /> },
        { name: "Github", handle: "nooryoosuf", href: "https://github.com/nooryoosuf", icon: <FaGithub size={20} /> }
    ]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", message: "" });

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
                            const found = data.social_links.find((l: any) => l.platform?.toLowerCase().includes(s.name.split(' ')[0].toLowerCase()));
                            if (found) {
                                return {
                                    ...s,
                                    handle: found.handle || s.handle,
                                    href: found.url || s.href
                                };
                            }
                            return s;
                        }));
                    }
                }
            } catch (err) {
                console.error("Error fetching contact settings:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            setSent(true);
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            alert("Error sending message.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-40 pb-32 px-6 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-widest uppercase mb-4 block">Connect</span>
                        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tight text-zinc-900 dark:text-white mb-8">
                            Let's <span className="text-razzmatazz">talk.</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
                            Have a project in mind, a question, or just want to say hi? Drop me a line below or reach out on my socials.
                        </p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Social Handles Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">Social Handles</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {socials.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-300 flex items-center gap-5 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-900 dark:text-white shadow-sm border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-zinc-900 dark:text-white">{s.name}</h4>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">{s.handle}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-900/90 text-white space-y-3 mt-8">
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">Direct Mail</span>
                            <a href={`mailto:${contactEmail}`} className="text-xl font-heading font-medium block hover:text-razzmatazz transition-colors">
                                {contactEmail}
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 bg-zinc-50 dark:bg-zinc-900/60 p-8 md:p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800/80"
                    >
                        <h3 className="text-2xl font-heading font-medium text-zinc-900 dark:text-white mb-8">Send a Message</h3>
                        {sent ? (
                            <div className="p-12 text-center space-y-4">
                                <CheckCircle2 size={48} className="text-razzmatazz mx-auto" />
                                <h4 className="text-2xl font-heading font-medium text-zinc-900 dark:text-white">Message Received!</h4>
                                <p className="text-zinc-500 dark:text-zinc-400 font-light">Thank you for reaching out. I'll get back to you shortly.</p>
                                <button onClick={() => setSent(false)} className="px-6 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Your Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Tell me about your project..."
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    <span>{submitting ? "Sending..." : "Send Message"}</span>
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
