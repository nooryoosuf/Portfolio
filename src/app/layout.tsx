import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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
        <html lang="en" className="light" style={{ colorScheme: 'light' }}>
            <body className={`${inter.variable} ${outfit.variable} font-body antialiased selection:bg-black selection:text-white bg-white text-zinc-900`}>
                {children}
            </body>
        </html>
    );
}
