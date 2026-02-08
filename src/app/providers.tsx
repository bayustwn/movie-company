"use client";

import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <HeroUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="light">
                <ToastProvider placement="top-right" />
                <AuthProvider>{children}</AuthProvider>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
