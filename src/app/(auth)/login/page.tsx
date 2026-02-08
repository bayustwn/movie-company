"use client";

import React, { useState, useEffect } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useTheme } from "next-themes";
import { Sun, Moon, Clapperboard, Monitor, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    {
        id: 1,
        icon: <Clapperboard className="w-12 h-12 text-white" />,
        title: "Movie",
        subtitle: "Company",
        description:
            "Effortlessly manage your productions, staff, and cinema network with our next-generation management tools.",
    },
    {
        id: 2,
        icon: <Monitor className="w-12 h-12 text-white" />,
        title: "Digital",
        subtitle: "Cinema",
        description:
            "Monitor real-time theatre statistics and distribution analytics across your entire circuit.",
    },
    {
        id: 3,
        icon: <Users className="w-12 h-12 text-white" />,
        title: "Staff",
        subtitle: "Pulse",
        description:
            "Seamlessly coordinate production crews and administrative staff with advanced collaboration features.",
    },
];

export default function LoginPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen w-full bg-white dark:bg-cinema-dark overflow-hidden transition-colors duration-500 font-sans text-cinema-dark dark:text-white">
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 xl:p-24 overflow-y-auto bg-white dark:bg-cinema-dark-alt transition-colors duration-500">
                <div className="max-w-md w-full mx-auto lg:mx-0 flex-1 flex flex-col justify-center">
                    <div className="mb-10 text-left">
                        <h1 className="text-3xl font-bold mb-2 leading-tight">Sign In</h1>
                        <p className="text-default-500 dark:text-gray-400 text-base font-medium">
                            Enter your email and password to sign in!
                        </p>
                    </div>

                    <LoginForm />
                </div>

                <div className="mt-12 text-center lg:text-left">
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                        &copy; 2026 bayu setiawan all right reserved
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-cinema-dark relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cinema-red/10 rounded-full blur-[120px]" />

                <div className="relative z-10 text-center max-w-lg w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cinema-red mb-8 shadow-2xl shadow-cinema-red/20">
                                {slides[currentSlide].icon}
                            </div>

                            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
                                {slides[currentSlide].title}
                                <span className="text-cinema-red">
                                    {slides[currentSlide].subtitle}
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg font-medium leading-relaxed min-h-20">
                                {slides[currentSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 flex justify-center gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 transition-all duration-300 rounded-full ${
                                    currentSlide === index
                                        ? "w-10 bg-cinema-red"
                                        : "w-3 bg-white/10 hover:bg-white/30"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 right-10 z-50">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-12 h-12 rounded-full bg-cinema-red flex items-center justify-center shadow-2xl shadow-cinema-red/30 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 group"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {!mounted ? null : theme === "dark" ? (
                            <Sun className="w-6 h-6 text-white group-hover:rotate-45 transition-transform" />
                        ) : (
                            <Moon className="w-6 h-6 text-white group-hover:-rotate-12 transition-transform" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
