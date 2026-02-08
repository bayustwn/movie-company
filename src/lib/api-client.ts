export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const response = await fetch(endpoint, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const errorMessage = data.error || data.message || "Request failed";
        throw new Error(errorMessage);
    }

    return data as T;
}
