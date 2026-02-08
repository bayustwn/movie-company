"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.name}!</p>

            <div style={{ margin: "20px 0", border: "1px solid #ccc", padding: "10px" }}>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Role:</strong> {user.role}
                </p>
            </div>

            <button onClick={handleLogout} style={{ padding: "5px 10px", cursor: "pointer" }}>
                Logout
            </button>
        </div>
    );
}
