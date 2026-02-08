"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import type { User } from "../types/auth.types";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    });

    const login = useCallback((user: User, accessToken: string, refreshToken: string) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }, []);

    const updateUser = useCallback((user: User) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const userStr = localStorage.getItem("user");
            setUser(userStr ? JSON.parse(userStr) : null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
