import { prisma } from "@/lib/prisma";
import {
    comparePassword,
    generateTokenPair,
    hashToken,
    verifyRefreshToken,
    compareToken,
} from "@/lib/auth";
import { LoginInput, RefreshInput } from "@/validators/auth.validator";
import { UserResponse, AuthResponse, TokenPair, ServiceError } from "@/types";

export { ServiceError };

export const authService = {
    async login(input: LoginInput): Promise<AuthResponse> {
        const { email, password, rememberMe } = input;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new ServiceError("Invalid email or password", 401);
        }

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new ServiceError("Invalid email or password", 401);
        }

        const tokens = generateTokenPair(
            { userId: user.id, email: user.email, role: user.role },
            rememberMe
        );

        const hashedRefreshToken = await hashToken(tokens.refreshToken);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            ...tokens,
        };
    },

    async refreshTokens(input: RefreshInput): Promise<TokenPair> {
        const { refreshToken, rememberMe } = input;

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            throw new ServiceError("Invalid or expired refresh token", 401);
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user || !user.refreshToken) {
            throw new ServiceError("User not found or session invalidated", 401);
        }

        const isValidToken = await compareToken(refreshToken, user.refreshToken);
        if (!isValidToken) {
            throw new ServiceError("Invalid refresh token", 401);
        }

        const tokens = generateTokenPair(
            { userId: user.id, email: user.email, role: user.role },
            rememberMe
        );

        const hashedRefreshToken = await hashToken(tokens.refreshToken);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });

        return tokens;
    },

    async logout(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    },

    async getUserById(userId: string): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new ServiceError("User not found", 404);
        }

        return user;
    },
};
