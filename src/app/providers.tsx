"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
