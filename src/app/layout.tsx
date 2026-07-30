import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ScrollManager from "@/components/ScrollManager";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Noor Yoosuf | UI/UX & Graphic Designer",
    description: "Portfolio of Noor Yoosuf, a UI/UX and Graphic Designer specializing in branding, digital illustrations, and visual communication.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-body antialiased selection:bg-razzmatazz selection:text-white bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300`}>
                <ThemeProvider>
                    <ScrollManager />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
