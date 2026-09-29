"use client";
import { useEffect, useState } from "react";
import { Send, Loader2, CheckCircle2, ArrowUpRight } from "lucide-react";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa6";
import { supabase } from "@/lib/supabase";
import Reveal from "@/components/ui/Reveal";
import AnimatedLink from "@/components/ui/AnimatedLink";

export default function Contact() {
    const [contactEmail, setContactEmail] = useState("nooor.yoosuf@gmail.com");
    const [socials, setSocials] = useState([
        { name: "Instagram", handle: "@nooryoosuf", href: "https://instagram.com", icon: <FaInstagram size={18} /> },
        { name: "Facebook", handle: "Noor Yoosuf", href: "https://facebook.com", icon: <FaFacebook size={18} /> },
        { name: "X", handle: "@nooryoosuf", href: "https://x.com", icon: null },
        { name: "Github", handle: "nooryoosuf", href: "https://github.com/nooryoosuf", icon: <FaGithub size={18} /> }
    ]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
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
        setSendError(null);
        try {
            const { error } = await supabase.from("messages").insert({
                name: form.name.trim(),
                email: form.email.trim(),
                message: form.message.trim(),
            });
            if (error) throw error;
            setSent(true);
            setForm({ name: "", email: "", message: "" });
        } catch (err: any) {
            console.error("Error sending message:", err);
            setSendError(
                err?.message ||
                    "Couldn't send just now — your message is safe in the form. Try again or email me directly below."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="shell pt-40 pb-32 text-center" aria-label="Loading contact">
                <p className="eyebrow animate-pulse">Opening channels</p>
            </div>
        );
    }

    const inputCls = "min-h-[52px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3.5 px-5 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors";

    return (
        <div className="shell pt-32 md:pt-44 pb-20 md:pb-28">
            <header className="max-w-3xl">
                <Reveal>
                    <p className="eyebrow flex items-center gap-3">
                        <span aria-hidden className="inline-block h-px w-8 bg-razzmatazz" />
                        Connect
                    </p>
                    <h1 className="display mt-5 text-5xl sm:text-6xl md:text-7xl">
                        Let&apos;s <em className="serif-accent text-razzmatazz">talk.</em>
                    </h1>
                    <p className="lede mt-6">
                        A project in mind, a question, or just a hello — write directly, or find me elsewhere.
                    </p>
                    <p className="mt-6">
                        <AnimatedLink href={`mailto:${contactEmail}`} className="text-lg">
                            {contactEmail}
                        </AnimatedLink>
                    </p>
                </Reveal>
            </header>

            <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                {/* Elsewhere — hairline rows */}
                <Reveal>
                    <h2 className="eyebrow mb-2">Elsewhere</h2>
                    <ul>
                        {socials.map((s) => (
                            <li key={s.name} className="border-b border-zinc-200/80 dark:border-zinc-800/80 first:border-t">
                                <a
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex min-h-[64px] items-center gap-4 py-4"
                                >
                                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 group-hover:border-razzmatazz group-hover:text-razzmatazz">
                                        {s.icon}
                                    </span>
                                    <span className="flex-1">
                                        <span className="block font-heading text-lg font-medium tracking-tight text-zinc-950 dark:text-white">{s.name}</span>
                                        <span className="block text-[13px] font-light text-zinc-400 dark:text-zinc-500">{s.handle}</span>
                                    </span>
                                    <ArrowUpRight size={18} aria-hidden className="text-zinc-300 dark:text-zinc-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-razzmatazz" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                {/* Form */}
                <Reveal delay={0.08}>
                    <div className="card-rest p-7 md:p-10">
                        <h2 className="font-heading text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">Send a message</h2>
                        {sent ? (
                            <div className="py-10 text-center">
                                <CheckCircle2 size={44} aria-hidden className="mx-auto text-razzmatazz" />
                                <p className="display mt-5 text-2xl">Message received.</p>
                                <p className="lede mt-3 !text-base">Thank you for reaching out — I&apos;ll reply shortly.</p>
                                <button onClick={() => setSent(false)} className="link-underline mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                                    Send another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                                <div>
                                    <label htmlFor="contact-name" className="eyebrow mb-2 block">Your name</label>
                                    <input
                                        id="contact-name"
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Jane Doe"
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="eyebrow mb-2 block">Your email</label>
                                    <input
                                        id="contact-email"
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="jane@example.com"
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="eyebrow mb-2 block">Message</label>
                                    <textarea
                                        id="contact-message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Tell me about your project…"
                                        className={`${inputCls} resize-y`}
                                    />
                                </div>
                                {sendError && (
                                    <p role="alert" className="rounded-xl border border-red-200 px-4 py-3 text-sm font-light text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                                        {sendError}{" "}
                                        <a href={`mailto:${contactEmail}`} className="font-medium underline underline-offset-2">
                                            Email me instead
                                        </a>
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-zinc-950 px-8 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={17} aria-hidden /> : <Send size={17} aria-hidden />}
                                    {submitting ? "Sending…" : "Send message"}
                                </button>
                            </form>
                        )}
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
