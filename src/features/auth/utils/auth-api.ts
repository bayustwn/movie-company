import type { AuthResponse } from "../types/auth.types";

export async function authFetch(endpoint: string, data: object): Promise<AuthResponse> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}
