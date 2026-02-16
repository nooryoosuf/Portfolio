import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import PageTransition from "@/components/PageTransition";

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
        <html lang="en" className="light">
            <body className={`${inter.variable} ${outfit.variable} font-body antialiased selection:bg-black selection:text-white`}>
                <SmoothScrolling>
                    <Header />
                    <PageTransition>
                        <main className="min-h-screen">
                            {children}
                        </main>
                    </PageTransition>
                    <Footer />
                </SmoothScrolling>
            </body>
        </html>
    );
}

