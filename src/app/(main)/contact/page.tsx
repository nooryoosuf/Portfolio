"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, ArrowUpRight, MessageSquare } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa6";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [contactEmail, setContactEmail] = useState("nooor.yoosuf@gmail.com");
    const [socials, setSocials] = useState([
        { name: "Instagram", handle: "@nooryoosuf", href: "https://instagram.com", icon: <FaInstagram size={24} />, color: "hover:text-pink-500 hover:border-pink-200" },
        { name: "Facebook", handle: "Noor Yoosuf", href: "https://facebook.com", icon: <FaFacebook size={24} />, color: "hover:text-blue-600 hover:border-blue-200" },
        { name: "Twitter / X", handle: "@nooryoosuf", href: "https://x.com", icon: <FaTwitter size={24} />, color: "hover:text-zinc-900 hover:border-zinc-400" },
        { name: "GitHub", handle: "nooryoosuf", href: "https://github.com/nooryoosuf", icon: <FaGithub size={24} />, color: "hover:text-zinc-900 hover:border-zinc-400" }
    ]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase.from('site_settings').select('*').single();
                if (data) {
                    if (data.contact_email) setContactEmail(data.contact_email);
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
                console.error("Error loading social settings:", err);
            }
        }
        fetchSettings();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        const mailtoSubject = encodeURIComponent(formData.subject || `Message from ${formData.name}`);
        const mailtoBody = encodeURIComponent(`Hi Noor,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`);
        
        setTimeout(() => {
            setSending(false);
            setSubmitted(true);
            window.location.href = `mailto:${contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
            setTimeout(() => setSubmitted(false), 5000);
        }, 600);
    };

    return (
        <div className="pt-40 pb-32 px-6 bg-white min-h-screen">
            <div className="max-w-5xl mx-auto">
                <header className="mb-20 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-razzmatazz italic mb-4 block">
                            Get In Touch
                        </span>
                        <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tight text-zinc-900 mb-6">
                            Let's <span className="text-razzmatazz">Connect</span>.
                        </h1>
                        <p className="text-zinc-500 text-lg font-light italic leading-relaxed">
                            Have an exciting project in mind, a collaboration inquiry, or just want to say hello? Send a message or catch me on my socials below.
                        </p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-white border border-zinc-100 text-razzmatazz">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-heading font-medium text-zinc-900">Send a Message</h2>
                                <p className="text-xs text-zinc-400 font-light italic">Directly reaches my primary inbox.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Alex Morgan"
                                        className="w-full bg-white border border-zinc-200/80 rounded-2xl py-4 px-5 text-zinc-900 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Your Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="alex@example.com"
                                        className="w-full bg-white border border-zinc-200/80 rounded-2xl py-4 px-5 text-zinc-900 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Project Inquiry / Collaboration"
                                    className="w-full bg-white border border-zinc-200/80 rounded-2xl py-4 px-5 text-zinc-900 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell me about your project or inquiry..."
                                    className="w-full bg-white border border-zinc-200/80 rounded-2xl py-4 px-5 text-zinc-900 text-sm focus:outline-none focus:border-zinc-400 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-sm font-medium hover:bg-zinc-800 transition-all duration-300 shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Send size={16} className="text-razzmatazz" />
                                {sending ? "Opening Mail..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>

                    {/* Direct Email & Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-razzmatazz/20 rounded-full blur-3xl" />
                            <FaEnvelope size={32} className="text-razzmatazz mb-6" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-2">Direct Mail</span>
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-xl md:text-2xl font-heading font-medium hover:text-razzmatazz transition-colors break-all block mb-4"
                            >
                                {contactEmail}
                            </a>
                            <p className="text-zinc-400 text-xs font-light italic">
                                Available for freelance opportunities, full-time roles, and technical consulting.
                            </p>
                        </div>

                        {/* Social Networks List */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 px-4 block">Social Networks</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {socials.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-6 bg-white border border-zinc-100 rounded-3xl flex items-center justify-between shadow-sm transition-all duration-300 group ${social.color}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-zinc-600 group-hover:scale-110 transition-transform">
                                                {social.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-zinc-900">{social.name}</h3>
                                                <span className="text-[11px] text-zinc-400 font-light">{social.handle}</span>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {submitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 z-[100]"
                        >
                            <CheckCircle2 className="text-razzmatazz" size={20} />
                            <span className="text-sm font-medium italic">Opening mail client to dispatch your message!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
