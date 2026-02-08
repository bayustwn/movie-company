export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthResponse {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    type: "access" | "refresh";
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
}

export const USER_SELECT = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} as const;
