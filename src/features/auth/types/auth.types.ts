import { ApiResponse, AuthResponse as CoreAuthResponse, UserRole } from "@/core/types";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export type AuthResponse = ApiResponse<CoreAuthResponse>;

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
