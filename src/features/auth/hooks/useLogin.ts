"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../utils/auth-api";
import type { LoginCredentials } from "../types/auth.types";

export function useLogin() {
    const router = useRouter();
    const { login } = useAuth();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authFetch("/api/auth/login", credentials),
        onSuccess: (data) => {
            if (data.data) {
                login(data.data.user, data.data.accessToken, data.data.refreshToken);
                router.push("/dashboard");
            }
        },
    });
}
