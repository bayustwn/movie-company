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
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                Welcome back, <span className="text-cinema-red font-bold">{user.name}</span>!
            </p>

            <div className="bg-gray-50 dark:bg-cinema-dark-alt border border-gray-200 dark:border-white/10 rounded-xl p-6 mb-8 flex flex-col gap-3">
                <p className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                    <strong className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Email
                    </strong>
                    <span className="text-sm font-medium">{user.email}</span>
                </p>
                <p className="flex items-center justify-between pt-1">
                    <strong className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Role
                    </strong>
                    <span className="bg-cinema-red/10 text-cinema-red text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {user.role}
                    </span>
                </p>
            </div>

            <button
                onClick={handleLogout}
                className="bg-cinema-red text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-cinema-red/20 hover:opacity-90 active:scale-95 transition-all"
            >
                Logout
            </button>
        </div>
    );
}
