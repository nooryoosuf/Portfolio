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
            const saved = localStorage.getItem("theme");
            let shouldBeDark = false;

            if (saved === "dark") {
                shouldBeDark = true;
            } else if (saved === "light") {
                shouldBeDark = false;
            } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                shouldBeDark = true;
            }

            if (shouldBeDark) {
                setTheme("dark");
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
            } else {
                setTheme("light");
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
            }
        } catch (e) {
            console.error("Theme initialization error:", e);
        }
    }, []);

    const toggleTheme = () => {
        const isCurrentlyDark = document.documentElement.classList.contains("dark");
        const nextTheme: Theme = isCurrentlyDark ? "light" : "dark";

        setTheme(nextTheme);
        try {
            localStorage.setItem("theme", nextTheme);
        } catch (e) {}

        if (nextTheme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
