"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryProvider } from "@/lib/query-provider";
import { useAuth } from "@/features/auth/context/AuthContext";

function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
        </QueryProvider>
    );
}
