import { ReactNode } from "react";
import { QueryProvider } from "@/lib/query-provider";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                {children}
            </div>
        </QueryProvider>
    );
}
