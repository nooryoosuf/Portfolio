"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
    const cursorY = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });

    useEffect(() => {
        if (window.matchMedia("(pointer: fine)").matches === false) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setEnabled(true);
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX - 10);
            cursorY.set(e.clientY - 10);
        };

        const handleMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === "A" ||
                (e.target as HTMLElement).tagName === "BUTTON" ||
                (e.target as HTMLElement).closest("a") ||
                (e.target as HTMLElement).closest("button")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (!enabled) return null;

    return (
        <motion.div
            aria-hidden
            style={{
                translateX: cursorX,
                translateY: cursorY,
            }}
            className={`fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block bg-white transition-transform duration-300 ${isHovering ? "scale-[2.2]" : "scale-100"
                }`}
        />
    );
}
