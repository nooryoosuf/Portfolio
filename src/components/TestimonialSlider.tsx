"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
    {
        id: 1,
        text: "Noor transformed our brand identity into something truly spectacular. The attention to detail and creative flair is unmatched.",
        author: "Ahmed Hassan",
        role: "CEO, Northend United",
    },
    {
        id: 2,
        text: "Working with Noor was a breeze. He took our vague ideas and turned them into a polished, professional UI that our users love.",
        author: "Mariyam Ali",
        role: "Product Manager, Feithoriya",
    },
    {
        id: 3,
        text: "The visual communication strategy developed for our project was game-changing. Truly a talented designer with a bright future.",
        author: "Zayan Ibrahim",
        role: "Founder, Lantern Futsal Club",
    },
];

export default function TestimonialSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-64 flex flex-col justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <p className="text-xl md:text-3xl font-medium text-white/80 leading-relaxed mb-8">
                        "{testimonials[index].text}"
                    </p>
                    <div className="flex flex-col items-center">
                        <span className="text-spring-green font-heading font-bold uppercase tracking-widest">
                            {testimonials[index].author}
                        </span>
                        <span className="text-white/30 text-sm italic">
                            {testimonials[index].role}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-auto pt-48">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${index === i ? "bg-spring-green w-8" : "bg-white/20"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
