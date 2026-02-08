import { apiClient } from "@/lib/api-client";
import type { AuthResponse } from "../types/auth.types";

export async function authFetch(endpoint: string, data: object): Promise<AuthResponse> {
    return apiClient<AuthResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
}
