"use client";
import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollController() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const positions = useRef<Record<string, number>>({});
    const isPopState = useRef(false);

    useEffect(() => {
        if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        const handlePopState = () => {
            isPopState.current = true;
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    useEffect(() => {
        const key = `${pathname}?${searchParams.toString()}`;

        if (isPopState.current) {
            const savedY = positions.current[key] ?? 0;
            window.scrollTo({ top: savedY, behavior: "instant" });
            isPopState.current = false;
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }

        const saveScroll = () => {
            positions.current[`${pathname}?${searchParams.toString()}`] = window.scrollY;
        };

        window.addEventListener("scroll", saveScroll, { passive: true });
        return () => window.removeEventListener("scroll", saveScroll);
    }, [pathname, searchParams]);

    return null;
}

export default function ScrollManager() {
    return (
        <Suspense fallback={null}>
            <ScrollController />
        </Suspense>
    );
}
