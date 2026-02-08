import { z } from "@/lib/zod-openapi";

export const LoginDto = z.object({
    email: z.string().email().openapi({
        example: "admin@cinema.com",
        description: "User email address"
    }),
    password: z.string().min(1).openapi({
        example: "admin123",
        description: "User password"
    }),
    rememberMe: z.boolean().optional().default(false).openapi({
        example: false,
        description: "Keep user logged in for 30 days"
    }),
}).openapi("LoginDto");

export type LoginDto = z.infer<typeof LoginDto>;

export const RefreshTokenDto = z.object({
    refreshToken: z.string().min(1).openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT refresh token"
    }),
    rememberMe: z.boolean().optional().default(false).openapi({
        example: false,
        description: "Extend token expiry"
    }),
}).openapi("RefreshTokenDto");

export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;

export const AuthResponseDto = z.object({
    user: z.object({
        id: z.string().openapi({ example: "cm5xabc123" }),
        email: z.string().email().openapi({ example: "admin@cinema.com" }),
        name: z.string().openapi({ example: "Admin User" }),
        role: z.enum(["ADMIN", "STAFF"]).openapi({ example: "ADMIN" }),
    }),
    accessToken: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT access token (valid for 2h or 30d if rememberMe)"
    }),
    refreshToken: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT refresh token (valid for 7d or 30d if rememberMe)"
    }),
}).openapi("AuthResponse");

export type AuthResponseDto = z.infer<typeof AuthResponseDto>;

export const TokenPairDto = z.object({
    accessToken: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "New JWT access token"
    }),
    refreshToken: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "New JWT refresh token"
    }),
}).openapi("TokenPair");

export type TokenPairDto = z.infer<typeof TokenPairDto>;
