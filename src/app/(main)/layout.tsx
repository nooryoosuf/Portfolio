import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import PageTransition from "@/components/PageTransition";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SmoothScrolling>
            <Header />
            <PageTransition>
                <main className="min-h-screen">
                    {children}
                </main>
            </PageTransition>
            <Footer />
        </SmoothScrolling>
    );
}
