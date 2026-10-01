import type { Metadata } from "next";
import { Inter, Outfit, Instrument_Serif } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://nooryoosuf.com"),
    title: {
        default: "Noor Yoosuf | UI/UX & Graphic Designer",
        template: "%s — Noor Yoosuf",
    },
    description:
        "Portfolio of Noor Yoosuf, a UI/UX and Graphic Designer from the Maldives specializing in branding, interfaces, and visual communication.",
    keywords: ["Noor Yoosuf", "UI/UX designer Maldives", "graphic designer", "branding", "web design", "portfolio"],
    authors: [{ name: "Noor Yoosuf" }],
    creator: "Noor Yoosuf",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Noor Yoosuf",
        title: "Noor Yoosuf | UI/UX & Graphic Designer",
        description:
            "Portfolio of Noor Yoosuf, a UI/UX and Graphic Designer from the Maldives specializing in branding, interfaces, and visual communication.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Noor Yoosuf | UI/UX & Graphic Designer",
        description:
            "Portfolio of Noor Yoosuf, a UI/UX and Graphic Designer from the Maldives specializing in branding, interfaces, and visual communication.",
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} ${instrumentSerif.variable} font-body antialiased selection:bg-razzmatazz selection:text-white bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300`}>
                <ThemeProvider>
                    <ScrollManager />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
