"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    // If already signed in, bounce to the dashboard (non-blocking).
    useEffect(() => {
        let cancelled = false;
        supabase.auth
            .getSession()
            .then(({ data }) => {
                if (!cancelled && data.session) router.replace("/admin");
            })
            .catch((err) => console.error("[admin-login] session lookup failed", err));
        return () => {
            cancelled = true;
        };
    }, [router]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
            setBusy(false);
        } else {
            router.replace("/admin");
        }
    }

    const inputCls =
        "min-h-[52px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3.5 px-5 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors";

    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6">
            <div className="text-center">
                <p className="font-heading text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    Noor<span className="text-razzmatazz">.</span>
                    <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                        Studio
                    </span>
                </p>
                <h1 className="display mt-6 text-4xl">Welcome back.</h1>
                <p className="lede mt-3 !text-base">Sign in to manage projects, journal and site settings.</p>
            </div>

            <form onSubmit={onSubmit} className="card-rest mt-9 space-y-5 p-7 md:p-8">
                <div>
                    <label htmlFor="admin-email" className="eyebrow mb-2 block">Email</label>
                    <input
                        id="admin-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls}
                    />
                </div>
                <div>
                    <label htmlFor="admin-password" className="eyebrow mb-2 block">Password</label>
                    <input
                        id="admin-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputCls}
                    />
                </div>

                {error && (
                    <p role="alert" className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-light text-red-700 dark:text-red-300">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-zinc-950 px-8 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                    {busy ? <Loader2 size={17} aria-hidden className="animate-spin" /> : <Lock size={16} aria-hidden />}
                    {busy ? "Signing in…" : "Sign in"}
                </button>
            </form>

            <p className="mt-6 text-center text-[13px] font-light text-zinc-400 dark:text-zinc-500">
                Supabase email login — create the user in Dashboard › Authentication › Users first.
            </p>
        </div>
    );
}
