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

export const USER_SELECT = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} as const;
