"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
    mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const isDark = document.documentElement.classList.contains("dark") || 
                localStorage.getItem("theme") === "dark" ||
                (!localStorage.getItem("theme") && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

            if (isDark) {
                setTheme("dark");
                document.documentElement.classList.add("dark");
            } else {
                setTheme("light");
                document.documentElement.classList.remove("dark");
            }
        } catch (e) {
            console.error("Theme initialization error:", e);
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
        if (next === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
